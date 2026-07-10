import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { fetchWithAuth } from '../lib/authFetch';
import { getApiUrl } from '../lib/origin';
import { createQuiz } from '../lib/db';
import { Question } from '../types';
import { generateQuizWithFallback } from './useQuizzes';


export interface ProgressState {
  current: number;
  total: number;
  stage: 'scanning' | 'generating' | 'saving' | 'complete';
  message: string;
}

export function useQuizGenerator() {
  const queryClient = useQueryClient();
  const [progress, setProgress] = React.useState<ProgressState | null>(null);

  const generatorMutation = useMutation({
    mutationFn: async (params: {
      type: 'topic' | 'pasted_text' | 'file_direct';
      topic?: string;
      text?: string;
      fileUri?: string;
      fileUploadName?: string;
      mimeType?: string;
      totalPages?: number;
      extractionMode?: 'literal' | 'generate';
      customInstruction?: string;
      totalQuestions: number;
      userId: string;
      creatorName: string;
      category: string;
    }) => {
      const {
        type,
        topic,
        text,
        fileUri,
        fileUploadName,
        mimeType,
        totalPages,
        extractionMode,
        customInstruction,
        totalQuestions,
        userId,
        creatorName,
        category,
      } = params;

      setProgress({
        current: 0,
        total: totalQuestions,
        stage: 'generating',
        message: 'جاري تهيئة عملية التوليد...',
      });

      let accumulatedQuestions: any[] = [];
      let finalTitle = '';
      let finalDescription = '';

      const BATCH_SIZE = 40;

      if (type === 'topic') {
        const totalBatches = Math.ceil(totalQuestions / BATCH_SIZE);
        for (let i = 0; i < totalBatches; i++) {
          const currentBatchSize = Math.min(BATCH_SIZE, totalQuestions - i * BATCH_SIZE);
          setProgress({
            current: i * BATCH_SIZE,
            total: totalQuestions,
            stage: 'generating',
            message: `جاري توليد الدفعة ${i + 1} من ${totalBatches} (${i * BATCH_SIZE}/${totalQuestions} سؤال)...`,
          });

          const data = await generateQuizWithFallback(
            topic || '',
            currentBatchSize,
            accumulatedQuestions.map(q => q.text)
          );

          if (data.questions && Array.isArray(data.questions)) {
            if (!finalTitle && data.title) finalTitle = data.title;
            if (!finalDescription && data.description) finalDescription = data.description;
            
            accumulatedQuestions = [...accumulatedQuestions, ...data.questions];
          }
        }
      } else if (type === 'pasted_text') {
        const totalBatches = Math.ceil(totalQuestions / BATCH_SIZE);
        for (let i = 0; i < totalBatches; i++) {
          const currentBatchSize = Math.min(BATCH_SIZE, totalQuestions - i * BATCH_SIZE);
          setProgress({
            current: i * BATCH_SIZE,
            total: totalQuestions,
            stage: 'generating',
            message: `جاري تحليل النص وتوليد الدفعة ${i + 1} من ${totalBatches} (${i * BATCH_SIZE}/${totalQuestions} سؤال)...`,
          });

          const res = await fetchWithAuth(getApiUrl('/api/generate-from-pdf-text-batch'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text,
              amount: currentBatchSize,
              alreadyGeneratedQuestions: accumulatedQuestions.map(q => q.text),
              userId,
            }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'فشل توليد الأسئلة من النص المنسوخ.');
          }

          const data = await res.json();
          if (data.questions && Array.isArray(data.questions)) {
            if (!finalTitle && data.title) finalTitle = data.title;
            if (!finalDescription && data.description) finalDescription = data.description;

            accumulatedQuestions = [...accumulatedQuestions, ...data.questions];
          }
        }
      } else if (type === 'file_direct') {
        if (extractionMode === 'literal') {
          setProgress({
            current: 0,
            total: 100,
            stage: 'scanning',
            message: 'جاري فحص المستند والبحث عن مواضع الأسئلة الصريحة أو الضمنية (Map)...',
          });

          const scanRes = await fetchWithAuth(getApiUrl('/api/scan-document-questions'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileUri,
              fileUploadName,
              mimeType,
              userId,
            }),
          });

          if (!scanRes.ok) {
            const data = await scanRes.json().catch(() => ({}));
            throw new Error(data.error || 'فشلت عملية مسح المستند لتحديد مواضع الأسئلة.');
          }

          const scanData = await scanRes.json();
          const locators = scanData.locators || [];

          if (locators.length === 0) {
            throw new Error('لم يتم العثور على أي أسئلة صالحة في المستند المرفوع.');
          }

          const LOCATOR_BATCH_SIZE = 8;
          const totalScanBatches = Math.ceil(locators.length / LOCATOR_BATCH_SIZE);

          for (let i = 0; i < totalScanBatches; i++) {
            const batchLocators = locators.slice(i * LOCATOR_BATCH_SIZE, (i + 1) * LOCATOR_BATCH_SIZE);
            setProgress({
              current: Math.round((i / totalScanBatches) * 100),
              total: 100,
              stage: 'generating',
              message: `جاري معالجة وتنسيق الدفعة ${i + 1} من ${totalScanBatches} من مواضع الأسئلة المكتشفة...`,
            });

            const batchRes = await fetchWithAuth(getApiUrl('/api/generate-from-scan-batch'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileUri,
                fileUploadName,
                mimeType,
                locators: batchLocators,
                alreadyGeneratedQuestions: accumulatedQuestions.map(q => q.text),
                userId,
              }),
            });

            if (!batchRes.ok) {
              const data = await batchRes.json().catch(() => ({}));
              throw new Error(data.error || 'فشل تحويل مواضع الأسئلة إلى اختبار منسق.');
            }

            const batchData = await batchRes.json();
            if (batchData.questions && Array.isArray(batchData.questions)) {
              accumulatedQuestions = [...accumulatedQuestions, ...batchData.questions];
            }
          }

          finalTitle = fileUploadName ? fileUploadName.replace(/^[0-9a-f-]+_/, '') : 'اختبار مستكشف من ملف';
          finalDescription = `اختبار تم استخراجه تلقائياً من مواضع الأسئلة المكتشفة في الملف المرفوع.`;
        } else {
          const pagesCount = totalPages || 1;
          const totalPageBatches = pagesCount;

          for (let i = 0; i < totalPageBatches; i++) {
            const pageNumber = i + 1;
            setProgress({
              current: i,
              total: totalPageBatches,
              stage: 'generating',
              message: `جاري قراءة الصفحة ${pageNumber} من ${pagesCount} وصياغة أسئلتها بالذكاء الاصطناعي...`,
            });

            const questionsPerBatch = Math.max(5, Math.ceil(totalQuestions / totalPageBatches));

            const res = await fetchWithAuth(getApiUrl('/api/generate-from-file-direct'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileUri,
                fileUploadName,
                mimeType,
                amount: questionsPerBatch,
                userId,
                batchIndex: i,
                totalBatches: pagesCount,
                alreadyExtractedTexts: accumulatedQuestions.map(q => q.text),
                customInstruction,
                isPageByPage: true,
                pageNumber,
                extractionMode,
              }),
            });

            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(data.error || `فشل توليد الأسئلة من الصفحة ${pageNumber}`);
            }

            const data = await res.json();
            if (data.questions && Array.isArray(data.questions)) {
              if (!finalTitle && data.title) finalTitle = data.title;
              if (!finalDescription && data.description) finalDescription = data.description;
              accumulatedQuestions = [...accumulatedQuestions, ...data.questions];
            }
          }
        }
      }

      if (totalQuestions > 0 && accumulatedQuestions.length > totalQuestions) {
        accumulatedQuestions = accumulatedQuestions.slice(0, totalQuestions);
      }

      if (accumulatedQuestions.length === 0) {
        throw new Error('فشل توليد أي أسئلة صالحة للطلب المختار.');
      }

      setProgress({
        current: totalQuestions,
        total: totalQuestions,
        stage: 'saving',
        message: 'جاري حفظ الاختبار بالكامل في قاعدة البيانات...',
      });

      const finalQuizTitle = finalTitle?.trim() || (type === 'topic' ? `اختبار: ${topic}` : 'اختبار مخصص جديد');
      const finalQuizDesc = finalDescription?.trim() || 'اختبار مخصص تم توليده بدقة كاملة بالذكاء الاصطناعي كوانتم.';

      const createdQuiz = await createQuiz({
        title: finalQuizTitle,
        description: finalQuizDesc,
        creatorId: userId,
        creatorName: creatorName || 'صانع متميز',
        questions: accumulatedQuestions.map((q: any, idx: number) => {
          const isEnglish = !/[\u0600-\u06FF]/.test(q.text || '');
          return {
            id: `q-gen-${idx}-${Date.now()}`,
            type: q.type === 'tf' ? 'tf' : q.type === 'essay' ? 'essay' : 'mcq',
            text: q.text || '',
            options: q.type === 'tf'
              ? (q.options && q.options.length === 2 && q.options[0].trim() ? q.options : (isEnglish ? ['True', 'False'] : ['صح', 'خطأ']))
              : q.type === 'essay' ? [] : (q.options || ['', '', '', '']),
            correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
            correctAnswer: q.correctAnswer || '',
            explanation: q.explanation || '',
          };
        }),
        timeLimit: 0,
        category: category || 'عام',
      });

      setProgress({
        current: totalQuestions,
        total: totalQuestions,
        stage: 'complete',
        message: 'تم توليد وحفظ الاختبار بنجاح! ✨',
      });

      if (fileUploadName) {
        fetch(getApiUrl('/api/upload-document-cleanup'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileUploadName }),
        }).catch(err => console.error('Cloud cleanup error:', err));
      }

      queryClient.invalidateQueries({ queryKey: ['quizzes'] });

      return {
        quiz: createdQuiz,
        questions: accumulatedQuestions,
        title: finalQuizTitle,
        description: finalQuizDesc,
      };
    },
  });

  return {
    generateAndSaveQuiz: generatorMutation.mutateAsync,
    isGenerating: generatorMutation.isPending,
    generationProgress: progress,
    generationError: generatorMutation.error ? (generatorMutation.error as Error).message : null,
    resetGeneration: () => {
      generatorMutation.reset();
      setProgress(null);
    },
  };
}
