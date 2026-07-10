import { fetchWithAuth } from '../lib/authFetch';
import { getApiUrl } from '../lib/origin';
import { GeneratedQuiz } from '../types';

export async function generateWithGemini(
  topic: string,
  amount: number,
  alreadyGeneratedQuestions?: string[]
): Promise<GeneratedQuiz> {
  // Wrap the topic cleanly with a static system instruction to enforce a pure JSON output structure
  const standardizedTopic = `الموضوع المطلوب: "${topic}"
تعليمات هامة للغاية لنموذج الذكاء الاصطناعي:
يجب صياغة الاختبار بدقة عالية وتنسيق المحتوى كـ JSON صالح ومباشر بدون أي مقدمات أو علامات اقتباس مسبقة من نوع markdown.
تأكد من أن الاستجابة تطابق تماماً الهيكل المطلوب:
{
  "title": "عنوان الاختبار",
  "description": "وصف الاختبار",
  "questions": [
    {
      "text": "نص السؤال",
      "type": "mcq",
      "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
      "correctIndex": 0,
      "correctAnswer": "",
      "explanation": "الشرح العلمي"
    }
  ]
}`;

  const response = await fetchWithAuth(getApiUrl('/api/generate/gemini'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: standardizedTopic,
      amount,
      alreadyGeneratedQuestions,
    }),
  });

  const text = await response.text();
  const trimmed = text.trim();

  // HTML response guard to prevent JSON parsing crashes
  if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.startsWith('<')) {
    throw new Error('Server returned HTML response instead of valid JSON.');
  }

  if (!response.ok) {
    let errorMsg = 'Gemini Quiz Generation Service failed.';
    try {
      const errorData = JSON.parse(trimmed);
      errorMsg = errorData.error || errorMsg;
    } catch (e) {}
    throw new Error(errorMsg);
  }

  // Clean the Response: remove markdown block backticks and trim
  const cleanedText = trimmed.replace(/```json|```/gi, '').trim();
  try {
    return JSON.parse(cleanedText) as GeneratedQuiz;
  } catch (err) {
    console.error('Failed to parse Gemini response text:', cleanedText);
    throw new Error('Failed to parse generated quiz JSON.');
  }
}

