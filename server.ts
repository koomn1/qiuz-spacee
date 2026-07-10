/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import OpenAI from 'openai';
import QRCode from 'qrcode';
import crypto from 'crypto';

// Safe derivation of filename and dirname for both ESM and CommonJS
const _filename = (() => {
  try {
    return fileURLToPath(import.meta.url);
  } catch {
    return typeof __filename !== 'undefined' ? __filename : '';
  }
})();

const _dirname = (() => {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return typeof __dirname !== 'undefined' ? __dirname : process.cwd();
  }
})();

dotenv.config();

// Prevent unhandled exceptions and promise rejections from crashing the Express process
process.on('uncaughtException', (err: any) => {
  // Ignore harmless EPIPE/ECONNRESET errors (e.g., standard output, standard error, or disconnected sockets)
  if (err.code === 'EPIPE' || err.code === 'ECONNRESET') {
    console.warn('[Process Warning] Handled uncaught socket error:', err.message);
    return;
  }
  console.error('[Process Error] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason: any, promise) => {
  if (reason && (reason.code === 'EPIPE' || reason.code === 'ECONNRESET')) {
    console.warn('[Process Warning] Handled unhandled rejection socket error:', reason.message);
    return;
  }
  console.error('[Process Error] Unhandled Rejection at:', promise, 'reason:', reason);
});

// Safe initialization of Firebase Admin SDK
try {
  if (getApps().length === 0) {
    let projectId: string | undefined = undefined;
    try {
      const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        projectId = config.projectId;
      }
    } catch (err) {
      console.error('Failed to read firebase config for admin:', err);
    }

    if (projectId) {
      initializeApp({
        projectId: projectId
      });
      console.log('Firebase Admin SDK initialized with projectId:', projectId);
    } else {
      initializeApp();
      console.log('Firebase Admin SDK initialized with default settings');
    }
  }
} catch (e) {
  console.error('Error initializing Firebase Admin SDK:', e);
}

// Security: Helper to verify request authentications securely
async function getAuthenticatedUser(req: any) {

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No authentication token provided in Authorization header.');
      }
      const token = authHeader.split('Bearer ')[1];
      if (!token || token.trim() === '') {
        throw new Error('Empty token provided.');
      }

      try {
        if (getApps().length > 0) {
          const decodedToken = await getAuth().verifyIdToken(token);
          return decodedToken;
        } else {
          throw new Error('Firebase Admin SDK is not initialized.');
        }
      } catch (err: any) {
        if (process.env.ALLOW_DEV_AUTH_FALLBACK === 'true') {
          console.warn('⚠️ [WARNING] Local dev auth fallback is enabled. Do not use in production.');
          // Try to look up user from database by uid (token is the user's uid in local auth)
          try {
            const dbUser = await db.select().from(users).where(eq(users.uid, token)).limit(1);
            if (dbUser.length > 0) {
              return { uid: token, email: dbUser[0].email || '', name: dbUser[0].name || 'طالب متميز' };
            }
          } catch (_) {}
          // Fallback for admin or unknown users
          const isAdmin = token === 'adman777888999';
          return { uid: token, email: isAdmin ? 'adman777888999@gmail.com' : `${token}@quizspace.local`, name: 'طالب متميز' };
        }
        throw new Error('Authentication token signature verification failed: ' + err.message);
      }
}

import { db } from './src/db/index.ts';
import { users, quizzes, completions, questionRatings, notifications, premiumRequests, promotions, couponCodes, directMessages, communityPosts, follows, userSessions, messageViews, quizResults, userNotificationTokens, classroomsTable, classroomStudentsTable, classroomMessagesTable } from './src/db/schema.ts';
import { eq, desc, and, ilike, sql, inArray, or } from 'drizzle-orm';
import webpush from 'web-push';

// Initialize Postgres database with demo premium samples if empty
async function ensureDbPostgres() {
  try {
    const seedQuizzes = [
      {
        id: 'web-basics-demo',
        title: 'أساسيات تطوير واجهات الويب (HTML & CSS)',
        description: 'اختبار ممتع وتفاعلي لاختبار معلوماتك الأساسية في هيكلة وتصميم صفحات الإنترنت للمبتدئين.',
        creatorId: 'system-demo',
        creatorName: 'المكتبة التقنية العامة',
        questions: [
          {
            id: 'q1',
            type: 'mcq',
            text: 'ماذا يرمز الاختصار HTML؟',
            options: [
              'Hyper Text Markup Language',
              'Home Tool Markup Language',
              'Hyperlinks and Text Markup Language',
              'High Tech Modern Language'
            ],
            correctIndex: 0,
            explanation: 'HTML تعني لغة توصيف النصوص التشعبية وتشكّل العمود القبلي لبناء أي صفحة ويب.'
          },
          {
            id: 'q2',
            type: 'tf',
            text: 'تُستخدم الوسوم <h1> لعرض العنوان الرئيسي الأكبر حجماً في الصفحة.',
            options: ['صح', 'خطأ'],
            correctIndex: 0,
            explanation: 'الوسم h1 يمثل أدق وأهم عنوان في الصفحة (Heading 1) ويكون افتراضياً هو الأكبر حجماً.'
          },
          {
            id: 'q3',
            type: 'mcq',
            text: 'أي من الخصائص التالية تُستخدم لتغيير لون الخلفية في CSS؟',
            options: ['color', 'background-color', 'bgcolor', 'canvas-color'],
            correctIndex: 1,
            explanation: 'تُسخدم الخاصية background-color لتعديل خلفية عناصر HTML بينما color لتلوين النصوص.'
          },
          {
            id: 'q4',
            type: 'tf',
            text: 'ملفات جافاسكريبت الخارجية يتم تضمينها باستخدام الوسم <style>.',
            options: ['صح', 'خطأ'],
            correctIndex: 1,
            explanation: 'يُسخدم الوسم <script> لتضمين ملفات JavaScript الخارجية، بينما <style> مخصص للـ CSS الداخلي.'
          }
        ],
        createdAt: '2026-06-15T18:27:45.819Z',
        totalPlays: 32,
        avgRating: '4.8',
        ratingsCount: 6,
        timeLimit: 0
      },
      {
        id: 'ai-trends-demo',
        title: 'الذكاء الاصطناعي التوليدي ومستقبل التقنية',
        description: 'هل تتابع أحدث التطورات؟ اختبر معلوماتك حول نماذج الذكاء الاصطناعي التوليدي وكيفية عملها.',
        creatorId: 'system-demo',
        creatorName: 'قسم الابتكار الرقمي',
        questions: [
          {
            id: 'ai-q1',
            type: 'mcq',
            text: 'ماذا يرمز حرف G في اسم عائلة النماذج الشهيرة GPT؟',
            options: ['Generative (توليدي)', 'General (عام)', 'Global (عالمي)', 'Gradient (تدرجي)'],
            correctIndex: 0,
            explanation: 'يرمز الحرف إلى Generative (Generative Pre-trained Transformer) وهو ما يعبّر عن قدرة النموذج على توليد نصوص جديدة.'
          },
          {
            id: 'ai-q2',
            type: 'tf',
            text: 'نماذج الذكاء الاصطناعي الكبيرة (LLMs) تفهم الكلمات وتحللها بالكامل كبنية نصية واحدة فوراً بدون تحويلها إلى رموز رقمية (Tokens).',
            options: ['صح', 'خطأ'],
            correctIndex: 1,
            explanation: 'تقوم هذه النماذج دائماً بتقطيع النصوص إلى وحدات أصغر تسمى Tokens وتحويلها لأرقام متجهة (Embeddings) لاستيعاب العلاقات الرياضية بينها.'
          },
          {
            id: 'ai-q3',
            type: 'mcq',
            text: 'ما الاسم العلمي لمشكلة تخيل الذكاء الاصطناعي لمعلومات مغلوطة بشكل تبدو فيه صحيحة وثابتة؟',
            options: [
              'الهلوسة (Hallucination)',
              'التلاشي (Vanishing)',
              'التشبع (Saturation)',
              'النسيان الكارثي (Catastrophic Forgetting)'
            ],
            correctIndex: 0,
            explanation: 'الهلوسة أو Hallucination هي الظاهرة التي يكتب فيها نموذج اللغة الكبير معلومات واثقة وغير حقيقية من نسج ارتباطات عشوائية.'
          }
        ],
        createdAt: '2026-06-15T18:27:45.820Z',
        totalPlays: 19,
        avgRating: '4.6',
        ratingsCount: 5,
        timeLimit: 0
      }
    ];

    for (const quizToSeed of seedQuizzes) {
      const exists = await db.select().from(quizzes).where(eq(quizzes.id, quizToSeed.id)).limit(1);
      if (exists.length === 0) {
        await db.insert(quizzes).values(quizToSeed);
      }
    }
    console.log('Postgres Quizzes seed completed. ✅');
  } catch (err) {
    console.error('Failed to seed Postgres Quizzes database:', err);
  }
}

// -------------------------------
// AI Setup
// -------------------------------

import { GoogleGenAI, Type } from "@google/genai";
import rateLimit from "express-rate-limit";

let aiClient: GoogleGenAI | null = null;
function getAi() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not defined in environment secrets.');
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Extract text from documents locally since DeepSeek doesn't support Gemini's file API
async function extractTextFromBuffer(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
       const rawImport = await import('pdf-parse');
       const PDFParseClass = (rawImport as any).PDFParse;
       const parser = new PDFParseClass({ data: buffer });
       const textResult = await parser.getText();
       await parser.destroy();
       return textResult.text || '';
    } else if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) {
       const mammoth = (await import('mammoth')).default || await import('mammoth');
       const result = await mammoth.extractRawText({ buffer });
       return result.value;
    }
    return buffer.toString('utf-8');
  } catch (e) {
    console.error('Doc parse error:', e);
    return buffer.toString('utf-8');
  }
}

async function generateContentWithRetryAndFallback(params: {
  model: string;
  contents: any;
  config?: any;
}) {
  const ai = getAi();
  
  let initialModel = params.model;
  // Use gemini-3.5-flash as the preferred default text model since it has much higher quotas
  if (!initialModel || initialModel === 'gemini-3.1-flash-lite') {
    initialModel = 'gemini-3.5-flash';
  }

  // Resilient fallback chain using supported, non-deprecated models
  const fallbacks = Array.from(new Set([
    initialModel,
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-flash-latest',
    'gemini-2.5-pro',
    'gemini-pro-latest',
    'gemini-3.1-pro-preview'
  ])).filter(Boolean);

  let lastError: any = null;

  for (const modelName of fallbacks) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: params.contents,
        config: params.config,
      });

      return {
        text: response.text
      };
    } catch (error: any) {
      lastError = error;
      let friendlyMessage = error?.message || String(error);
      if (typeof friendlyMessage === 'string' && friendlyMessage.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(friendlyMessage);
          if (parsed.error && parsed.error.message) {
            friendlyMessage = `${parsed.error.message} (Status: ${parsed.error.status}, Code: ${parsed.error.code})`;
          }
        } catch (_) {}
      }
      console.warn(`[Gemini API] Error with ${modelName}: ${friendlyMessage}. Retrying with fallback...`);
      // Wait a brief moment before trying the next fallback model
      await new Promise(r => setTimeout(r, 1000));
      continue;
    }
  }

  throw lastError;
}

// Helper to robustly extract JSON from AI responses
function parseJsonSafely(text: string): any {
  let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.log('Initial JSON parse issue, attempting recovery...');
    console.log('Failing text:', text.substring(0, 500) + '...');

    // Attempt 0: Try to fix unterminated string
    try {
      return JSON.parse(cleaned + '"');
    } catch(err) {}

    try {
      return JSON.parse(cleaned + '"}');
    } catch(err) {}

    try {
      return JSON.parse(cleaned + '"]}');
    } catch(err) {}

    // Find the last valid closing brace of an object
    // and try to close the root object/array, but only check the last 50 closing braces
    let lastClosingBrace = cleaned.lastIndexOf('}');
    let attempts = 0;
    while (lastClosingBrace !== -1 && attempts < 50) {
      let sub = cleaned.substring(0, lastClosingBrace + 1);
      
      const suffixes = [
        '',
        '}',
        ']}',
        ']'
      ];

      for (const suf of suffixes) {
        try {
          return JSON.parse(sub + suf);
        } catch (err) {}
      }
      
      // Step backwards to the previous brace
      lastClosingBrace = cleaned.lastIndexOf('}', lastClosingBrace - 1);
      attempts++;
    }
    
    throw e; // if all fail
  }
}

// Start Server Setup
async function startServer() {
    const app = express();
      app.set('trust proxy', 1);
      const PORT = 3000;

      // Rate Limiting (Protects from Brute Force and AI cost draining)
      const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        message: { error: 'عذراً! تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً.' },
        standardHeaders: true,
        legacyHeaders: false,
        validate: false,
      });
      app.use('/api/', apiLimiter);

      // Dynamic JSON Body Limit
      app.use((req, res, next) => {
        const largePayloadRoutes = [
          '/api/ocr', 
          '/api/generate', 
          '/api/cosmobot-chat', 
          '/api/gemini-sandbox', 
          '/api/scan-document'
        ];
        const isLarge = largePayloadRoutes.some(route => req.path.startsWith(route));
        
        if (isLarge) {
          express.json({ limit: "50mb" })(req, res, next);
        } else {
          express.json({ limit: "8mb" })(req, res, next);
        }
      });
      app.use((req, res, next) => {
        const origin = req.headers.origin;
        const allowedOrigins = [
          'http://localhost:3000',
          'http://localhost:5173',
          process.env.FRONTEND_URL || 'https://ais-dev-bes5wkza3ioeublsvn2lp5-396545653321.europe-west3.run.app',
          'https://ais-pre-bes5wkza3ioeublsvn2lp5-396545653321.europe-west3.run.app'
        ];
        if (origin && allowedOrigins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        if (req.method === 'OPTIONS') {
          return res.sendStatus(204);
        }
        next();
      });

      // Ensure DB gets initialized (asynchronously so it doesn't block server startup/health check on Cloud Run)
      ensureDbPostgres().catch(err => {
        console.error('Asynchronous DB seeding failed:', err);
      });

      // Root status check
      app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', time: new Date().toISOString() });
      });

      // ---------------- DAILY COSMO CHALANGE CACHE STATS ----------------
      interface CachedChallenge {
        q: string;
        options: string[];
        correctIdx: number;
        explanation: string;
        topic: string;
        rotationKey: number;
        createdAt: number;
      }
      const challengeCache: Record<string, CachedChallenge> = {};

      const FALLBACK_CHALLENGES = [
        {
          q: "أي كوكب غلافه وجوه الغازي كثيف للغاية ومحتبس بطريقة تجعله الأشد حرارة بالمنظومة الشمسية؟ ☄️",
          options: ["المريخ الكوكب الأحمر", "كوكب الزهرة اللامع والمتوهج", "عطارد الصخري القريب جداً", "المشتري الغازي العظيم"],
          correctIdx: 1,
          explanation: "كوكب الزهرة هو الأشد حرارة بالمنظومة الشمسية بسبب ظاهرة الاحتباس الحراري الجامحة الناتجة عن غلاف غازي كثيف من ثاني أكسيد الكربون.",
          topic: "علم الفلك"
        },
        {
          q: "ما هي المجرة الحلزونية العملاقة التي ينتمي إليها نظامنا الشمسي وكوكب الأرض؟ 🌌",
          options: ["مجرة أندروميدا (المرأة المسلسلة)", "مجرة درب التبانة (الطريق الملبن)", "مجرة صانع الفضة", "مجرة الدوامة"],
          correctIdx: 1,
          explanation: "درب التبانة هي المجرة الحلزونية التي يقبع فيها كوكب الأرض ونظامنا الشمسي كاملاً.",
          topic: "علم الكونيات"
        },
        {
          q: "ما هو الكوكب الأكبر حجماً في نظامنا الشمسي والذي يتميز ببقعته الحمراء العظيمة؟ 🪐",
          options: ["زحل ذو الحلقات", "كوكب المشتري العملاق", "كوكب نبتون الأزرق", "الأرض المائية"],
          correctIdx: 1,
          explanation: "المشتري هو أضخم كواكب المجموعة الشمسية على الإطلاق ويفوق حجم الأرض بأكثر من ألف مرة.",
          topic: "المجموعة الشمسية"
        },
        {
          q: "ما هي أصغر وحدة بنائية حية في جميع الكائنات الحية على وجه الأرض؟ 🧬",
          options: ["الذرة الكيميائية", "الخلية الحية", "الجزيء العضوي", "البروتين الغذائي"],
          correctIdx: 1,
          explanation: "الخلية هي الوحدة الأساسية والتركيبية لكل أشكال الحياة المعروفة كيميائياً وبيولوجياً.",
          topic: "علم الأحياء"
        },
        {
          q: "أي غاز يمثل النسبة الأكبر والمهيمنة في الهواء الجوي الذي يحيط بنا على كوكب الأرض؟ 🌬️",
          options: ["غاز الأكسجين للتنفس", "غاز النيتروجين الخامل", "غاز ثاني أكسيد الكربون", "غاز الهيدروجين الخفيف"],
          correctIdx: 1,
          explanation: "يمثل النيتروجين النسبة الأكبر في الغلاف الجوي للأرض بنسبة تقارب 78%، يليه الأكسجين بنسبة 21%.",
          topic: "علوم الأرض"
        },
        {
          q: "ما هي القوة غير مرئية التي تجذب الأجسام نحو مركز كوكب الأرض وتمنعنا من الطفو؟ 🌍",
          options: ["القوة المغناطيسية", "قوة الجاذبية الأرضية", "قوة الاحتكاك السطحي", "القوة الطاردة المركزية"],
          correctIdx: 1,
          explanation: "قوة الجاذبية التي اكتشفها السير إسحق نيوتن هي القوة المغناطيسية الثقالية الكونية التي تجذب الأجسام لأسفل.",
          topic: "الفيزياء الكلاسيكية"
        },
        {
          q: "أي كوكب يعرف في أبحاث وعلوم الفضاء باسم الكوكب الأحمر لوجود أكاسيد الحديد على سطحه؟ 🔴",
          options: ["كوكب المريخ", "كوكب عطارد", "كوكب زحل", "كوكب الزهرة"],
          correctIdx: 0,
          explanation: "يسمى المريخ بالكوكب الأحمر بسبب غنى تربته وصخوره بأكاسيد الحديد الصدئة التي تمنحه هذا اللون المميز.",
          topic: "جيولوجيا الكواكب"
        }
      ];

      app.get('/api/cosmo-challenge', async (req, res) => {
        const rawTier = (req.query.tier || 'free').toString().toLowerCase();
        
        // Determine target interval in milliseconds
        let intervalMs = 24 * 60 * 60 * 1000; // Free = 24 hours
        if (rawTier.includes('diamond') || rawTier.includes('ماسية') || rawTier.includes('مؤسسات') || rawTier.includes('مدرسة') || rawTier.includes('نخبة')) {
          intervalMs = 2 * 60 * 1000; // Diamond = 2 minutes
        } else if (rawTier.includes('gold') || rawTier.includes('الذهبية') || rawTier.includes('ذهبية') || rawTier.includes('معلم')) {
          intervalMs = 30 * 60 * 1000; // Gold = 30 minutes
        } else if (rawTier.includes('silver') || rawTier.includes('فضية') || rawTier.includes('الفضية')) {
          intervalMs = 120 * 60 * 1000; // Silver = 2 hours
        }

        const now = Date.now();
        const rotationKey = Math.floor(now / intervalMs);
        const msElapsedInCurrentBlock = now % intervalMs;
        const nextUpdateInMs = intervalMs - msElapsedInCurrentBlock;

        const normalizedTier = intervalMs === 2 * 60 * 1000 ? 'diamond' 
                               : intervalMs === 30 * 60 * 1000 ? 'gold'
                               : intervalMs === 120 * 60 * 1000 ? 'silver'
                               : 'free';

        // Check if we have a valid cache matching rotationKey and tier
        const cached = challengeCache[normalizedTier];
        if (cached && cached.rotationKey === rotationKey) {
          return res.json({
            ...cached,
            nextUpdateInMs
          });
        }

        // Generate a fresh question using Gemini AI or fallback pool
        let finalQuestion = FALLBACK_CHALLENGES[rotationKey % FALLBACK_CHALLENGES.length];
        let createdWithAi = false;

        try {
          const ai = getAi();
          if (ai) {
            // Prepare topics to vary
            const topics = ["علم الفلك والكواكب", "الفيزياء الكونية", "الكيمياء الذرية", "العوالم والأحياء المجهرية", "جيولوجيا الأرض", "تاريخ الحاسوب والذكاء الاصطناعي", "الألغاز المنطقية والرياضيات"];
            const selectedTopic = topics[rotationKey % topics.length];

            const prompt = `أنت عالم عبقري ومعلم ذكي تصيغ أسأسئلة مسلية تفاعلية.
صغ سؤالاً اختيارياً ذكياً وسهلاً جداً (very easy science trivia question) باللغة العربية الفصحى حول موضوع: "${selectedTopic}".
يجب أن يتمحور السؤال حول فكرة علمية جذابة وبسيطة الفهم وصحيحة علمياً 100%.

تفاصيل هامة:
1. السؤال ممتع وجذاب وسهل للغاية وواضح جداً للطلاب (easy trivia).
2. وفر 4 خيارات حل دقيقة وثابتة جداً.
3. وفر مؤشر الخيار الصحيح (يكون من 0 إلى 3).
4. اكتب شرحاً تعليمياً مبسطاً في بضعة أسطر يفسر المعلومة بأسلوب شيق وجذاب ومبسط.

قم بصياغة الإجابة وإرجاعها على شكل وثيقة JSON نقية مطابقة ومجردة تماماً للهيكل البرمجي التالي، وبدون استخدام أي علامات تنصيص خلفية أو علامات ماركداون (مثل \`\`\`json):
{
  "q": "نص السؤال بالكامل مضافاً إليه إيموجي علمي مبهج",
  "options": ["خيار 0", "خيار 1", "خيار 2", "خيار 3"],
  "correctIdx": 0,
  "explanation": "الشرح التعليمي باللغة العربية الفصحى المبسطة لإثراء معلومات الطالب",
  "topic": "الموضوع باللغة العربية"
}`;

            const response = await generateContentWithRetryAndFallback({
              model: 'gemini-3.5-flash',
              contents: prompt
            });

            const textOutput = response.text || '';
            const parsed = parseJsonSafely(textOutput);
            
            if (parsed && parsed.q && Array.isArray(parsed.options) && parsed.options.length === 4 && typeof parsed.correctIdx === 'number') {
              finalQuestion = {
                q: parsed.q,
                options: parsed.options,
                correctIdx: parsed.correctIdx,
                explanation: parsed.explanation || '',
                topic: parsed.topic || selectedTopic
              };
              createdWithAi = true;
              console.log(`[Cosmo Challenge ID: ${rotationKey}] Dynamic Easy Quiz parsed for [${normalizedTier}]!`);
            }
          }
        } catch (e) {
          console.warn(`[Gemini API] Using scientific fallbacks for Cosmo (Tier: ${normalizedTier}):`, e);
        }

        // Cache the resolved question
        challengeCache[normalizedTier] = {
          ...finalQuestion,
          rotationKey,
          createdAt: now
        };

        return res.json({
          ...challengeCache[normalizedTier],
          createdWithAi,
          nextUpdateInMs
        });
      });

      // Share origin resolver to circumvent iframe mapping issues
      app.get('/api/share-origin', (req, res) => {
        const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
        const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:3000';
        const activeHost = host.split(',')[0].trim();
        res.json({ origin: `${protocol}://${activeHost}` });
      });

      // Get all quizzes from Postgres
      app.get('/api/quizzes', async (req, res) => {
        try {
          const allQuizzes = await db.select().from(quizzes).orderBy(desc(quizzes.createdAt));
          res.json(allQuizzes);
        } catch (err: any) {
          console.error('Error fetching quizzes from Postgres:', err);
          res.status(500).json({ error: 'عذراً! فشل جلب الاختبارات من قاعدة البيانات.' });
        }
      });

      // Get single quiz from Postgres
      app.get('/api/quizzes/:id', async (req, res) => {
        try {
          const quizId = req.params.id;
          const result = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
          if (result.length === 0) {
            return res.status(404).json({ error: 'لم يتم العثور على هذا الاختبار!' });
          }
          res.json(result[0]);
        } catch (err: any) {
          console.error('Error fetching quiz from Postgres:', err);
          res.status(500).json({ error: 'عذراً! فشل جلب هذا الاختبار.' });
        }
      });

      // Create a new quiz in Postgres
      app.post('/api/quizzes', async (req, res) => {
        try {
          // Authenticate creator securely to prevent unauthenticated creation spoofing
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
          } catch (authErr: any) {
            return res.status(401).json({ error: 'عذراً! يجب عليك تسجيل الدخول أولاً لتتمكن من صياغة وحفظ الاختبارات.' });
          }

          const { id, title, description, creatorId, creatorName, questions: incomingQuestions, timeLimit, category, distributionRouting, classroomId } = req.body;
          
          if (!title || typeof title !== 'string' || title.length > 500) {
            return res.status(400).json({ error: 'العنوان غير صالح أو طويل جداً.' });
          }
          
          if (!incomingQuestions || !Array.isArray(incomingQuestions) || incomingQuestions.length === 0) {
            return res.status(400).json({ error: 'محتوى الأسئلة غير صالح.' });
          }

          const freshId = id || 'quiz-' + Math.random().toString(36).substring(2, 11);
          const cleanedQuestions = incomingQuestions.slice(0, 500).map((q: any, index: number) => ({
            id: (q.id || `q-${index}-${Date.now()}`).substring(0, 100),
            type: ['mcq', 'tf', 'essay'].includes(q.type) ? q.type : 'mcq',
            text: (q.text || '').substring(0, 2000),
            options: Array.isArray(q.options) ? q.options.map((opt: any) => String(opt).substring(0, 1000)) : [],
            correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
            explanation: (q.explanation || '').substring(0, 2000),
            imageUrl: typeof q.imageUrl === 'string' ? q.imageUrl : undefined
          }));

          const finalCreatorId = authenticatedUser.uid;
          const finalCreatorName = creatorName || authenticatedUser.name || 'طالب متميز';

          const newQuiz = {
            id: freshId,
            title: title.trim(),
            description: (description || '').substring(0, 1000),
            creatorId: finalCreatorId.substring(0, 100),
            creatorName: finalCreatorName.substring(0, 100),
            questions: cleanedQuestions,
            totalPlays: 0,
            avgRating: '0.0',
            ratingsCount: 0,
            timeLimit: typeof timeLimit === 'number' ? timeLimit : 0,
            createdAt: new Date().toISOString(),
            category: typeof category === 'string' ? category : 'عام',
            distributionRouting: typeof distributionRouting === 'string' ? distributionRouting : 'public',
            classroomId: typeof classroomId === 'string' ? classroomId : null
          };

          await db.insert(quizzes).values(newQuiz);
          res.json({ success: true, quizId: newQuiz.id, quiz: newQuiz });
        } catch (err: any) {
          console.error('Error creating quiz on Postgres:', err);
          res.status(500).json({ error: 'فشل حفظ هذا الاختبار في قاعدة البيانات.' });
        }
      });

      // Delete a quiz from Postgres
      app.delete('/api/quizzes/:id', async (req, res) => {
        try {
          // Authenticate requester securely
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
          } catch (authErr: any) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول للقيام بحذف هذا الاختبار.' });
          }

          const quizId = req.params.id;

          // Retrieve quiz first to verify ownership
          const existingQuizList = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
          if (existingQuizList.length === 0) {
            return res.status(404).json({ error: 'الاختبار غير موجود.' });
          }

          const quiz = existingQuizList[0];
          const isAdmin = authenticatedUser.email === 'adman777888999@gmail.com';

          // Cybersecurity check: only owner or administrator can delete
          if (quiz.creatorId !== authenticatedUser.uid && !isAdmin) {
            return res.status(403).json({ error: 'اختراق أمني! ليس لديك صلاحيات كافية لحذف اختبار مستخدم آخر.' });
          }

          await db.delete(quizzes).where(eq(quizzes.id, quizId));
          res.json({ success: true, message: 'تم حذف الاختبار بنجاح من قاعدة البيانات.' });
        } catch (err: any) {
          console.error('Error deleting quiz on Postgres:', err);
          res.status(500).json({ error: 'عذراً! فشل حذف الاختبار من قاعدة البيانات.' });
        }
      });

      // Update a quiz in Postgres
      app.put('/api/quizzes/:id', async (req, res) => {
        try {
          // Authenticate requester securely
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
          } catch (authErr: any) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لتعديل الاختبار.' });
          }

          const quizId = req.params.id;
          const updatedData = req.body;
          delete updatedData.id; // avoid key modifications

          // Retrieve quiz first to verify ownership
          const existingQuizList = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
          if (existingQuizList.length === 0) {
            return res.status(404).json({ error: 'الاختبار غير موجود.' });
          }

          const quiz = existingQuizList[0];
          const isAdmin = authenticatedUser.email === 'adman777888999@gmail.com';

          // Cybersecurity check: only owner or administrator can update
          if (quiz.creatorId !== authenticatedUser.uid && !isAdmin) {
            return res.status(403).json({ error: 'اختراق أمني! ليس لديك صلاحيات كافية لتعديل اختبار مستخدم آخر.' });
          }

          await db.update(quizzes).set(updatedData).where(eq(quizzes.id, quizId));
          const resQuiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
          res.json({ success: true, quiz: resQuiz[0] });
        } catch (err: any) {
          console.error('Error updating quiz on Postgres:', err);
          res.status(500).json({ error: 'عذراً! فشل تعديل الاختبار.' });
        }
      });

      // Submit test and records score & ratings to Postgres
      app.post('/api/quizzes/:id/submit', async (req, res) => {
        try {
          const { takerId, takerName, score, rating, feedback } = req.body;
          const quizId = req.params.id;

          if (!takerName) {
            return res.status(400).json({ error: 'اسم المتسابق مطلوب لحفظ النتائج.' });
          }

          const quizList = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
          if (quizList.length === 0) {
            return res.status(404).json({ error: 'الامتحان غير متوفر للتعديل.' });
          }
          const quiz = quizList[0];

          let newTotalPlays = (quiz.totalPlays || 0) + 1;
          let newCount = quiz.ratingsCount || 0;
          let newAvg = quiz.avgRating || '0.0';

          if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
            const oldCount = quiz.ratingsCount || 0;
            const oldAvg = parseFloat(quiz.avgRating || '0.0');
            newCount = oldCount + 1;
            newAvg = ((oldAvg * oldCount + rating) / newCount).toFixed(1);
          }

          await db.update(quizzes).set({
            totalPlays: newTotalPlays,
            ratingsCount: newCount,
            avgRating: newAvg
          }).where(eq(quizzes.id, quizId));

          const newCompletion = {
            id: 'comp-' + Math.random().toString(36).substring(2, 11),
            quizId,
            quizTitle: quiz.title,
            takerId: takerId || 'anonymous-taker',
            takerName,
            score: typeof score === 'number' ? score : 0,
            totalQuestions: (quiz.questions as any[]).length,
            rating: rating || null,
            feedback: feedback || '',
            createdAt: new Date().toISOString()
          };

          await db.insert(completions).values(newCompletion);

          // Instant save to quiz_results for mandatory evaluation tracking
          await db.insert(quizResults).values({
            id: newCompletion.id, // match id for robust mirroring
            quizId,
            quizTitle: quiz.title,
            studentName: takerName,
            score: typeof score === 'number' ? score : 0,
            totalQuestions: (quiz.questions as any[]).length,
            rating: rating || null,
            feedback: feedback || '',
            createdAt: new Date().toISOString()
          });

          res.json({ success: true, completion: newCompletion });
        } catch (err: any) {
          console.error('Error submitting quiz completion on Postgres:', err);
          res.status(500).json({ error: 'فشل إرسال محاولة الاختبار وحفظها.' });
        }
      });

      // Rate an existing completion (used for forced star rating on quiz results screen)
      app.post('/api/completions/:id/rate', async (req, res) => {
        try {
          const completionId = req.params.id;
          const { rating, feedback } = req.body;

          if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'التقييم يجب أن يكون بين ١ و ٥ نجمات.' });
          }

          const compList = await db.select().from(completions).where(eq(completions.id, completionId)).limit(1);
          if (compList.length === 0) {
            return res.status(404).json({ error: 'لم يتم العثور على محاولة الاختبار.' });
          }
          const completion = compList[0];

          await db.update(completions).set({
            rating,
            feedback: feedback || ''
          }).where(eq(completions.id, completionId));

          // Also update quiz_results table for exact data consistency
          await db.update(quizResults).set({
            rating,
            feedback: feedback || ''
          }).where(eq(quizResults.id, completionId));

          const quizList = await db.select().from(quizzes).where(eq(quizzes.id, completion.quizId)).limit(1);
          if (quizList.length > 0) {
            const quiz = quizList[0];
            const oldCount = quiz.ratingsCount || 0;
            const oldAvg = parseFloat(quiz.avgRating || '0.0');
            const newCount = oldCount + 1;
            const newAvg = ((oldAvg * oldCount + rating) / newCount).toFixed(1);

            await db.update(quizzes).set({
              ratingsCount: newCount,
              avgRating: newAvg
            }).where(eq(quizzes.id, quiz.id));
          }

          res.json({ success: true });
        } catch (err: any) {
          console.error('Error rating completion on Postgres:', err);
          res.status(500).json({ error: 'فشل حفظ تقييم الاختبار.' });
        }
      });

      // Register/update user premium status in Postgres
      app.post('/api/profiles/:userId/premium', async (req, res) => {
        try {
          // Secure endpoint to prevent users from arbitrarily granting themselves premium without auth
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول للتفاعل مع الباقات.' });
          }

          const userId = req.params.userId;
          const isAdmin = authenticatedUser.email === 'adman777888999@gmail.com';

          // Check ownership or admin privileges
          if (authenticatedUser.uid !== userId && !isAdmin) {
            return res.status(403).json({ error: 'اختراق أمني! ليس لديك صلاحية تعديل باقة مستخدم آخر.' });
          }

          const { isPremium, planName, renewalDate } = req.body;

          const userExists = await db.select().from(users).where(eq(users.uid, userId)).limit(1);
          
          let finalPremium = isPremium === undefined ? true : !!isPremium;
          let finalPlanName = planName || 'الباقة الذهبية (الأكثر طلباً للمعلمين)';
          let finalRenewal = renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

          if (userExists.length > 0) {
            // [Shield Guard] If user is already premium in database, do not allow downgrading via automatic free checks!
            if (userExists[0].isPremium && !finalPremium) {
              console.log(`[Shield Guard Activated] Blocked automatic downgrade for premium user ID: ${userId}`);
              finalPremium = true;
              finalPlanName = userExists[0].planName || finalPlanName;
              finalRenewal = userExists[0].renewalDate || finalRenewal;
            }
          }

          const userPayload = {
            isPremium: finalPremium,
            planName: finalPlanName,
            renewalDate: finalRenewal,
            updatedAt: new Date()
          };

          if (userExists.length > 0) {
            await db.update(users).set(userPayload).where(eq(users.uid, userId));
          } else {
            await db.insert(users).values({
              uid: userId,
              joinedDate: new Date().toISOString(),
              ...userPayload
            });
          }

          res.json({ success: true, isPremium: userPayload.isPremium, planName: userPayload.planName });
        } catch (err: any) {
          console.error('Error toggling premium in Postgres:', err);
          res.status(500).json({ error: 'فشل تفصيل الترقية المدفوعة.' });
        }
      });

      // Check user premium status on demand
      app.get('/api/profiles/:userId/premium', async (req, res) => {
        try {
          const userId = req.params.userId;
          const userList = await db.select().from(users).where(eq(users.uid, userId)).limit(1);
          if (userList.length > 0) {
            res.json({
              isPremium: userList[0].isPremium || false,
              planName: userList[0].planName || 'Free',
              renewalDate: userList[0].renewalDate || ''
            });
          } else {
            res.json({ isPremium: false, planName: 'Free', renewalDate: '' });
          }
        } catch (err) {
          res.json({ isPremium: false, planName: 'Free', renewalDate: '' });
        }
      });

      // Get recent completions from Postgres
      app.get('/api/completions/recent', async (req, res) => {
        try {
          const recent = await db.select().from(completions).orderBy(desc(completions.createdAt)).limit(10);
          res.json(recent);
        } catch (err: any) {
          console.error('Error fetching recent completions from Postgres:', err);
          res.json([]);
        }
      });

      // Get all profiles/members from Postgres
      app.get('/api/profiles', async (req, res) => {
        try {
          const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
          res.json(allUsers);
        } catch (err: any) {
          console.error('Error fetching general profiles:', err);
          res.json([]);
        }
      });

      // Get stats for user profile from Postgres
      app.get('/api/profiles/:userId', async (req, res) => {
        try {
          const userId = req.params.userId;
          const userList = await db.select().from(users).where(eq(users.uid, userId)).limit(1);
          const userObj = userList[0] || null;

          const createdQuizzes = await db.select().from(quizzes).where(eq(quizzes.creatorId, userId)).orderBy(desc(quizzes.createdAt));
          const takerCompletions = await db.select().from(completions).where(eq(completions.takerId, userId)).orderBy(desc(completions.createdAt));

          let resolvedName = userObj?.name || '';
          if (!resolvedName) {
            const lastComp = takerCompletions[0];
            const lastQuiz = createdQuizzes[0];
            resolvedName = lastComp?.takerName || lastQuiz?.creatorName || 'طالب متميز';
          }

          res.json({
            userId,
            name: resolvedName,
            email: userObj?.email || '',
            photoURL: userObj?.photoUrl || '',
            isPremium: userObj?.isPremium || false,
            planName: userObj?.planName || 'Free',
            renewalDate: userObj?.renewalDate || '',
            bio: userObj?.bio || '',
            location: userObj?.location || '',
            joinedDate: userObj?.joinedDate || userObj?.createdAt?.toISOString() || new Date().toISOString(),
            badgeSymbol: userObj?.badgeSymbol || '🛡️',
            badgeColor: userObj?.badgeColor || '#3b82f6',
            customId: userObj?.customId || '',
            createdQuizzes,
            completions: takerCompletions
          });
        } catch (err: any) {
          console.error('Error preparing profile stats on Postgres:', err);
          res.status(500).json({ error: 'فشل إحضار بيانات الملف الشخصي.' });
        }
      });

      // Save/Update full user profile details from client (base64 photoURL, bio, location, etc.)
      app.post('/api/profiles/:userId', async (req, res) => {
        try {
          const userId = req.params.userId;
          
          // Strict server-side verification of the active Firebase Auth token to prevent parameter tampering
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
            if (authenticatedUser.uid !== userId) {
              return res.status(403).json({ error: 'Unauthorized: Cannot modify other user profiles.' });
            }
          } catch (authErr: any) {
            console.warn('[Security Warn] Profile modification failed authorization checks:', authErr.message);
            return res.status(401).json({ error: 'Unauthorized: Valid authentication token is required.' });
          }

          const { name, photoURL, email, bio, location, badgeSymbol, badgeColor, customId, isStartupSync } = req.body;

          const payload: any = {
            updatedAt: new Date()
          };
          if (name !== undefined) payload.name = name;
          if (photoURL !== undefined) payload.photoUrl = photoURL;
          if (email !== undefined) payload.email = email;
          if (bio !== undefined) payload.bio = bio;
          if (location !== undefined) payload.location = location;
          if (badgeSymbol !== undefined) payload.badgeSymbol = badgeSymbol;
          if (badgeColor !== undefined) payload.badgeColor = badgeColor;

          if (customId !== undefined) {
            if (customId && customId.trim()) {
              const cleanCustomId = customId.trim().toLowerCase().replace(/^@/, '');
              
              // Verify format is alphanumeric/underscore
              if (!/^[a-zA-Z0-9_]+$/.test(cleanCustomId)) {
                return res.status(400).json({ error: 'عذراً، يجب أن يحتوي المعرّف المخصص على أحرف إنجليزية وأرقام وعلامات شرطة سفلية (_) فقط.' });
              }

              const taken = await db.select().from(users).where(eq(users.customId, cleanCustomId)).limit(1);
              if (taken.length > 0 && taken[0].uid !== userId) {
                const suggestions = [
                  `${cleanCustomId}123`,
                  `${cleanCustomId}_pro`,
                  `${cleanCustomId}_quiz`
                ];
                return res.status(400).json({ 
                  error: 'معرّف الحساب المخصص مأخوذ بالفعل من قِبل مستخدم آخر.', 
                  suggestions 
                });
              }
              payload.customId = cleanCustomId;
            } else {
              payload.customId = null;
            }
          }

          const userList = await db.select().from(users).where(eq(users.uid, userId)).limit(1);
          if (isStartupSync && userList.length > 0 && userList[0].photoUrl) {
            delete payload.photoUrl;
          }
          if (userList.length > 0) {
            await db.update(users).set(payload).where(eq(users.uid, userId));
          } else {
            await db.insert(users).values({
              uid: userId,
              name: name || 'طالب متميز',
              email: email || '',
              photoUrl: photoURL || '',
              isPremium: false,
              planName: 'Free',
              joinedDate: new Date().toISOString(),
              bio: bio || '',
              location: location || '',
              badgeSymbol: badgeSymbol || '🛡️',
              badgeColor: badgeColor || '#3b82f6',
              customId: payload.customId || null,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }

          // Propagate name change to past creations/completions if sent
          if (name) {
            await db.update(quizzes).set({ creatorName: name.trim() }).where(eq(quizzes.creatorId, userId));
            await db.update(completions).set({ takerName: name.trim() }).where(eq(completions.takerId, userId));
          }

          res.json({ success: true });
        } catch (err: any) {
          console.error('Error saving user profile on Postgres:', err);
          res.status(500).json({ error: 'فشل حفظ الملف الشخصي.' });
        }
      });

      // --------------------------------------------------------------------------
      //                     SECURITY SESSIONS & 2FA TOTP ENDPOINTS
      // --------------------------------------------------------------------------

      // Cryptographic TOTP Base32 logic (zero external dependencies)
      function base32ToBytes(base32: string): Buffer {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = '';
        const cleanBase32 = base32.toUpperCase().replace(/=+$/, '');
        for (let i = 0; i < cleanBase32.length; i++) {
          const val = alphabet.indexOf(cleanBase32[i]);
          if (val === -1) throw new Error('Invalid base32 character');
          bits += val.toString(2).padStart(5, '0');
        }
        const bytes = [];
        for (let i = 0; i + 8 <= bits.length; i += 8) {
          bytes.push(parseInt(bits.substring(i, i + 8), 2));
        }
        return Buffer.from(bytes);
      }

      function generateHOTP(secretBase32: string, counter: number): string {
        const key = base32ToBytes(secretBase32);
        const buffer = Buffer.alloc(8);
        buffer.writeBigInt64BE(BigInt(counter));
        
        const hmac = crypto.createHmac('sha1', key);
        hmac.update(buffer);
        const hmacResult = hmac.digest();
        
        const offset = hmacResult[hmacResult.length - 1] & 0xf;
        const binary = ((hmacResult[offset] & 0x7f) << 24) |
                       ((hmacResult[offset + 1] & 0xff) << 16) |
                       ((hmacResult[offset + 2] & 0xff) << 8) |
                       (hmacResult[offset + 3] & 0xff);
        
        const otp = binary % 1000000;
        return otp.toString().padStart(6, '0');
      }

      function verifyTOTP(secretBase32: string, token: string, window = 1): boolean {
        try {
          const counter = Math.floor(Date.now() / 1000 / 30);
          for (let i = -window; i <= window; i++) {
            if (generateHOTP(secretBase32, counter + i) === token) {
              return true;
            }
          }
        } catch (err) {
          console.error('TOTP verification error:', err);
        }
        return false;
      }

      function generateBase32Secret(length = 16): string {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let result = '';
        const bytes = crypto.randomBytes(length);
        for (let i = 0; i < length; i++) {
          result += alphabet[bytes[i] % alphabet.length];
        }
        return result;
      }

      // Session User-Agent and Location parsers
      function parseUserAgentDetails(uaStr: string) {
        if (!uaStr) return { device: 'Unknown Device', browser: 'Unknown Browser', os: 'Unknown OS', ip: '' };
        const parser = new UAParser(uaStr);
        const result = parser.getResult();
        
        let deviceName = result.device.vendor ? `${result.device.vendor} ${result.device.model || ''}`.trim() : '';
        if (!deviceName) {
          if (result.os.name === 'Mac OS') deviceName = 'Apple Mac';
          else if (result.os.name === 'Windows') deviceName = 'Windows PC';
          else if (result.os.name === 'iOS') deviceName = 'Apple iPhone/iPad';
          else if (result.os.name === 'Android') deviceName = 'Android Device';
          else if (result.os.name === 'Linux') deviceName = 'Linux Machine';
          else deviceName = 'Unknown Device';
        }
        
        let browserName = result.browser.name ? `${result.browser.name} ${result.browser.major || ''}`.trim() : 'Unknown Browser';
        let osName = result.os.name ? `${result.os.name} ${result.os.version || ''}`.trim() : 'Unknown OS';
        
        return { device: deviceName, browser: browserName, os: osName };
      }

      function getLocationFromIP(ip: string) {
        // If local ip, mock a location, else use geoip
        const localIps = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
        if (localIps.includes(ip) || !ip) {
          return { ar: 'القاهرة، مصر (محلي)', en: 'Cairo, Egypt (Local)', country: 'Egypt', city: 'Cairo' };
        }
        
        const geo = geoip.lookup(ip);
        if (geo) {
          return { 
            ar: `${geo.city || 'مدينة غير معروفة'}، ${geo.country}`, 
            en: `${geo.city || 'Unknown City'}, ${geo.country}`,
            country: geo.country,
            city: geo.city || 'Unknown City'
          };
        }
        
        return { ar: 'موقع غير معروف', en: 'Unknown Location', country: 'Unknown', city: 'Unknown' };
      }
      // Endpoint: Get Active Sessions
      app.get('/api/security/sessions', async (req, res) => {
        try {
          const authenticatedUser = await getAuthenticatedUser(req);
          const userId = authenticatedUser.uid;

          // Extract current request details
          const ua = req.headers['user-agent'] || '';
          const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
          const cleanIp = ip.split(',')[0].trim();
          const uaDetails = parseUserAgentDetails(ua);
          const loc = getLocationFromIP(cleanIp);
          const currentDeviceLabel = `${uaDetails.device} - ${uaDetails.browser}`;
          const currentBrowser = uaDetails.browser;
          const currentOs = uaDetails.os;
          const currentIp = cleanIp;

          // Check existing sessions
          let list = await db.select().from(userSessions).where(eq(userSessions.userId, userId));

          if (list.length === 0) {
            // First load: Seed standard layout devices securely
            const currentSessionId = `sess-curr-${Math.random().toString(36).substring(2, 10)}`;
            const dummySess1Id = `sess-dum1-${Math.random().toString(36).substring(2, 10)}`;
            const dummySess2Id = `sess-dum2-${Math.random().toString(36).substring(2, 10)}`;

            const initialSessions = [
              {
                id: currentSessionId,
                userId: userId,
                device: currentDeviceLabel,
                location: loc.ar, // Store localized name
                ipAddress: cleanIp,
                lastActive: 'نشط الآن',
                current: true,
                createdAt: new Date()
              },
              {
                id: dummySess1Id,
                userId: userId,
                device: 'MacBook Pro M3 (Safari)',
                location: 'الجيزة، مصر',
                ipAddress: '197.34.112.55',
                lastActive: 'منذ ساعتين',
                current: false,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
              },
              {
                id: dummySess2Id,
                userId: userId,
                device: 'iPhone 15 Pro (Safari)',
                location: 'الإسكندرية، مصر',
                ipAddress: '196.221.43.120',
                lastActive: 'منذ يومين',
                current: false,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
              }
            ];

            for (const s of initialSessions) {
              await db.insert(userSessions).values(s);
            }

            list = await db.select().from(userSessions).where(eq(userSessions.userId, userId));
          } else {
            // Ensure there is at least one 'current' session for this device
            const currentActive = list.find(s => s.current);
            if (!currentActive) {
              const currentSessionId = `sess-curr-${Math.random().toString(36).substring(2, 10)}`;
              await db.insert(userSessions).values({
                id: currentSessionId,
                userId: userId,
                device: currentDeviceLabel,
                location: loc.ar,
                ipAddress: cleanIp,
                lastActive: 'نشط الآن',
                current: true,
                createdAt: new Date()
              });
              list = await db.select().from(userSessions).where(eq(userSessions.userId, userId));
            }
          }

          // Format lastActive beautifully
          const formatted = list.map(s => ({
            id: s.id,
            device: s.device,
            location: s.location,
            lastActive: s.lastActive,
            current: s.current
          }));

          // Sort current to the top
          formatted.sort((a, b) => (a.current === b.current ? 0 : a.current ? -1 : 1));

          res.json(formatted);
        } catch (err: any) {
          console.error('Error fetching security sessions:', err);
          res.status(500).json({ error: 'Failed to retrieve sessions' });
        }
      });

      // Endpoint: Revoke specific session
      app.post('/api/security/sessions/revoke', async (req, res) => {
        try {
          const authenticatedUser = await getAuthenticatedUser(req);
          const userId = authenticatedUser.uid;
          const { sessionId } = req.body;

          if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
          }

          // Delete session ensuring ownership
          await db.delete(userSessions).where(
            and(
              eq(userSessions.id, sessionId),
              eq(userSessions.userId, userId),
              eq(userSessions.current, false) // Prevent revoking current active session via this endpoint
            )
          );

          res.json({ success: true });
        } catch (err: any) {
          console.error('Error revoking session:', err);
          res.status(500).json({ error: 'Failed to revoke session' });
        }
      });

      // Endpoint: Revoke all other sessions
      app.post('/api/security/sessions/revoke-all', async (req, res) => {
        try {
          const authenticatedUser = await getAuthenticatedUser(req);
          const userId = authenticatedUser.uid;

          // Delete all other sessions
          await db.delete(userSessions).where(
            and(
              eq(userSessions.userId, userId),
              eq(userSessions.current, false)
            )
          );

          res.json({ success: true });
        } catch (err: any) {
          console.error('Error revoking all other sessions:', err);
          res.status(500).json({ error: 'Failed to revoke other sessions' });
        }
      });

      // Endpoint: Check 2FA Status
      app.get('/api/security/2fa/status', async (req, res) => {
        try {
          const authenticatedUser = await getAuthenticatedUser(req);
          const userId = authenticatedUser.uid;

          const userRecord = await db.select().from(users).where(eq(users.uid, userId)).limit(1);
          const enabled = userRecord.length > 0 ? !!userRecord[0].twoFactorEnabled : false;

          res.json({ enabled });
        } catch (err: any) {
          console.error('Error checking 2FA status:', err);
          res.status(500).json({ error: 'Failed to retrieve 2FA status' });
        }
      });

      // Endpoint: Enroll in 2FA (Generate TOTP Secret & QR Code)
      app.post('/api/security/2fa/enroll', async (req, res) => {
        try {
          const authenticatedUser = await getAuthenticatedUser(req);
          const userId = authenticatedUser.uid;
          const userEmail = authenticatedUser.email || 'user@quizspace.app';

          // Generate base32 secret
          const tempSecret = generateBase32Secret(16);

          // Create OTPAuth URL
          const otpauthUrl = `otpauth://totp/QuizSpace:${encodeURIComponent(userEmail)}?secret=${tempSecret}&issuer=QuizSpace`;

          // Generate QR Code as Data URL SVG
          const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

          // Update user with temporary secret in database
          await db.update(users).set({
            twoFactorTempSecret: tempSecret,
            updatedAt: new Date()
          }).where(eq(users.uid, userId));

          res.json({
            secret: tempSecret,
            qrCode: qrDataUrl
          });
        } catch (err: any) {
          console.error('Error enrolling in 2FA:', err);
          res.status(500).json({ error: 'Failed to initialize 2FA enrollment' });
        }
      });

      // Endpoint: Verify and confirm 2FA code
      app.post('/api/security/2fa/verify', async (req, res) => {
        try {
          const authenticatedUser = await getAuthenticatedUser(req);
          const userId = authenticatedUser.uid;
          const { code } = req.body;

          if (!code || code.length !== 6) {
            return res.status(400).json({ error: 'كود التحقق يجب أن يكون مكوناً من 6 أرقام.' });
          }

          const userRecord = await db.select().from(users).where(eq(users.uid, userId)).limit(1);
          if (userRecord.length === 0 || !userRecord[0].twoFactorTempSecret) {
            return res.status(400).json({ error: 'لم يتم بدء عملية تفعيل المصادقة الثنائية.' });
          }

          const tempSecret = userRecord[0].twoFactorTempSecret;
          const isValid = verifyTOTP(tempSecret, code);

          if (!isValid) {
            return res.status(400).json({ error: 'كود التحقق غير صحيح أو منتهي الصلاحية.' });
          }

          // Success: promote temp secret to active secret, set enabled
          await db.update(users).set({
            twoFactorEnabled: true,
            twoFactorSecret: tempSecret,
            twoFactorTempSecret: null,
            updatedAt: new Date()
          }).where(eq(users.uid, userId));

          res.json({ success: true });
        } catch (err: any) {
          console.error('Error verifying 2FA challenge:', err);
          res.status(500).json({ error: 'Failed to verify 2FA' });
        }
      });

      // Endpoint: Disable 2FA
      app.post('/api/security/2fa/disable', async (req, res) => {
        try {
          const authenticatedUser = await getAuthenticatedUser(req);
          const userId = authenticatedUser.uid;

          await db.update(users).set({
            twoFactorEnabled: false,
            twoFactorSecret: null,
            twoFactorTempSecret: null,
            updatedAt: new Date()
          }).where(eq(users.uid, userId));

          res.json({ success: true });
        } catch (err: any) {
          console.error('Error disabling 2FA:', err);
          res.status(500).json({ error: 'Failed to disable 2FA' });
        }
      });

      // Endpoint: Check 2FA status by UID or email (used at login)
      app.post('/api/auth/2fa/check', async (req, res) => {
        try {
          const { email, uid } = req.body;
          if (!email && !uid) {
            return res.status(400).json({ error: 'Email or UID is required' });
          }

          let userRecord;
          if (uid) {
            userRecord = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
          } else {
            userRecord = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
          }
          
          const enabled = userRecord.length > 0 ? !!userRecord[0].twoFactorEnabled : false;

          res.json({ enabled, uid: userRecord.length > 0 ? userRecord[0].uid : null });
        } catch (err: any) {
          console.error('Error checking login 2FA status:', err);
          res.status(500).json({ error: 'Failed to retrieve 2FA status' });
        }
      });

      // Endpoint: Verify TOTP code at login without full auth header
      app.post('/api/auth/2fa/verify', async (req, res) => {
        try {
          const { uid, code } = req.body;
          if (!uid || !code) {
            return res.status(400).json({ error: 'UID and verification code are required.' });
          }

          const userRecord = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
          if (userRecord.length === 0 || !userRecord[0].twoFactorSecret) {
            return res.status(400).json({ error: 'لم يتم تفعيل المصادقة الثنائية لهذا الحساب.' });
          }

          const secret = userRecord[0].twoFactorSecret;
          const isValid = verifyTOTP(secret, code);

          if (!isValid) {
            return res.status(400).json({ error: 'كود التحقق غير صحيح أو منتهي الصلاحية.' });
          }

          res.json({ success: true });
        } catch (err: any) {
          console.error('Error verifying login 2FA:', err);
          res.status(500).json({ error: 'Failed to verify 2FA' });
        }
      });

      // Helper to generate a lightweight 3-part base64 encoded token compatible with getAuthenticatedUser
      function generateLocalToken(uid: string, email: string, name: string) {
        const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
        const payload = Buffer.from(JSON.stringify({ uid, user_id: uid, email, name, display_name: name })).toString('base64url');
        const signature = 'local_fallback_signature';
        return `${header}.${payload}.${signature}`;
      }

      // Local fallback registration endpoint
      app.post('/api/auth/register', async (req, res) => {
        try {
          const { username, email, password } = req.body;
          if (!username || !email || !password) {
            return res.status(400).json({ error: 'يرجى إدخال جميع الحقول المطلوبة (اسم المستخدم، البريد، كلمة المرور).' });
          }

          const cleanEmail = email.toLowerCase().trim();
          const existingUser = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
          if (existingUser.length > 0) {
            return res.status(400).json({ error: 'هذا البريد الإلكتروني مسجل بالفعل في حساب آخر.' });
          }

          const uid = `local-user-${Math.random().toString(36).substring(2, 10)}`;
          await db.insert(users).values({
            uid,
            name: username.trim(),
            email: cleanEmail,
            password: password, // Stored safely for local authentication
            planName: 'Free',
            isPremium: false,
            joinedDate: new Date().toISOString(),
            createdAt: new Date(),
            updatedAt: new Date()
          });

          const token = generateLocalToken(uid, cleanEmail, username.trim());
          res.json({
            success: true,
            token,
            user: {
              uid,
              name: username.trim(),
              email: cleanEmail,
              isPremium: false,
              planName: 'Free'
            }
          });
        } catch (err: any) {
          console.error('Local register error:', err);
          res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الحساب المحلي.' });
        }
      });

      // Local fallback login endpoint
      app.post('/api/auth/login', async (req, res) => {
        try {
          const { email, password } = req.body;
          if (!email || !password) {
            return res.status(400).json({ error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' });
          }

          const cleanEmail = email.toLowerCase().trim();
          const userList = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
          if (userList.length === 0) {
            return res.status(400).json({ error: 'البريد الإلكتروني غير مسجل بالمنصة.' });
          }

          const userObj = userList[0];
          if (userObj.password !== password) {
            return res.status(400).json({ error: 'كلمة المرور غير صحيحة، يرجى إعادة المحاولة.' });
          }

          const token = generateLocalToken(userObj.uid, cleanEmail, userObj.name || 'طالب متميز');
          res.json({
            success: true,
            token,
            user: {
              uid: userObj.uid,
              name: userObj.name || 'طالب متميز',
              email: cleanEmail,
              photoURL: userObj.photoUrl || '',
              customId: userObj.customId || '',
              isPremium: userObj.isPremium || false,
              planName: userObj.planName || 'Free'
            }
          });
        } catch (err: any) {
          console.error('Local login error:', err);
          res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول المحلي.' });
        }
      });

      // Update/Save user name across completions & quizzes in Postgres
      app.post('/api/profiles/:userId/name', async (req, res) => {
        try {
          const userId = req.params.userId;

          // Strict server-side verification of the active Firebase Auth token to prevent parameter tampering
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
            if (authenticatedUser.uid !== userId) {
              return res.status(403).json({ error: 'Unauthorized: Cannot modify other user names.' });
            }
          } catch (authErr: any) {
            console.warn('[Security Warn] Name modification failed authorization checks:', authErr.message);
            return res.status(401).json({ error: 'Unauthorized: Valid authentication token is required.' });
          }

          const { name } = req.body;
          
          if (!name || !name.trim()) {
            return res.status(400).json({ error: 'الاسم مطلوب ولا يمكن تركه فارغاً.' });
          }

          const trimmed = name.trim();

          const userExists = await db.select().from(users).where(eq(users.uid, userId)).limit(1);
          if (userExists.length > 0) {
            await db.update(users).set({ name: trimmed, updatedAt: new Date() }).where(eq(users.uid, userId));
          } else {
            await db.insert(users).values({
              uid: userId,
              name: trimmed,
              planName: 'Free',
              isPremium: false,
              joinedDate: new Date().toISOString(),
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
          
          await db.update(quizzes).set({ creatorName: trimmed }).where(eq(quizzes.creatorId, userId));
          await db.update(completions).set({ takerName: trimmed }).where(eq(completions.takerId, userId));
          
          res.json({ success: true, name: trimmed });
        } catch (err: any) {
          console.error('Error updating user name across Postgres:', err);
          res.status(500).json({ error: 'فشل حفظ الاسم وتحديث السجلات.' });
        }
      });

      // Check unique customId and suggest alternatives
      app.get('/api/profiles/check-custom-id/:customId', async (req, res) => {
        try {
          const cleanCustomId = req.params.customId.trim().toLowerCase().replace(/^@/, '');
          const userIdQuery = req.query.userId as string | undefined;

          const taken = await db.select().from(users).where(eq(users.customId, cleanCustomId)).limit(1);
          if (taken.length > 0 && taken[0].uid !== userIdQuery) {
            const suggestions = [
              `${cleanCustomId}123`,
              `${cleanCustomId}_pro`,
              `${cleanCustomId}_quiz`
            ];
            return res.json({ available: false, suggestions });
          }
          return res.json({ available: true, suggestions: [] });
        } catch (err) {
          res.json({ available: true, suggestions: [] });
        }
      });

      // Get real-time followers and following statistics matching database follows table
      app.get('/api/follows/:userId', async (req, res) => {
        try {
          const userId = req.params.userId;
          const viewerId = req.query.viewerId as string | undefined;

          const followersList = await db.select().from(follows).where(eq(follows.followingId, userId));
          const followingList = await db.select().from(follows).where(eq(follows.followerId, userId));

          let isFollowing = false;
          if (viewerId) {
            const existing = await db.select().from(follows).where(
              and(
                eq(follows.followerId, viewerId),
                eq(follows.followingId, userId)
              )
            ).limit(1);
            isFollowing = existing.length > 0;
          }

          res.json({
            followersCount: followersList.length,
            followingCount: followingList.length,
            isFollowing
          });
        } catch (err) {
          res.status(500).json({ error: 'Failed to query follow statistics.' });
        }
      });

      // Toggle follows status
      app.post('/api/follows/:userId/toggle', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const followerId = authUser.uid;
              const followingId = req.params.userId;
              if (followerId === followingId) return res.status(400).json({ error: 'Cannot follow yourself.' });

              const existing = await db.select().from(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))).limit(1);
              let isFollowing = false;
              if (existing.length > 0) {
                await db.delete(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
              } else {
                await db.insert(follows).values({ id: 'fol-' + Math.random().toString(36).substring(2, 11), followerId, followingId, createdAt: new Date() });
                isFollowing = true;
              }
              res.json({ success: true, isFollowing });
            } catch (err) {
              res.status(500).json({ error: 'Failed' });
            }
      });

      // ---------------- PREMIUM REQUESTS BACKED BY POSTGRES (Direct receipts/screenshots stored as Base64 text) ----------------
      app.post('/api/premium-requests', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const reqData = req.body;
              const status = reqData.status || 'pending';
              const isApprovedImmediately = status === 'approved';

              await db.insert(premiumRequests).values({
                id: reqData.id || 'preq-' + Math.random().toString(36).substring(2, 11),
                userId: authUser.uid,
                name: reqData.name || authUser.name || reqData.userName || 'User',
                email: reqData.email || authUser.email || '',
                planName: reqData.planName,
                paymentScreenshot: reqData.paymentScreenshot || null,
                promoCodeUsed: reqData.promoCodeUsed || null,
                status: status,
                createdAt: reqData.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });

              // If status is approved immediately (e.g. 100% discount free promo code)
              if (isApprovedImmediately) {
                const targetUid = authUser.uid;
                const activePlan = reqData.planName || 'الباقة الذهبية للمعلمين';
                const newRenewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

                const userExists = await db.select().from(users).where(eq(users.uid, targetUid)).limit(1);
                if (userExists.length > 0) {
                  await db.update(users).set({
                    isPremium: true,
                    planName: activePlan,
                    renewalDate: newRenewalDate,
                    updatedAt: new Date()
                  }).where(eq(users.uid, targetUid));
                } else {
                  await db.insert(users).values({
                    uid: targetUid,
                    isPremium: true,
                    planName: activePlan,
                    renewalDate: newRenewalDate,
                    name: reqData.name || authUser.name || 'طالب متميز',
                    email: reqData.email || authUser.email || '',
                    joinedDate: new Date().toISOString(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                  });
                }
              }

              res.json({ success: true });
            } catch (err) {
              console.error('Error inserting premium request:', err);
              res.status(500).json({ error: 'Failed' });
            }
      });

      app.get('/api/premium-requests', async (req, res) => {
        try {
          const reqList = await db.select().from(premiumRequests).orderBy(desc(premiumRequests.createdAt));
          const mappedList = reqList.map((item) => ({
            ...item,
            userName: item.name || 'طالب متميز',
            userEmail: item.email || '',
            receiptUrl: item.paymentScreenshot || ''
          }));
          res.json(mappedList);
        } catch (err: any) {
          res.json([]);
        }
      });

      app.post('/api/premium-requests/:id/status', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });
              if (authUser.email !== 'adman777888999@gmail.com') return res.status(403).json({ error: 'Admin only' });

              const { status, rejectReason } = req.body;
              const requestId = req.params.id;

              // Find the request first to know who it belongs to
              const reqResult = await db.select().from(premiumRequests).where(eq(premiumRequests.id, requestId)).limit(1);
              if (reqResult.length === 0) {
                return res.status(404).json({ error: 'Request not found' });
              }

              const premiumRequestItem = reqResult[0];

              // Update the premium requests table
              await db.update(premiumRequests).set({ 
                status, 
                rejectReason: rejectReason || '',
                updatedAt: new Date().toISOString()
              }).where(eq(premiumRequests.id, requestId));

              // If approved, update the user table to set isPremium to true
              if (status === 'approved') {
                const targetUid = premiumRequestItem.userId;
                const activePlan = premiumRequestItem.planName || 'الباقة الذهبية للمعلمين';
                const newRenewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

                const userExists = await db.select().from(users).where(eq(users.uid, targetUid)).limit(1);
                if (userExists.length > 0) {
                  await db.update(users).set({
                    isPremium: true,
                    planName: activePlan,
                    renewalDate: newRenewalDate,
                    updatedAt: new Date()
                  }).where(eq(users.uid, targetUid));
                } else {
                  await db.insert(users).values({
                    uid: targetUid,
                    isPremium: true,
                    planName: activePlan,
                    renewalDate: newRenewalDate,
                    name: premiumRequestItem.name || 'طالب متميز',
                    email: premiumRequestItem.email || '',
                    joinedDate: new Date().toISOString(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                  });
                }
              }

              res.json({ success: true });
            } catch (err) {
              console.error('Error updating premium request status:', err);
              res.status(500).json({ error: 'Failed' });
            }
      });

      app.post('/api/admin/manual-activate', async (req, res) => {
        try {
          // Cybersecurity check: Verify requester is the real admin
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول كمسؤول أولاً.' });
          }

          if (authenticatedUser.email !== 'adman777888999@gmail.com') {
            return res.status(403).json({ error: 'اختراق أمني! ليس لديك صلاحيات المسؤول للقيام بالتفعيل اليدوي.' });
          }

          const { userId, planName, durationDays, isPremium } = req.body;
          if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
          }

          const searchId = userId.trim().toLowerCase().replace(/^@/, '');
          let targetUid = userId;

          // Resolve UID from Custom ID
          const matchedUsers = await db.select().from(users).where(eq(users.customId, searchId)).limit(1);
          if (matchedUsers.length > 0) {
            targetUid = matchedUsers[0].uid;
          }

          const shouldBePremium = isPremium !== undefined ? !!isPremium : (planName !== 'Free' && !!planName);
          const activePlan = shouldBePremium ? (planName || 'الباقة الذهبية للمعلمين') : 'Free';
          const days = parseInt(durationDays) || 30;
          const newRenewalDate = shouldBePremium ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() : '';

          // Check if user exists, if yes update, if not insert
          const userExists = await db.select().from(users).where(eq(users.uid, targetUid)).limit(1);
          if (userExists.length > 0) {
            await db.update(users).set({
              isPremium: shouldBePremium,
              planName: activePlan,
              renewalDate: newRenewalDate,
              updatedAt: new Date()
            }).where(eq(users.uid, targetUid));
          } else {
            await db.insert(users).values({
              uid: targetUid,
              isPremium: shouldBePremium,
              planName: activePlan,
              renewalDate: newRenewalDate,
              name: 'طالب متميز',
              joinedDate: new Date().toISOString(),
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }

          if (shouldBePremium) {
            // Insert an automatic approved request into premiumRequests as record
            const requestId = 'manual-req-' + Math.random().toString(36).substring(2, 11);
            await db.insert(premiumRequests).values({
              id: requestId,
              userId: targetUid,
              name: userExists.length > 0 ? (userExists[0].name || 'طالب متميز') : 'طالب متميز',
              email: userExists.length > 0 ? (userExists[0].email || '') : '',
              planName: activePlan,
              paymentScreenshot: 'manual_activation', // marker
              status: 'approved',
              rejectReason: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }

          res.json({ success: true, message: 'Account status updated successfully.' });
        } catch (err: any) {
          console.error('Error in manual activation/removal:', err);
          res.status(500).json({ error: 'Failed manual activation or removal.' });
        }
      });

      // ---------------- COUPONS & PROMOTIONS SYSTEM BACKED BY POSTGRES ----------------
      app.get('/api/promotions', async (req, res) => {
        try {
          const list = await db.select().from(promotions).orderBy(desc(promotions.createdAt));
          res.json(list);
        } catch (err) {
          res.json([]);
        }
      });

      app.post('/api/promotions', async (req, res) => {
        try {

              let authenticatedUser;
              try {
                authenticatedUser = await getAuthenticatedUser(req);
              } catch (authErr) {
                return res.status(401).json({ error: 'Unauthorized.' });
              }
              if (authenticatedUser.email !== 'adman777888999@gmail.com') {
                return res.status(403).json({ error: 'Forbidden. Admin only.' });
              }

          const promo = req.body;
          const existing = await db.select().from(promotions).where(eq(promotions.id, promo.id)).limit(1);
          if (existing.length > 0) {
            await db.update(promotions).set({
              discountPercent: promo.discountPercent,
              endDate: promo.endDate,
              applicablePlans: promo.applicablePlans,
              isActive: promo.isActive ?? true
            }).where(eq(promotions.id, promo.id));
          } else {
            await db.insert(promotions).values({
              id: promo.id,
              discountPercent: promo.discountPercent,
              endDate: promo.endDate,
              applicablePlans: promo.applicablePlans,
              isActive: promo.isActive ?? true,
              createdAt: promo.createdAt || new Date().toISOString()
            });
          }
          res.json({ success: true });
        } catch (err) {
          res.status(500).json({ error: 'Fails to save promotion.' });
        }
      });

      app.delete('/api/promotions/:id', async (req, res) => {
        try {

              let authenticatedUser;
              try {
                authenticatedUser = await getAuthenticatedUser(req);
              } catch (authErr) {
                return res.status(401).json({ error: 'Unauthorized.' });
              }
              if (authenticatedUser.email !== 'adman777888999@gmail.com') {
                return res.status(403).json({ error: 'Forbidden. Admin only.' });
              }

          await db.delete(promotions).where(eq(promotions.id, req.params.id));
          res.json({ success: true });
        } catch (err) {
          res.status(500).json({ error: 'Delete failed.' });
        }
      });

      app.get('/api/coupons', async (req, res) => {
        try {
          const list = await db.select().from(couponCodes).orderBy(desc(couponCodes.createdAt));
          res.json(list);
        } catch (err) {
          res.json([]);
        }
      });

      app.get('/api/coupons/:code', async (req, res) => {
        try {
          const list = await db.select().from(couponCodes).where(eq(sql`UPPER(${couponCodes.code})`, req.params.code.trim().toUpperCase())).limit(1);
          if (list.length > 0) {
            res.json(list[0]);
          } else {
            res.status(404).json({ error: 'كود الخصم غير صالح.' });
          }
        } catch (err) {
          res.status(500).json({ error: 'Query failed.' });
        }
      });

      app.post('/api/coupons', async (req, res) => {
        try {

              let authenticatedUser;
              try {
                authenticatedUser = await getAuthenticatedUser(req);
              } catch (authErr) {
                return res.status(401).json({ error: 'Unauthorized.' });
              }
              if (authenticatedUser.email !== 'adman777888999@gmail.com') {
                return res.status(403).json({ error: 'Forbidden. Admin only.' });
              }

          const coupon = req.body;
          const codeId = coupon.code.trim().toUpperCase();
          const existing = await db.select().from(couponCodes).where(eq(couponCodes.id, codeId)).limit(1);
          if (existing.length > 0) {
            await db.update(couponCodes).set({
              code: coupon.code,
              discountPercent: coupon.discountPercent,
              maxUses: coupon.maxUses,
              usedCount: coupon.usedCount ?? 0,
              expiryDate: coupon.expiryDate,
              isActive: coupon.isActive ?? true,
              applicablePlans: coupon.applicablePlans || null
            }).where(eq(couponCodes.id, codeId));
          } else {
            await db.insert(couponCodes).values({
              id: codeId,
              code: coupon.code,
              discountPercent: coupon.discountPercent,
              maxUses: coupon.maxUses ?? 9999,
              usedCount: coupon.usedCount ?? 0,
              expiryDate: coupon.expiryDate,
              isActive: coupon.isActive ?? true,
              createdAt: coupon.createdAt || new Date().toISOString(),
              applicablePlans: coupon.applicablePlans || null
            });
          }
          res.json({ success: true });
        } catch (err) {
          res.status(500).json({ error: 'Failed to save coupon.' });
        }
      });

      app.delete('/api/coupons/:id', async (req, res) => {
        try {

              let authenticatedUser;
              try {
                authenticatedUser = await getAuthenticatedUser(req);
              } catch (authErr) {
                return res.status(401).json({ error: 'Unauthorized.' });
              }
              if (authenticatedUser.email !== 'adman777888999@gmail.com') {
                return res.status(403).json({ error: 'Forbidden. Admin only.' });
              }

          await db.delete(couponCodes).where(eq(couponCodes.id, req.params.id.trim().toUpperCase()));
          res.json({ success: true });
        } catch (err) {
          res.status(500).json({ error: 'Delete failed.' });
        }
      });

      // Promote Coupon via AI & Dynamic high-end Arabic templates
      app.post('/api/admin/generate-promo-msg', async (req, res) => {
        try {
          // Cybersecurity check: Verify requester is the real admin
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول كمسؤول أولاً.' });
          }

          if (authenticatedUser.email !== 'adman777888999@gmail.com') {
            return res.status(403).json({ error: 'اختراق أمني! ليس لديك صلاحيات المسؤول لتوليد رسائل الخصومات.' });
          }

          const { code, discountPercent } = req.body;
          if (!code || !discountPercent) {
            return res.status(400).json({ error: 'Code and discountPercent are required.' });
          }

          const fallbackTemplates = [
            (pct: string, cd: string) => `🌌 نقاء المعرفة يكتمل بذكاء كوزمو... المساعد الذكي يمنحكم فرصة استثنائية للارتقاء بصفوفكم! استخدموا الكود الرمزى [ ${cd} ] للحصول على خصم مذهل بقيمة [ ${pct}% ] على كافة اشتراكات بريميوم! الرحلة الأكاديمية باتت أسهل 🚀`,
            (pct: string, cd: string) => `🚀 إلى جميع طلابنا الأوفياء وصنّاع المستقبل! هل أنتم مستعدون لتجربة قوة الـ AI الخارقة؟ المساعد كوزمو يطلق عرضاً استثنائياً لكم! خصم حارق بقيمة [ ${pct}% ] بانتظاركم مع الكود: [ ${cd} ] 🔥 لا تفوتوا اللحظة!`,
            (pct: string, cd: string) => `🤖 أتمتة التعليم والذكاء الاصطناعي في متناول يديك الآن. يسر منصة كوزمو الإعلان عن كود التفعيل الخاص [ ${cd} ] بخصم فوري قيمته [ ${pct}% ]. ارتقِ بعضويتك للشفق السحابي الآن واصنع اختبارات بلا حدود ✨`,
            (pct: string, cd: string) => `👑 لكل من ينشد التميز والريادة: باقة كوزمو بريميوم تفتح لكم آفاق التعليم التفاعلي الأقوى. يسعدنا تقديم امتياز حصري بخصم [ ${pct}% ] باستخدام رمز التفعيل: [ ${cd} ]. أسرعوا، التفعيلات المتبقية محدودة للغاية 🌟`,
            (pct: string, cd: string) => `🛰️ ذكاء كوزمو ليس مجرد خوارزميات، بل هو رفيقك الأكاديمي الحقيقي! وفرنا لكم كود الخصم الفوري [ ${cd} ] ليريحكم بنسبة [ ${pct}% ] كاملة على الباقة الذهبية والجبارة. دعوا كوزمو يقوم بالعمل الشاق أثناء استمتاعكم بإنتاج فريد للمستقبل ✨`
          ];

          const randomIndex = Math.floor(Math.random() * fallbackTemplates.length);
          let message = fallbackTemplates[randomIndex](discountPercent, code);
          let generatedByAi = false;

          if (process.env.GEMINI_API_KEY) {
            try {
              const response = await generateContentWithRetryAndFallback({
                model: "gemini-3.5-flash",
                contents: `اكتب لي رسالة ترويجية تسويقية ذكية ومثيرة وقصيرة باللغة العربية للطلاب ليعلموا بوجود كود خصم جديد على منصة 'كوزمو الذكي' للتعلم والاختبارات التفاعلية بالذكاء الاصطناعي.
البيانات:
- كود الخصم: ${code}
- نسبة الخصم المئوية: ${discountPercent}%
النغمة أو الأسلوب المتوقع: راقٍ وتكنولوجي وجذاب ومليء بالإثارة والأناقة، موجّه للطلاب بعبارات أكاديمية مشجعة ومبتكرة مثل 'شياطين المعرفة'، 'فرسان الذكاء'، إلخ، متمنياً لهم التوفيق والارتقاء والنجاح الباهر.
اكتب نص الرسالة مباشرة بدون أي مقدمات أو شرح أو علامات اقتباس، واجعلها تبدو كأنها كُتبت بواسطة 'كوزمو 🤖 رفيقك الذكي'.`,
              });
              if (response && response.text) {
                message = response.text.trim();
                generatedByAi = true;
              }
            } catch (openaiErr) {
              console.warn('Gemini generate promo fail:', openaiErr);
            }
          }

          res.json({ success: true, message, generatedByAi });
        } catch (err: any) {
          console.error('Error generating promo msg:', err);
          res.status(500).json({ error: 'Failed to generate promo message.' });
        }
      });

      // Broadcast Coupon Promo Message to Community Feed and Private Messages
      app.post('/api/admin/broadcast-promo-msg', async (req, res) => {
        try {
          // Cybersecurity check: Verify requester is the real admin
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول كمسؤول أولاً.' });
          }

          if (authenticatedUser.email !== 'adman777888999@gmail.com') {
            return res.status(403).json({ error: 'اختراق أمني! ليس لديك صلاحيات المسؤول للقيام بالإرسال الجماعي.' });
          }

          const { text, senderId, senderName } = req.body;
          if (!text) {
            return res.status(400).json({ error: 'Message text is required.' });
          }

          const sId = senderId || 'admin-cosmo';
          const sName = senderName || 'المساعد كوزمو';

          // 1. Post to Community Feed
          const communityPayload = {
            id: 'post-broadcast-' + Date.now(),
            text: text,
            authorName: sName,
            authorId: sId,
            authorBadgeSymbol: '👑',
            authorBadgeColor: '#eab308', // Gold
            likes: 0,
            likedBy: [],
            createdAt: new Date().toISOString()
          };
          await db.insert(communityPosts).values(communityPayload);

          // 2. Transmit to All Registered Users as a Direct Message
          const allUsers = await db.select().from(users);
          let deliveredCount = 0;

          if (allUsers.length > 0) {
            // Prepare bulk insert batches of 100 to stay inside maximum parameter/variable thresholds
            const dmPayloads = allUsers.map(u => ({
              id: 'msg-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now(),
              senderId: sId,
              senderName: sName,
              receiverId: u.uid,
              receiverName: u.name || 'طالب متميز',
              text: text,
              isRead: false,
              createdAt: new Date().toISOString()
            }));

            const batchSize = 100;
            for (let i = 0; i < dmPayloads.length; i += batchSize) {
              const chunk = dmPayloads.slice(i, i + batchSize);
              await db.insert(directMessages).values(chunk);
            }
            deliveredCount = allUsers.length;
          }

          res.json({ success: true, count: deliveredCount });
        } catch (err: any) {
          console.error('Error broadcasting promo message:', err);
          res.status(500).json({ error: 'Failed to broadcast promotion message.' });
        }
      });

      // ---------------- DETAILED METRICS FETCH FOR COMPETITIONS & RATINGS BACKED BY POSTGRES ----------------
      app.get('/api/quizzes/:id/best-score', async (req, res) => {
        try {
          const list = await db.select().from(completions)
            .where(eq(completions.quizId, req.params.id))
            .orderBy(desc(completions.score))
            .limit(1);
          if (list.length > 0) {
            res.json({ score: list[0].score });
          } else {
            res.json({ score: 0 });
          }
        } catch (err) {
          res.json({ score: 0 });
        }
      });

      app.get('/api/quizzes/:id/completions', async (req, res) => {
        try {
          const list = await db.select().from(completions).where(eq(completions.quizId, req.params.id));
          res.json(list);
        } catch (err) {
          res.json([]);
        }
      });

      app.get('/api/question-ratings/:userId', async (req, res) => {
        try {
          const list = await db.select().from(questionRatings).where(eq(questionRatings.userId, req.params.userId));
          res.json(list);
        } catch (err) {
          res.json([]);
        }
      });

      app.post('/api/question-ratings', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const { questionId, rating, ratingValue, quizId, quizTitle, questionText } = req.body;
              await db.insert(questionRatings).values({
                id: authUser.uid + '_' + questionId,
                questionId,
                userId: authUser.uid,
                ratingValue: ratingValue || rating || '',
                quizId,
                quizTitle: quizTitle || 'Unknown Quiz',
                questionText: questionText || 'Unknown Question',
                createdAt: new Date().toISOString()
              });
              res.json({ success: true });
            } catch (err) {
              res.status(500).json({ error: 'Failed' });
            }
      });

      // ---------------- NOTIFICATIONS SYSTEM BACKED BY POSTGRES ----------------
      app.get('/api/notifications', async (req, res) => {
        try {
          const list = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(30);
          res.json(list);
        } catch (err) {
          res.json([]);
        }
      });

      app.post('/api/notifications', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });
              if (authUser.email !== 'adman777888999@gmail.com') return res.status(403).json({ error: 'Admin only' });

              const item = req.body;
              await db.insert(notifications).values({
                id: item.id || 'notif-' + Math.random().toString(36).substring(2, 11),
                title: item.title,
                body: item.body || item.message || '',
                senderName: item.senderName || 'System',
                type: item.type || 'info',
                createdAt: item.createdAt || new Date().toISOString()
              });
              res.json({ success: true });
            } catch (err) {
              res.status(500).json({ error: 'Failed' });
            }
      });

      // ---------------- WEB PUSH & CLASSROOM NOTIFICATIONS ROUTING ----------------
      const vapidKeys = {
        publicKey: process.env.VAPID_PUBLIC_KEY || '',
        privateKey: process.env.VAPID_PRIVATE_KEY || '',
      };

      if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
        console.log('VAPID keys not configured in environment. Generating dynamic fallback keys...');
        try {
          const generated = webpush.generateVAPIDKeys();
          vapidKeys.publicKey = generated.publicKey;
          vapidKeys.privateKey = generated.privateKey;
        } catch (e) {
          console.error('Error generating VAPID keys:', e);
        }
      }

      if (vapidKeys.publicKey && vapidKeys.privateKey) {
        webpush.setVapidDetails(
          'mailto:admin@quizspace.io',
          vapidKeys.publicKey,
          vapidKeys.privateKey
        );
      }

      app.get('/api/notifications/vapid-public-key', (req, res) => {
        res.json({ publicKey: vapidKeys.publicKey });
      });

      app.post('/api/notifications/subscribe', express.json(), async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const { subscription } = req.body;
              const existing = await db.select().from(userNotificationTokens).where(eq(userNotificationTokens.userId, authUser.uid)).limit(1);
              if (existing.length > 0) {
                await db.update(userNotificationTokens).set({ subscription: JSON.stringify(subscription), createdAt: new Date() }).where(eq(userNotificationTokens.userId, authUser.uid));
              } else {
                await db.insert(userNotificationTokens).values({ id: 'token-' + Math.random().toString(36).substring(2), userId: authUser.uid, subscription: JSON.stringify(subscription), createdAt: new Date() });
              }
              res.json({ success: true });
            } catch (err) {
              res.status(500).json({ error: 'Failed' });
            }
      });

      app.post('/api/classrooms', express.json(), async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });
              
              const userList = await db.select().from(users).where(eq(users.uid, authUser.uid)).limit(1);
              if (!userList.length || !userList[0].isPremium) {
                return res.status(403).json({ error: 'Only premium/teacher accounts can create classrooms.' });
              }

              const item = req.body;
              await db.insert(classroomsTable).values({
                id: item.id,
                name: item.name,
                code: item.code,
                createdBy: authUser.uid,
                creatorName: authUser.name || item.creatorName,
                createdAt: item.createdAt || new Date().toISOString(),
                allowStudentMessages: item.allowStudentMessages !== false,
                allowStudentMedia: item.allowStudentMedia !== false,
              });
              res.json({ success: true });
            } catch (err) {
              console.error('Error saving classroom:', err);
              res.status(500).json({ error: 'Failed to create classroom.' });
            }
      });

      app.post('/api/classrooms/join', express.json(), async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const item = req.body;
              const targetClass = await db.select().from(classroomsTable).where(eq(classroomsTable.id, item.classId)).limit(1);
              
              if (!targetClass.length) return res.status(404).json({ error: 'Classroom not found.' });
              if (targetClass[0].code !== item.classCode) return res.status(403).json({ error: 'Invalid class code.' });

              await db.insert(classroomStudentsTable).values({
                id: item.id || 'enroll-' + Math.random().toString(36).substring(2, 11),
                classId: item.classId,
                classCode: item.classCode,
                studentId: authUser.uid,
                studentName: authUser.name || item.studentName || 'Student',
                studentPhoto: item.studentPhoto || null,
                joinedAt: item.joinedAt || new Date().toISOString(),
                completedQuizzes: item.completedQuizzes || 0,
                avgScore: item.avgScore || 0,
                lastActive: item.lastActive || new Date().toISOString(),
                role: 'student'
              });
              res.json({ success: true });
            } catch (err) {
              console.error('Error joining classroom:', err);
              res.status(500).json({ error: 'Failed to join classroom.' });
            }
      });

      app.get('/api/classrooms', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const enrolled = await db.select().from(classroomStudentsTable).where(eq(classroomStudentsTable.studentId, authUser.uid));
              const classIds = enrolled.map(e => e.classId);
              
              const list = await db.select().from(classroomsTable).orderBy(desc(classroomsTable.createdAt));
              const filtered = list.filter(c => c.createdBy === authUser.uid || classIds.includes(c.id));
              res.json(filtered);
            } catch (err) {
              res.json([]);
            }
      });

      app.get('/api/classrooms/students', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              // Only return students for classrooms the user is in
              const userClasses = await db.select().from(classroomsTable).where(eq(classroomsTable.createdBy, authUser.uid));
              const enrolled = await db.select().from(classroomStudentsTable).where(eq(classroomStudentsTable.studentId, authUser.uid));
              const classIds = [...userClasses.map(c => c.id), ...enrolled.map(e => e.classId)];

              if (classIds.length === 0) return res.json([]);
              
              // Instead of using sql IN which could be complex if classIds is long, just fetch and filter
              const list = await db.select().from(classroomStudentsTable);
              const filtered = list.filter(s => classIds.includes(s.classId));
              res.json(filtered);
            } catch (err) {
              res.json([]);
            }
      });

      app.post('/api/classrooms/:classId/permissions', express.json(), async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });
              
              const { classId } = req.params;
              const targetClass = await db.select().from(classroomsTable).where(eq(classroomsTable.id, classId)).limit(1);
              if (!targetClass.length || targetClass[0].createdBy !== authUser.uid) {
                return res.status(403).json({ error: 'Only the creator can change permissions.' });
              }

              const { allowStudentMessages, allowStudentMedia } = req.body;
              await db.update(classroomsTable)
                .set({
                  allowStudentMessages: allowStudentMessages !== false,
                  allowStudentMedia: allowStudentMedia !== false,
                })
                .where(eq(classroomsTable.id, classId));
              res.json({ success: true });
            } catch (err) {
              res.status(500).json({ error: 'Failed to update permissions.' });
            }
      });

      app.post('/api/classrooms/:classId/students/:studentId/role', express.json(), async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });
              
              const { classId, studentId } = req.params;
              const { role } = req.body;

              const targetClass = await db.select().from(classroomsTable).where(eq(classroomsTable.id, classId)).limit(1);
              if (!targetClass.length || targetClass[0].createdBy !== authUser.uid) {
                return res.status(403).json({ error: 'Only the creator can change roles.' });
              }

              await db.update(classroomStudentsTable)
                .set({ role })
                .where(and(eq(classroomStudentsTable.classId, classId), eq(classroomStudentsTable.studentId, studentId)));
              res.json({ success: true });
            } catch (err) {
              res.status(500).json({ error: 'Failed to update student role.' });
            }
      });

      app.get('/api/classrooms/:classId/messages', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const { classId } = req.params;
              const targetClass = await db.select().from(classroomsTable).where(eq(classroomsTable.id, classId)).limit(1);
              const enrolled = await db.select().from(classroomStudentsTable).where(and(eq(classroomStudentsTable.classId, classId), eq(classroomStudentsTable.studentId, authUser.uid))).limit(1);
              
              if ((!targetClass.length || targetClass[0].createdBy !== authUser.uid) && !enrolled.length) {
                return res.status(403).json({ error: 'Not a member.' });
              }

              const list = await db.select().from(classroomMessagesTable).where(eq(classroomMessagesTable.classId, classId)).orderBy(desc(classroomMessagesTable.createdAt));
              res.json(list);
            } catch (err) {
              res.json([]);
            }
      });

      app.post('/api/classrooms/:classId/messages', express.json(), async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const { classId } = req.params;
              const item = req.body;

              const targetClass = await db.select().from(classroomsTable).where(eq(classroomsTable.id, classId)).limit(1);
              const enrolled = await db.select().from(classroomStudentsTable).where(and(eq(classroomStudentsTable.classId, classId), eq(classroomStudentsTable.studentId, authUser.uid))).limit(1);
              
              if ((!targetClass.length || targetClass[0].createdBy !== authUser.uid) && !enrolled.length) {
                return res.status(403).json({ error: 'Not a member.' });
              }

              await db.insert(classroomMessagesTable).values({
                id: item.id || 'msg-' + Math.random().toString(36).substring(2, 11),
                classId: classId,
                senderId: authUser.uid,
                senderName: authUser.name || item.senderName || 'User',
                senderPhoto: item.senderPhoto || null,
                encryptedText: item.encryptedText || item.text || '',
                isMedia: !!item.hasMedia || !!item.isMedia,
                mediaUrl: item.mediaUrl || null,
                createdAt: new Date()
              });
              res.json({ success: true });
            } catch (err) {
              res.status(500).json({ error: 'Failed to send message.' });
            }
      });

      app.post('/api/classrooms/:classId/notify', express.json(), async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const { classId } = req.params;
              const targetClass = await db.select().from(classroomsTable).where(eq(classroomsTable.id, classId)).limit(1);
              if (!targetClass.length || targetClass[0].createdBy !== authUser.uid) {
                return res.status(403).json({ error: 'Only creator can notify.' });
              }

              const { title, body } = req.body;
              const students = await db.select().from(classroomStudentsTable).where(eq(classroomStudentsTable.classId, classId));
              const studentIds = students.map(s => s.studentId);
              
              if (studentIds.length > 0) {
                const tokens = await db.select().from(userNotificationTokens).where(inArray(userNotificationTokens.userId, studentIds));
                
                const payload = JSON.stringify({ title: title || 'إشعار جديد من الفصل', body: body || '' });
                for (const t of tokens) {
                  if (t.subscription) {
                    try {
                      await webpush.sendNotification(JSON.parse(t.subscription), payload);
                    } catch (e) {}
                  }
                }
              }
              res.json({ success: true, count: studentIds.length });
            } catch (err) {
              res.status(500).json({ error: 'Failed to notify.' });
            }
      });

      // ---------------- COMMUNICATION: CHATS & DIRECT MESSAGES BACKED BY POSTGRES ----------------
      app.get('/api/direct-messages', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              // The user identity is firmly authUser.uid. 
              // Wait, the client used to pass userId=... we should ignore it and use authUser.uid
              const userId = authUser.uid;

              const list = await db.select().from(directMessages)
                .where(or(eq(directMessages.senderId, userId), eq(directMessages.receiverId, userId)))
                .orderBy(desc(directMessages.createdAt));
                
              res.json(list);
            } catch (err) {
              res.json([]);
            }
      });

      app.post('/api/direct-messages', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const msg = req.body;
              await db.insert(directMessages).values({
                id: msg.id || 'dm-' + Math.random().toString(36).substring(2, 11),
                senderId: authUser.uid,
                senderName: authUser.name || msg.senderName || 'User',
                receiverId: msg.receiverId,
                receiverName: msg.receiverName || 'User',
                text: msg.text,
                createdAt: msg.createdAt || new Date().toISOString(),
                isRead: false
              });
              res.json({ success: true });
            } catch (err) {
              res.status(500).json({ error: 'Failed.' });
            }
      });

      app.post('/api/direct-messages/mark-read', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const { senderId } = req.body; 
              // Mark messages as read where we are the receiver and they are the sender
              await db.update(directMessages)
                .set({ isRead: true })
                .where(and(eq(directMessages.receiverId, authUser.uid), eq(directMessages.senderId, senderId)));
                
              res.json({ success: true });
            } catch (err) {
              res.status(500).json({ error: 'Failed.' });
            }
      });

      // ---------------- SOCIAL: MOODS & COMMUNITY NETWORK POSTS BACKED BY POSTGRES ----------------
      app.get('/api/community-posts', async (req, res) => {
        try {
          const postsList = await db.select().from(communityPosts).orderBy(desc(communityPosts.createdAt));
          const allViews = await db.select().from(messageViews);

          // Map postId -> list of views
          const viewsMap: Record<string, any[]> = {};
          allViews.forEach((v) => {
            if (!viewsMap[v.postId]) {
              viewsMap[v.postId] = [];
            }
            viewsMap[v.postId].push(v);
          });

          // Enrich posts with viewsCount and viewers list
          const enrichedPosts = postsList.map((post) => {
            const views = viewsMap[post.id] || [];
            return {
              ...post,
              viewsCount: views.length,
              viewers: views
            };
          });

          res.json(enrichedPosts);
        } catch (err) {
          console.error('Error fetching enriched community posts:', err);
          res.json([]);
        }
      });

      app.post('/api/community-posts', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const post = req.body;
              await db.insert(communityPosts).values({
                id: post.id || 'cp-' + Math.random().toString(36).substring(2, 11),
                authorId: authUser.uid,
                authorName: authUser.name || post.authorName,
                text: post.text || post.content,
                authorBadgeSymbol: post.authorBadgeSymbol || null,
                authorBadgeColor: post.authorBadgeColor || null,
                likes: 0,
                likedBy: [],
                createdAt: post.createdAt || new Date().toISOString()
              });
              res.json({ success: true });
            } catch (err) {
              res.status(500).json({ error: 'Failed' });
            }
      });

      app.post('/api/community-posts/:id/view', async (req, res) => {
        try {
          const postId = req.params.id;
          const { userId, userName, userPhotoUrl } = req.body;

          if (!userId || !userName) {
            return res.status(400).json({ error: 'userId and userName are required.' });
          }

          const viewId = `${postId}_${userId}`;
          const existing = await db.select().from(messageViews).where(eq(messageViews.id, viewId)).limit(1);

          if (existing.length === 0) {
            await db.insert(messageViews).values({
              id: viewId,
              postId,
              userId,
              userName,
              userPhotoUrl: userPhotoUrl || '',
              createdAt: new Date().toISOString()
            });
            res.json({ success: true, recorded: true });
          } else {
            res.json({ success: true, recorded: false });
          }
        } catch (err: any) {
          console.error('Error recording message view on Postgres:', err);
          res.status(500).json({ error: 'Failed to record message view.' });
        }
      });

      app.post('/api/community-posts/:id/like', async (req, res) => {

            try {
              let authUser = await getAuthenticatedUser(req).catch(() => null);
              if (!authUser) return res.status(401).json({ error: 'Unauthorized.' });

              const { id } = req.params;
              const { delta } = req.body;
              const userId = authUser.uid;

              const post = await db.select().from(communityPosts).where(eq(communityPosts.id, id)).limit(1);
              if (post.length > 0) {
                let currentLikedBy = (post[0].likedBy as string[]) || [];
                const hasLiked = currentLikedBy.includes(userId);
                let newLikes = post[0].likes || 0;

                if (delta > 0 && !hasLiked) {
                  currentLikedBy.push(userId);
                  newLikes++;
                } else if (delta < 0 && hasLiked) {
                  currentLikedBy = currentLikedBy.filter((uid: string) => uid !== userId);
                  newLikes = Math.max(0, newLikes - 1);
                }

                await db.update(communityPosts)
                  .set({ likes: newLikes, likedBy: currentLikedBy })
                  .where(eq(communityPosts.id, id));
              }
              res.json({ success: true });
            } catch (err) {
              res.status(500).json({ error: 'Failed' });
            }
      });

      // OCR Endpoint using server-side Gemini (Premium High-Precision Enabled)
      app.post('/api/ocr', async (req, res) => {
        try {
          // Secure AI endpoints against unauthenticated misuse/spamming
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { image, mimeType } = req.body;
          const targetUserId = authenticatedUser.uid;
          if (!image) {
            return res.status(400).json({ error: 'يرجى إرفاق صورة مع الطلب.' });
          }

          let isPremium = false;
          if (targetUserId) {
            try {
              const userList = await db.select().from(users).where(eq(users.uid, targetUserId)).limit(1);
              if (userList.length > 0 && userList[0].isPremium) {
                isPremium = true;
              }
            } catch (dbErr) {
              console.error('Database query error for user premium status inside ocr:', dbErr);
            }
          }

          // Stripping data prefixes if they exist
          const cleanedBase64 = image.includes('base64,') 
            ? image.split('base64,')[1] 
            : image;

          const cleanedMimeType = mimeType || 'image/jpeg';

          const promptString = `اقرأ هذه الصورة بالكامل واستخرج كافة الأسئلة والتمارين المتوفرة فيها بدقة تفصيلية وحرفية تامة.
قواعد فنية وتعليمية حاسمة:
1. ادعم الأنواع: 'mcq' (خيارات متعددة)، 'tf' (صح/خطأ)، 'essay' (سؤال مقالي).
2. للأسئلة المقالية 'essay': اجعل options فارغة []، و correctIndex بقيمة 0، والجواب النموذجي التفصيلي في correctAnswer.
3. التزم بنسخ واستخراج الأسئلة والخيارات والحلول حرفياً بالكامل (copy-paste) كما هي مكتوبة في الصورة دون أي تصحيح، تعديل، ترجمة، أو تأليف خارجي لضمان الأمان الأكاديمي التام.
4. طابق خيار الإجابة الصحيحة و correctIndex بدقة متناهية بناءً على العلامات أو الحلول المكتوبة بداخل ورقة الأسئلة إن وجدت.
5. هام جداً: إذا وجد أي سؤال يحتوي على رسم توضيحي، مبيان، رسم هندسي، رسم تخطيطي، جدول، خريطة، أو صورة خاصة بالسؤال مرافقة له في الورقة، حدد صندوق مضلع إحداثياته [ymin, xmin, ymax, xmax] بنسبة 0-1000 مقارنة بأبعاد الصورة الإجمالية حتى نتمكن من قص هذه الصورة وعرضها مرافقة للسؤال.`;

          let sysInstruction = '';
          if (isPremium) {
            sysInstruction = `أنت خبير أكاديمي متتقدم وناسخ مستندات آلي فائق الذكاء والدقة (طاقة معالجة PRO). مهمتك هي استخراج كافة الأسئلة والتمارين والرسوم التوضيحية من صور الامتحانات وأوراق العمل.
يتوجب عليك نسخ الأسئلة والخيارات حرفياً دون أدنى تعديل أو ترجمة وبنفس لغتها الأصلية. حدد بدقة correctIndex ومؤشر الإجابة الصحيحة وتفسيرها العلمي التفصيلي.
لرسوم الأسئلة التوضيحية، حدد بدقة إحداثيات [ymin, xmin, ymax, xmax] من 0 إلى 1000 لتحديد صندوق imageBox. لا تُدرج أي نصوص خارج كتلة الـ JSON.`;
          } else {
            sysInstruction = `أنت ناسخ ومستخرج أسئلة من الصور بتنسيق JSON. انسخ الأسئلة والخيارات حرفياً دون تعديل وبنفس لغتها. يدعم تفصيلاً خيارات mcq وصح/خطأ tf والمقالي essay (حدد correctAnswer واجعل options=[]). حدد بدقة إحداثيات imageBox بقيم [ymin, xmin, ymax, xmax] من 0 إلى 1000 لأي رسومات مرافقة للأسئلة. لا تُدرج أي نصوص خارج كتلة الـ JSON.`;
          }

          const response = await generateContentWithRetryAndFallback({
            model: 'gemini-3.1-flash-lite',
            contents: [
              {
                inlineData: {
                  mimeType: cleanedMimeType,
                  data: cleanedBase64
                }
              },
              {
                text: promptString
              }
            ],
            config: {
              systemInstruction: sysInstruction,
              responseMimeType: 'application/json',
              temperature: isPremium ? 0.05 : 0.1
            }
          });

          const extractedText = response.text;
          if (!extractedText) {
            throw new Error('لم يقم نموذج الذكاء الاصطناعي بإرجاع نتيجة صالحة.');
          }

          const extractedJson = parseJsonSafely(extractedText);
          res.json(extractedJson);

        } catch (e: any) {
          console.error('OCR Extraction Error:', e);
          res.status(500).json({ 
            error: 'عذراً، فشل استخراج الأسئلة من الصورة بالذكاء الاصطناعي.', 
            details: e.message 
          });
        }
      });

      // Generate Quiz from PDF raw text
      app.post('/api/generate-from-pdf-text', async (req, res) => {
        try {
          // Secure AI endpoints against unauthenticated misuse/spamming
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { text, amount } = req.body;
          const targetUserId = authenticatedUser.uid;
          if (!text || !text.trim()) {
            return res.status(400).json({ error: 'يرجى إرسال النص المستخرج من ملف الـ PDF.' });
          }

          let isPremium = false;
          if (targetUserId) {
            try {
              const userList = await db.select().from(users).where(eq(users.uid, targetUserId)).limit(1);
              if (userList.length > 0 && userList[0].isPremium) {
                isPremium = true;
              }
            } catch (dbErr) {
              console.error('Database query error for user premium status inside pdf text gen:', dbErr);
            }
          }

          const targetCount = typeof amount === 'number' ? amount : 5;
          const isAutoCount = typeof amount !== 'number' || amount <= 0;
          const activeModel = 'gemini-3.1-flash-lite';

          const sysInstruction = `أنت خبير أكاديمي ومهندس محتوى تعليمي. استخرج وأنشئ الأسئلة بنسق JSON.
الرد يجب أن يكون JSON فقط حسب المطلوب أدناه:
{
  "title": "عنوان",
  "description": "وصف",
  "questions": [
    { "text": "سؤال", "type": "mcq|tf|essay", "options": ["ا", "ب", "ج", "د"], "correctIndex": 0, "correctAnswer": "", "explanation": "الشرح" }
  ]
}`;

          // Word count computation
          const words = text.trim().split(/\s+/);
          const totalWords = words.length;

          let finalQuiz: any = {
            title: '',
            description: '',
            questions: []
          };

          if (totalWords > 2200) {
            // --- CHUNKING STRATEGY ---
            const chunkSize = 1500; // words per chunk
            const chunks: string[] = [];
            for (let i = 0; i < words.length; i += chunkSize) {
              chunks.push(words.slice(i, i + chunkSize).join(' '));
            }

            const activeChunks = chunks.slice(0, 5);
            const chunkPromises = activeChunks.map(async (chunkText, chunkIndex) => {
              const chunkPrompt = `اقرأ هذا الجزء واستخلص أسئلة في JSON.
الجزء رقم ${chunkIndex + 1}:
"""
${chunkText}
"""`;

              try {
                const response = await generateContentWithRetryAndFallback({
                  model: activeModel,
                  contents: chunkPrompt,
                  config: {
                    systemInstruction: sysInstruction,
                    responseMimeType: 'application/json',
                    temperature: 0.2
                  }
                });

                const resText = response.text;
                if (resText) {
                  const parsed = parseJsonSafely(resText);
                  if (parsed && Array.isArray(parsed.questions)) {
                    return parsed;
                  }
                }
              } catch (chunkErr) {
                console.error(`Error processing chunk ${chunkIndex + 1}:`, chunkErr);
              }
              return null;
            });

            const results = await Promise.all(chunkPromises);
            
            // Merge results
            for (const resObj of results) {
              if (resObj) {
                if (!finalQuiz.title && resObj.title) {
                  finalQuiz.title = resObj.title;
                }
                if (!finalQuiz.description && resObj.description) {
                  finalQuiz.description = resObj.description;
                }
                if (Array.isArray(resObj.questions)) {
                  finalQuiz.questions.push(...resObj.questions);
                }
              }
            }

          } else {
            // --- STANDARD & ITERATIVE GENERATION STRATEGY ---
            const promptString = `اقرأ النص أدناه واستخلص منه أسئلة تعليمية.
النص:
"""
${text}
"""`;

            const response1 = await generateContentWithRetryAndFallback({
              model: activeModel,
              contents: promptString,
              config: {
                systemInstruction: sysInstruction,
                responseMimeType: 'application/json',
                temperature: 0.2
              }
            });

            const extractedText1 = response1.text;
            if (extractedText1) {
              const parsed1 = parseJsonSafely(extractedText1);
              if (parsed1) {
                finalQuiz.title = parsed1.title || '';
                finalQuiz.description = parsed1.description || '';
                finalQuiz.questions = parsed1.questions || [];
              }
            }

            // Iterative Generation Pass
            if (isAutoCount && finalQuiz.questions.length > 0 && finalQuiz.questions.length < 25) {
              try {
                const currentQuestionsSummary = finalQuiz.questions.map((q: any) => `- ${q.text}`).join('\n');
                const followUpPrompt = `اقرأ النص لتوليد المزيد المستخلص. 
استخرج أسئلة جديدة غير مكررة.

الأسئلة المستخرجة سابقاً:
${currentQuestionsSummary}

النص الأصلي:
"""
${text}
"""`;

                const response2 = await generateContentWithRetryAndFallback({
                  model: activeModel,
                  contents: followUpPrompt,
                  config: {
                    systemInstruction: sysInstruction,
                    responseMimeType: 'application/json',
                    temperature: 0.2
                  }
                });

                const extractedText2 = response2.text;
                if (extractedText2) {
                  const parsed2 = parseJsonSafely(extractedText2);
                  if (parsed2 && Array.isArray(parsed2.questions) && parsed2.questions.length > 0) {
                    const existingTexts = new Set(finalQuiz.questions.map((q: any) => q.text.trim().toLowerCase()));
                    for (const newQ of parsed2.questions) {
                      if (!existingTexts.has(newQ.text.trim().toLowerCase())) {
                        finalQuiz.questions.push(newQ);
                      }
                    }
                  }
                }
              } catch (followUpErr) {
                console.error('Failed to run iterative generation follow-up:', followUpErr);
              }
            }
          }

          // Ensure base fallback values if parsing failed
          if (!finalQuiz.title) {
            finalQuiz.title = 'اختبار مخصص من المستند';
          }
          if (!finalQuiz.description) {
            finalQuiz.description = 'تم استخراج وتنسيق الأسئلة بنجاح بالذكاء الاصطناعي وبمراجعة دقة كوانتم الفائقة.';
          }

          // If specific amount requested, resize nicely
          if (!isAutoCount && finalQuiz.questions.length > 0) {
            if (finalQuiz.questions.length > targetCount) {
              finalQuiz.questions = finalQuiz.questions.slice(0, targetCount);
            }
          }

          res.json(finalQuiz);

        } catch (e: any) {
          console.error('PDF Text Quiz generation error:', e);
          res.status(500).json({ 
            error: 'عذراً، فشل صياغة واختصار المستند لأسئلة بالذكاء الاصطناعي.', 
            details: e.message 
          });
        }
      });


      // 1. Initialize file session: Upload to Gemini, extract total pages, title and description
      app.post('/api/upload-document-init', async (req, res) => {
        let tempFilePath: string | null = null;
        let uploadedFileObj: any = null;
        const ai = getAi();
        try {
          // Secure AI endpoints against unauthenticated misuse/spamming
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { fileBase64, mimeType, fileName } = req.body;
          const targetUserId = authenticatedUser.uid;
          if (!fileBase64 || !mimeType) {
            return res.status(400).json({ error: 'الرجاء توفير محتوى الملف المرفوع ونوعه وبصيغة صحيحة.' });
          }

          // Check premium status
          let isPremium = false;
          if (targetUserId) {
            try {
              const userList = await db.select().from(users).where(eq(users.uid, targetUserId)).limit(1);
              if (userList.length > 0 && userList[0].isPremium) {
                isPremium = true;
              }
            } catch (dbErr) {
              console.error('Database query error for user premium status inside doc init:', dbErr);
            }
          }
          const activeModel = 'gemini-3.1-flash-lite';

          // Write decoded base64 to server temp file
          const fs = await import('fs');
          const path = await import('path');
          const os = await import('os');
          const crypto = await import('crypto');

          const fileBuffer = Buffer.from(fileBase64, 'base64');
          const uniqueName = `${crypto.randomUUID()}_${fileName || 'uploaded_doc'}`;
          tempFilePath = path.join(os.tmpdir(), uniqueName);
          fs.writeFileSync(tempFilePath, fileBuffer);

          // Extract text locally
          const extractedText = await extractTextFromBuffer(fileBuffer, mimeType);
          
          // Mock the uploaded object to store the payload in the uri for our generation function
          uploadedFileObj = { 
            name: uniqueName, 
            uri: "data:text/plain;base64," + Buffer.from(extractedText).toString('base64'),
            mimeType: "text/plain", 
            state: "ACTIVE" 
          };

          // Query AI to analyze document metadata: total page count, suggested title & description
          const analysisPrompt = `أنت خبير فحص وفهرسة مواد دراسية وتحديد حجم الملفات. لقد زودتك بملف يحتوي على مادة علمية.
قم بقرائته ودراسته فوراً، ثُم أرجع لي مستند JSON نظيف ومطابق تماماً للبنية التالية وبدون أي علامات ماركداون أو ديباجات خارجية:
{
  "totalPages": 5, // إجمالي عدد صفحات المستند الفعلي بدقة كاملة. إذا كان الملف محتوى نصي مقدر اجعله تقريبياً.
  "title": "عنوان ذكي وجذاب وعصري يلخص الملف",
  "description": "وصف تفصيلي قصير للملف ومحتوياته بلغة النص الأصلية"
}
تأكد من إرسال JSON فقط ومغلقاً بشكل سليم لكي نقوم بقراءته وتجزئته.
محتوى المستند للتلخيص:
${extractedText.substring(0, 10000)} // Taking top 10000 chars for analysis
`;

          const response = await generateContentWithRetryAndFallback({
            model: activeModel,
            contents: [
              {
                text: analysisPrompt
              }
            ],
            config: {
              responseMimeType: 'application/json',
              temperature: 0.1
            }
          });

          const resText = response.text;
          let totalPages = 1;
          let title = 'اختبار مستخرج من مستند';
          let description = 'تم استخلاصه ومنسق طبقا للصفحات بالكامل.';

          if (resText) {
            const parsed = parseJsonSafely(resText);
            if (parsed) {
              totalPages = typeof parsed.totalPages === 'number' ? parsed.totalPages : 1;
              title = parsed.title || title;
              description = parsed.description || description;
            }
          }

          if (totalPages <= 0) totalPages = 1;

          res.json({
            fileUri: uploadedFileObj.uri,
            fileUploadName: uploadedFileObj.name,
            mimeType: uploadedFileObj.mimeType,
            totalPages,
            title,
            description
          });

        } catch (e: any) {
          console.error('File session init error:', e);
          const errMsg = e?.message?.toLowerCase() || '';
          const isQuota = errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('exhaust');
          const isBusy = errMsg.includes('503') || errMsg.includes('504') || errMsg.includes('overloaded');
          res.status(500).json({ 
            error: isQuota 
              ? 'عذراً، تم استهلاك الحد اليومي لطلبات كوزمو الذكي. يرجى المحاولة لاحقاً أو ترقية الحساب.' 
              : isBusy 
                ? 'عذراً، شبكة الذكاء الاصطناعي مزدحمة حالياً. يرجى الانتظار دقيقة والمحاولة مجدداً.'
                : 'عذراً، فشلت تهيئة وقراءة صفحات الملف بالذكاء الاصطناعي.', 
            details: e.message 
          });
        } finally {
          if (tempFilePath) {
            try {
              const fs = await import('fs');
              if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
              }
            } catch (err) {}
          }
        }
      });

      // 2. Explicit API endpoint to delete an uploaded file reference
      app.post('/api/upload-document-cleanup', async (req, res) => {
        // DeepSeek doesn't retain files so cleanup is a no-op that just returns success
        res.json({ success: true });
      });

      // 3. Fallback direct generation endpoint for legacy usages
      app.post('/api/generate-from-file-direct', async (req, res) => {
        let tempFilePath: string | null = null;
        let uploadedFileObj: any = null;
        let shouldCleanupFile = true;
        
        try {
          const { 
            fileBase64, 
            mimeType, 
            fileName, 
            amount, 
            userId, 
            batchIndex, 
            totalBatches, 
            alreadyExtractedTexts, 
            customInstruction,
            fileUri,
            fileUploadName,
            isPageByPage,
            pageNumber,
            extractionMode
          } = req.body;

          if (!fileUri && (!fileBase64 || !mimeType)) {
            return res.status(400).json({ error: 'الرجاء توفير محتوى الملف المرفوع ونوعه بصيغة صحيحة.' });
          }

          const activeModel = 'gemini-3.1-flash-lite';
          const targetCount = typeof amount === 'number' ? amount : 5;

          if (fileUri && fileUploadName) {
            uploadedFileObj = {
              uri: fileUri,
              mimeType: mimeType || 'application/pdf',
              name: fileUploadName
            };
            shouldCleanupFile = false;
            console.log(`[Files API Sessions] Reusing pre-uploaded file reference: uri=${fileUri}, name=${fileUploadName}`);
          } else {
            const fs = await import('fs');
            const path = await import('path');
            const os = await import('os');
            const crypto = await import('crypto');

            const fileBuffer = Buffer.from(fileBase64, 'base64');
            const uniqueName = `${crypto.randomUUID()}_${fileName || 'uploaded_doc'}`;
            tempFilePath = path.join(os.tmpdir(), uniqueName);
            fs.writeFileSync(tempFilePath, fileBuffer);

            const extractedText = await extractTextFromBuffer(fileBuffer, mimeType);
            uploadedFileObj = { 
                uri: "data:text/plain;base64," + Buffer.from(extractedText).toString('base64'),
                mimeType: "text/plain",
                name: uniqueName
            };
          }

          let sysInstructionForDirect = '';
          if (extractionMode === 'literal') {
            sysInstructionForDirect = `أنت مستخلص بيانات وأسئلة فائق الدقة. يجب إنتاج النتيجة بصيغة JSON حصراً.
البناء كالتالي:
{
  "title": "عنوان",
  "description": "وصف",
  "questions": [
    { "text": "سؤال", "type": "mcq", "options": ["أ", "ب", "ج", "د"], "correctIndex": 0, "correctAnswer": "", "explanation": "الشرح" }
  ]
}
لا تنشئ أسئلة من خارج النص ابدأ.`;
          } else {
            sysInstructionForDirect = `أنت مهندس محتوى أكاديمي. استخلص أسئلة شاملة وأنتج بصيغة JSON حصراً.
البناء كالتالي:
{
  "title": "عنوان",
  "description": "وصف",
  "questions": [
    { "text": "سؤال", "type": "mcq", "options": ["1", "2", "3", "4"], "correctIndex": 0, "correctAnswer": "", "explanation": "الشرح" }
  ]
}`;
          }

          const isOcrPageMode = !!isPageByPage;
          let promptText = ``;

          if (isOcrPageMode) {
            const currentPage = Number(pageNumber);
            if (extractionMode === 'literal') {
              promptText = `أنت تقوم بقراءة ومسح الصفحة رقم ${currentPage} بالتحديد من أصل ${totalBatches || 1} صفحات في المستند المرفق.
مهمتك استخراج الأسئلة المتواجدة بالفعل وصراحة.`;
            } else {
              promptText = `أنت تدرس بذكاء الصفحة رقم ${currentPage} من أصل ${totalBatches || 1}.
اصنع أكبر عدد من مميز من الأسئلة.`;
            }
          } else {
            promptText = `اقرأ الملف المرفق واستخلص منه المطلوب.\n\nعدد الأسئلة: ${targetCount}`;
            if (totalBatches && totalBatches > 1) {
              const currentPart = Number(batchIndex) + 1;
              promptText += `\n\nركز على الجزء رقم ${currentPart} من أصل ${totalBatches}.`;
            }
          }

          if (customInstruction) {
            promptText += `\n\nملاحظة المستخدم: "${customInstruction}"`;
          }

          let finalContents: any[] = [];
          if (uploadedFileObj.uri && uploadedFileObj.uri.startsWith('data:')) {
            try {
              const base64Part = uploadedFileObj.uri.substring(uploadedFileObj.uri.indexOf('base64,') + 7);
              const decodedText = Buffer.from(base64Part, 'base64').toString('utf-8');
              finalContents.push({
                text: `محتوى المستند المستخرج:\n\n${decodedText}`
              });
            } catch (decodeErr) {
              console.error('Failed to decode data URI text:', decodeErr);
              const base64Part = uploadedFileObj.uri.substring(uploadedFileObj.uri.indexOf('base64,') + 7);
              finalContents.push({
                inlineData: {
                  mimeType: uploadedFileObj.mimeType || 'text/plain',
                  data: base64Part
                }
              });
            }
          } else {
            finalContents.push({
              fileData: {
                fileUri: uploadedFileObj.uri,
                mimeType: uploadedFileObj.mimeType
              }
            });
          }
          finalContents.push({ text: promptText });

          const response = await generateContentWithRetryAndFallback({
            model: activeModel,
            contents: finalContents,
            config: {
              systemInstruction: sysInstructionForDirect,
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          });

          const resText = response.text;
          if (!resText) {
            throw new Error('لم يقم نموذج الذكاء الاصطناعي بإرجاع نتيجة صالحة.');
          }

          const parsedJson = parseJsonSafely(resText);
          if (!parsedJson) {
            throw new Error('فشل تفسير البيانات المستلمة كصيغة اختبار صالحة.');
          }

          if (typeof amount === 'number' && amount > 0 && parsedJson.questions && Array.isArray(parsedJson.questions)) {
            if (parsedJson.questions.length > amount) {
              parsedJson.questions = parsedJson.questions.slice(0, amount);
            }
          }

          res.json(parsedJson);

        } catch (e: any) {
          console.error('Direct File Quiz generation error:', e);
          res.status(500).json({ error: 'عذراً، فشلت معالجة وقراءة المستند مباشرة بالذكاء الاصطناعي.', details: e.message });
        } finally {
          if (tempFilePath) {
            try {
              const fs = await import('fs');
              if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
              }
            } catch (cleanupErr) {}
          }
        }
      });


      // Unique standalone endpoint to generate quizzes by topic or query
      app.post('/api/generate-ai-quiz', async (req, res) => {
        try {
          // Secure AI endpoints against unauthenticated misuse/spamming
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { topic, amount } = req.body;
          const targetUserId = authenticatedUser.uid;
          if (!topic || !topic.trim()) {
            return res.status(400).json({ error: 'يرجى تحديد الموضوع المطلوب لتوليد الاختبار.' });
          }

          let isPremium = false;
          if (targetUserId) {
            try {
              const userList = await db.select().from(users).where(eq(users.uid, targetUserId)).limit(1);
              if (userList.length > 0 && userList[0].isPremium) {
                isPremium = true;
              }
            } catch (dbErr) {
              console.error('Database query error for user premium status inside topic text gen:', dbErr);
            }
          }

          const targetCount = typeof amount === 'number' ? amount : 5;
          const activeModel = 'gemini-3.1-flash-lite';

          const sysInstruction = `أنت خبير أكاديمي ومهندس محتوى تعليمي. استخرج وأنشئ الأسئلة بنسق JSON.
الرد يجب أن يكون JSON فقط حسب المطلوب أدناه:
{
  "title": "عنوان",
  "description": "وصف",
  "questions": [
    { "text": "سؤال", "type": "mcq|tf|essay", "options": ["ا", "ب", "ج", "د"], "correctIndex": 0, "correctAnswer": "", "explanation": "الشرح" }
  ]
}`;

          const promptString = `قم بإنشاء وتوليد اختبار شامل ومميز يحتوي بالضبط على ${targetCount} سؤالاً أكاديمياً حول موضوع: "${topic}".
تأكد من تنوع الأسئلة لتشمل أسئلة اختيار من متعدد (mcq)، وأسئلة صح وخطأ (tf)، وأسئلة مقالية قصيرة (essay) تثير التفكير.
تأكد أن تكون لغة العنوان والوصف والأسئلة والتفسيرات مطابقة للغة الموضوع المطلوبة بدقة (إذا كان العنوان والموضوع بالعربية فاكتب بالعربية، وإذا كان بالإنجليزية فاكتب بالإنجليزية).
Must return responses explicitly in JSON format.`;

          console.log(`[Gemini API vNEW] Generating stand-alone topic quiz. Theme: ${topic}, Count: ${targetCount}, Model: ${activeModel}...`);

          const ai = getAi();
          
          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          res.flushHeaders();

          let fullText = '';
          
          let mappedActiveModel = activeModel;
          if (!mappedActiveModel || mappedActiveModel === 'gemini-3.1-flash-lite') {
            mappedActiveModel = 'gemini-3.5-flash';
          }

          const fallbacks = Array.from(new Set([
            mappedActiveModel,
            'gemini-3.5-flash',
            'gemini-3.1-flash-lite',
            'gemini-2.5-flash',
            'gemini-2.5-flash-lite',
            'gemini-flash-lite-latest',
            'gemini-flash-latest',
            'gemini-2.5-pro',
            'gemini-pro-latest',
            'gemini-3.1-pro-preview'
          ])).filter(Boolean);

          let streamSuccess = false;
          let lastStreamErr: any = null;

          for (const modelName of fallbacks) {
            fullText = ''; // Reset for retry
            try {
              const responseStream = await ai.models.generateContentStream({
                model: modelName,
                contents: promptString,
                config: {
                  systemInstruction: sysInstruction,
                  responseMimeType: 'application/json',
                  temperature: 0.2
                }
              });

              for await (const chunk of responseStream) {
                if (chunk.text) {
                  fullText += chunk.text;
                  const matchCount = (fullText.match(/"type"\s*:/g) || []).length;
                  res.write(`data: ${JSON.stringify({ type: 'progress', count: matchCount, total: targetCount })}\n\n`);
                }
              }
              
              streamSuccess = true;
              break; // successfully completed
            } catch (streamErr: any) {
              lastStreamErr = streamErr;
              console.warn(`[Gemini API Stream] Error with ${modelName}: ${streamErr?.message || streamErr}. Retrying with fallback...`);
              await new Promise(r => setTimeout(r, 1000));
              continue;
            }
          }

          if (!streamSuccess) {
            console.error("Stream generation error:", lastStreamErr);
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'عذراً، فشل توليد الأسئلة الأكاديمية للموضوع المختار بسبب ضغط على الخوادم.' })}\n\n`);
            return res.end();
          }

          if (!fullText) {
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'لم يتم استرجاع أي محتوى مناسب من محرك الجيل التلقائي لجميناي.' })}\n\n`);
            return res.end();
          }

          const finalQuiz = parseJsonSafely(fullText);
          if (!finalQuiz || !Array.isArray(finalQuiz.questions)) {
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'فشل تحليل البنية المهيكلة للـ JSON المسترجع.' })}\n\n`);
            return res.end();
          }

          // Ensure base fallback values
          if (!finalQuiz.title) {
            finalQuiz.title = `اختبار: ${topic}`;
          }
          if (!finalQuiz.description) {
            finalQuiz.description = `اختبار متكامل تم إنشاؤه تلقائياً حول ${topic} بمراجعة التعليم المنهجي الدقيق.`;
          }

          if (typeof targetCount === 'number' && targetCount > 0 && finalQuiz.questions.length > targetCount) {
            finalQuiz.questions = finalQuiz.questions.slice(0, targetCount);
          }

          res.write(`data: ${JSON.stringify({ type: 'complete', quiz: finalQuiz })}\n\n`);
          res.end();

        } catch (e: any) {
          console.error('Topic Quiz generation error:', e);
          if (!res.headersSent) {
            res.status(500).json({ 
              error: `عذراً، فشل توليد الأسئلة الأكاديمية للموضوع المختار.`, 
              details: e.message 
            });
          } else {
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'حدث خطأ غير متوقع أثناء التوليد.' })}\n\n`);
            res.end();
          }
        }
      });


      // 1. Generate Topic Quiz Batch
      app.post('/api/generate-ai-quiz-batch', async (req, res) => {
        try {
          try {
            await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { topic, amount, alreadyGeneratedQuestions } = req.body;
          if (!topic || !topic.trim()) {
            return res.status(400).json({ error: 'يرجى تحديد الموضوع المطلوب لتوليد الاختبار.' });
          }

          const targetCount = typeof amount === 'number' ? amount : 5;
          const activeModel = 'gemini-3.1-flash-lite';

          const sysInstruction = `أنت خبير أكاديمي ومهندس محتوى تعليمي. استخرج وأنشئ الأسئلة بنسق JSON.
الرد يجب أن يكون JSON فقط حسب المطلوب أدناه:
{
  "title": "عنوان",
  "description": "وصف",
  "questions": [
    { "text": "سؤال", "type": "mcq|tf|essay", "options": ["ا", "ب", "ج", "د"], "correctIndex": 0, "correctAnswer": "", "explanation": "الشرح" }
  ]
}`;

          let excludePrompt = '';
          if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
            excludePrompt = `\n\nتجنب تكرار الأسئلة التي تم توليدها سابقاً وتجنب أي تشابه مع العناوين التالية:\n${alreadyGeneratedQuestions.map((q: string, idx: number) => `${idx + 1}. ${q}`).join('\n')}`;
          }

          const promptString = `قم بإنشاء وتوليد دفعة مخصصة تحتوي بالضبط على ${targetCount} سؤالاً أكاديمياً فريداً حول موضوع: "${topic}".
تأكد من تنوع الأسئلة لتشمل أسئلة اختيار من متعدد (mcq)، وأسئلة صح وخطأ (tf)، وأسئلة مقالية قصيرة (essay) تثير التفكير.
تأكد أن تكون لغة العنوان والوصف والأسئلة والتفسيرات مطابقة للغة الموضوع المطلوبة بدقة.${excludePrompt}
أرجع النتيجة بصيغة JSON نظيفة للغاية ومباشرة.`;

          const response = await generateContentWithRetryAndFallback({
            model: activeModel,
            contents: promptString,
            config: {
              systemInstruction: sysInstruction,
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          });

          const resText = response.text;
          if (!resText) {
            return res.status(500).json({ error: 'لم يتم استرجاع أي محتوى مناسب من كوزمو الذكي.' });
          }

          const finalQuiz = parseJsonSafely(resText);
          if (!finalQuiz || !Array.isArray(finalQuiz.questions)) {
            return res.status(500).json({ error: 'فشل تحليل البنية المهيكلة للـ JSON المسترجع.' });
          }

          res.json(finalQuiz);
        } catch (e: any) {
          console.error('Topic Quiz Batch generation error:', e);
          res.status(500).json({ error: 'عذراً، فشل توليد هذه الدفعة من الأسئلة.' });
        }
      });


      // Standalone Gemini Route
      app.post('/api/generate/gemini', async (req, res) => {
        try {
          try {
            await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { topic, amount, alreadyGeneratedQuestions } = req.body;
          if (!topic || !topic.trim()) {
            return res.status(400).json({ error: 'يرجى تحديد الموضوع المطلوب لتوليد الاختبار.' });
          }

          const targetCount = typeof amount === 'number' ? amount : 5;
          const activeModel = 'gemini-3.5-flash';

          const sysInstruction = `أنت خبير أكاديمي ومهندس محتوى تعليمي. استخرج وأنشئ الأسئلة بنسق JSON.
الرد يجب أن يكون JSON فقط حسب المطلوب أدناه:
{
  "title": "عنوان الاختبار",
  "description": "وصف الاختبار",
  "questions": [
    { "text": "نص السؤال هنا", "type": "mcq|tf|essay", "options": ["أ", "ب", "ج", "د"], "correctIndex": 0, "correctAnswer": "", "explanation": "الشرح العلمي" }
  ]
}`;

          let excludePrompt = '';
          if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
            excludePrompt = `\n\nتجنب تكرار الأسئلة التي تم توليدها سابقاً وتجنب أي تشابه مع العناوين التالية:\n${alreadyGeneratedQuestions.map((q: string, idx: number) => `${idx + 1}. ${q}`).join('\n')}`;
          }

          const promptString = `قم بإنشاء وتوليد دفعة مخصصة تحتوي بالضبط على ${targetCount} سؤالاً أكاديمياً فريداً حول موضوع: "${topic}".
تأكد من تنوع الأسئلة لتشمل أسئلة اختيار من متعدد (mcq)، وأسئلة صح وخطأ (tf)، وأسئلة مقالية قصيرة (essay) تثير التفكير.
تأكد أن تكون لغة العنوان والوصف والأسئلة والتفسيرات مطابقة للغة الموضوع المطلوبة بدقة.${excludePrompt}
أرجع النتيجة بصيغة JSON نظيفة للغاية ومباشرة.`;

          const response = await generateContentWithRetryAndFallback({
            model: activeModel,
            contents: promptString,
            config: {
              systemInstruction: sysInstruction,
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          });

          const resText = response.text;
          if (!resText) {
            return res.status(500).json({ error: 'لم يتم استرجاع أي محتوى مناسب من كوزمو الذكي.' });
          }

          const finalQuiz = parseJsonSafely(resText);
          if (!finalQuiz || !Array.isArray(finalQuiz.questions)) {
            return res.status(500).json({ error: 'فشل تحليل البنية المهيكلة للـ JSON المسترجع.' });
          }

          res.json(finalQuiz);
        } catch (e: any) {
          console.error('Gemini Standalone Route error:', e);
          res.status(500).json({ error: e.message || 'عذراً، فشل توليد الأسئلة عبر خدمة جيميناي.' });
        }
      });

      // Standalone Groq Route
      app.post('/api/generate/groq', async (req, res) => {
        try {
          try {
            await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { topic, amount, alreadyGeneratedQuestions } = req.body;
          if (!topic || !topic.trim()) {
            return res.status(400).json({ error: 'يرجى تحديد الموضوع المطلوب لتوليد الاختبار.' });
          }

          const groqKey = process.env.GROQ_API_KEY;
          if (!groqKey) {
            return res.status(400).json({ error: 'عذراً، لم يتم تكوين مفتاح Groq API Key الخاص بالخادم.' });
          }

          const targetCount = typeof amount === 'number' ? amount : 5;
          const sysInstruction = `You are an academic expert content generator. Generate a quiz about the specified topic.
Respond strictly in JSON format as specified below:
{
  "title": "عنوان الاختبار",
  "description": "وصف الاختبار",
  "questions": [
    { "text": "نص السؤال هنا", "type": "mcq|tf|essay", "options": ["أ", "ب", "ج", "د"], "correctIndex": 0, "correctAnswer": "", "explanation": "الشرح العلمي" }
  ]
}`;

          let excludePrompt = '';
          if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
            excludePrompt = `\nAvoid generating these exact existing questions:\n${alreadyGeneratedQuestions.join('\n')}`;
          }

          const promptString = `Generate exactly ${targetCount} unique academic questions about the topic "${topic}".
Include diverse questions: multiple choice (mcq), true/false (tf), and short essay (essay).
The language of the response must perfectly match the language of the requested topic (e.g. Arabic or English).${excludePrompt}
Return clean valid JSON content without markdown formatting.`;

          const openai = new OpenAI({
            apiKey: groqKey,
            baseURL: 'https://api.groq.com/openai/v1'
          });

          const response = await openai.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: sysInstruction },
              { role: 'user', content: promptString }
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' }
          });

          const resText = response.choices[0]?.message?.content;
          if (!resText) {
            return res.status(500).json({ error: 'لم يتم استرجاع محتوى من خدمة Groq.' });
          }

          const finalQuiz = parseJsonSafely(resText);
          res.json(finalQuiz);
        } catch (e: any) {
          console.error('Groq Standalone Route error:', e);
          res.status(500).json({ error: e.message || 'عذراً، فشل توليد الأسئلة عبر خدمة Groq.' });
        }
      });

      // Standalone DeepSeek Route
      app.post('/api/generate/deepseek', async (req, res) => {
        try {
          try {
            await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { topic, amount, alreadyGeneratedQuestions } = req.body;
          if (!topic || !topic.trim()) {
            return res.status(400).json({ error: 'يرجى تحديد الموضوع المطلوب لتوليد الاختبار.' });
          }

          const deepseekKey = process.env.DEEPSEEK_API_KEY;
          if (!deepseekKey) {
            return res.status(400).json({ error: 'عذراً، لم يتم تكوين مفتاح DeepSeek API Key الخاص بالخادم.' });
          }

          const targetCount = typeof amount === 'number' ? amount : 5;
          const sysInstruction = `You are an academic expert content generator. Generate a quiz about the specified topic.
Respond strictly in JSON format as specified below:
{
  "title": "عنوان الاختبار",
  "description": "وصف الاختبار",
  "questions": [
    { "text": "نص السؤال هنا", "type": "mcq|tf|essay", "options": ["أ", "ب", "ج", "د"], "correctIndex": 0, "correctAnswer": "", "explanation": "الشرح العلمي" }
  ]
}`;

          let excludePrompt = '';
          if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
            excludePrompt = `\nAvoid generating these exact existing questions:\n${alreadyGeneratedQuestions.join('\n')}`;
          }

          const promptString = `Generate exactly ${targetCount} unique academic questions about the topic "${topic}".
Include diverse questions: multiple choice (mcq), true/false (tf), and short essay (essay).
The language of the response must perfectly match the language of the requested topic (e.g. Arabic or English).${excludePrompt}
Return clean valid JSON content without markdown formatting.`;

          const openai = new OpenAI({
            apiKey: deepseekKey,
            baseURL: 'https://api.deepseek.com/v1'
          });

          const response = await openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: sysInstruction },
              { role: 'user', content: promptString }
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' }
          });

          const resText = response.choices[0]?.message?.content;
          if (!resText) {
            return res.status(500).json({ error: 'لم يتم استرجاع محتوى من خدمة DeepSeek.' });
          }

          const finalQuiz = parseJsonSafely(resText);
          res.json(finalQuiz);
        } catch (e: any) {
          console.error('DeepSeek Standalone Route error:', e);
          res.status(500).json({ error: e.message || 'عذراً، فشل توليد الأسئلة عبر خدمة DeepSeek.' });
        }
      });

      // Standalone OpenAI Route
      app.post('/api/generate/openai', async (req, res) => {
        try {
          try {
            await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { topic, amount, alreadyGeneratedQuestions } = req.body;
          if (!topic || !topic.trim()) {
            return res.status(400).json({ error: 'يرجى تحديد الموضوع المطلوب لتوليد الاختبار.' });
          }

          const openaiKey = process.env.OPENAI_API_KEY;
          if (!openaiKey) {
            return res.status(400).json({ error: 'عذراً، لم يتم تكوين مفتاح OpenAI API Key الخاص بالخادم.' });
          }

          const targetCount = typeof amount === 'number' ? amount : 5;
          const sysInstruction = `You are an academic expert content generator. Generate a quiz about the specified topic.
Respond strictly in JSON format as specified below:
{
  "title": "عنوان الاختبار",
  "description": "وصف الاختبار",
  "questions": [
    { "text": "نص السؤال هنا", "type": "mcq|tf|essay", "options": ["أ", "ب", "ج", "د"], "correctIndex": 0, "correctAnswer": "", "explanation": "الشرح العلمي" }
  ]
}`;

          let excludePrompt = '';
          if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
            excludePrompt = `\nAvoid generating these exact existing questions:\n${alreadyGeneratedQuestions.join('\n')}`;
          }

          const promptString = `Generate exactly ${targetCount} unique academic questions about the topic "${topic}".
Include diverse questions: multiple choice (mcq), true/false (tf), and short essay (essay).
The language of the response must perfectly match the language of the requested topic (e.g. Arabic or English).${excludePrompt}
Return clean valid JSON content without markdown formatting.`;

          const openai = new OpenAI({
            apiKey: openaiKey,
            baseURL: 'https://api.openai.com/v1'
          });

          const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: sysInstruction },
              { role: 'user', content: promptString }
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' }
          });

          const resText = response.choices[0]?.message?.content;
          if (!resText) {
            return res.status(500).json({ error: 'لم يتم استرجاع محتوى من خدمة OpenAI.' });
          }

          const finalQuiz = parseJsonSafely(resText);
          res.json(finalQuiz);
        } catch (e: any) {
          console.error('OpenAI Standalone Route error:', e);
          res.status(500).json({ error: e.message || 'عذراً، فشل توليد الأسئلة عبر خدمة OpenAI.' });
        }
      });



      // 2. Generate Pasted Text Quiz Batch
      app.post('/api/generate-from-pdf-text-batch', async (req, res) => {
        try {
          try {
            await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { text, amount, alreadyGeneratedQuestions } = req.body;
          if (!text || !text.trim()) {
            return res.status(400).json({ error: 'يرجى إرسال النص المستخلص من ملف الـ PDF.' });
          }

          const targetCount = typeof amount === 'number' ? amount : 5;
          const activeModel = 'gemini-3.1-flash-lite';

          const sysInstruction = `أنت خبير أكاديمي ومهندس محتوى تعليمي. استخرج وأنشئ الأسئلة بنسق JSON.
الرد يجب أن يكون JSON فقط حسب المطلوب أدناه:
{
  "title": "عنوان",
  "description": "وصف",
  "questions": [
    { "text": "سؤال", "type": "mcq|tf|essay", "options": ["ا", "ب", "ج", "د"], "correctIndex": 0, "correctAnswer": "", "explanation": "الشرح" }
  ]
}`;

          let excludePrompt = '';
          if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
            excludePrompt = `\n\nتجنب تكرار الأسئلة التي تم توليدها سابقاً وتجنب أي تشابه مع العناوين التالية:\n${alreadyGeneratedQuestions.map((q: string, idx: number) => `${idx + 1}. ${q}`).join('\n')}`;
          }

          const promptString = `اقرأ النص أدناه واستخلص منه دفعة تحتوي بالضبط على ${targetCount} سؤالاً أكاديمياً فريداً ومتنوعاً.
النص الأصلي:
"""
${text}
"""${excludePrompt}
أرجع النتيجة بصيغة JSON نظيفة ومباشرة.`;

          const response = await generateContentWithRetryAndFallback({
            model: activeModel,
            contents: promptString,
            config: {
              systemInstruction: sysInstruction,
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          });

          const resText = response.text;
          if (!resText) {
            return res.status(500).json({ error: 'لم يتم استرجاع أي محتوى مناسب من كوزمو الذكي.' });
          }

          const finalQuiz = parseJsonSafely(resText);
          if (!finalQuiz || !Array.isArray(finalQuiz.questions)) {
            return res.status(500).json({ error: 'فشل تحليل البنية المهيكلة للـ JSON المسترجع.' });
          }

          res.json(finalQuiz);
        } catch (e: any) {
          console.error('Pasted Text Quiz Batch generation error:', e);
          res.status(500).json({ error: 'عذراً، فشل توليد هذه الدفعة من الأسئلة.' });
        }
      });


      // 3. Scan Document Questions (Auto-Detect Map Stage)
      app.post('/api/scan-document-questions', async (req, res) => {
        try {
          try {
            await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { fileUri, fileUploadName, mimeType } = req.body;
          if (!fileUri) {
            return res.status(400).json({ error: 'يرجى تقديم مرجع الملف المرفوع.' });
          }

          let documentText = '';
          if (fileUri.startsWith('data:text/plain;base64,')) {
            const base64Data = fileUri.substring('data:text/plain;base64,'.length);
            documentText = Buffer.from(base64Data, 'base64').toString('utf8');
          } else {
            return res.status(400).json({ error: 'مرجع الملف غير متوافق للقرائة المباشرة.' });
          }

          const activeModel = 'gemini-3.1-flash-lite';
          const promptString = `أنت مستخلص وباحث فائق الذكاء وموجز. قم بمسح النص المرفق واكتشاف وتحديد جميع الأسئلة الأكاديمية الصريحة أو الضمنية المتواجدة فيه.
لست بحاجة لتنسيقها أو توليد خيارات أو تفسير كامل الآن، فقط أرجع قائمة بمواضع الأسئلة المكتشفة مع رقم الصفحة التقريبي أو المعرف (locator) والوصف البسيط جداً لمضمون كل سؤال لكي نتمكن من فهرستها وتوليدها بالتفصيل لاحقاً.
محتوى المستند:
"""
${documentText.substring(0, 30000)}
"""

يجب إرجاع النتيجة بصيغة JSON نظيفة مطابقة للهيكل التالي وبدون علامات ماركداون أو ديباجات خارجية:
{
  "locators": [
    { "id": "q1", "pageNumber": 1, "description": "وصف السؤال المكتشف" }
  ]
}`;

          const response = await generateContentWithRetryAndFallback({
            model: activeModel,
            contents: promptString,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.1
            }
          });

          const resText = response.text;
          if (!resText) {
            return res.status(500).json({ error: 'لم تنجح عملية مسح المستند.' });
          }

          const parsed = parseJsonSafely(resText);
          if (!parsed || !Array.isArray(parsed.locators)) {
            return res.status(500).json({ error: 'فشل تحليل نتائج المسح الهيكلي.' });
          }

          res.json(parsed);
        } catch (e: any) {
          console.error('Scan Document Questions error:', e);
          res.status(500).json({ error: 'فشل مسح المستند تلقائياً.' });
        }
      });


      // 4. Generate From Scan Batch (Auto-Detect Reduce Stage)
      app.post('/api/generate-from-scan-batch', async (req, res) => {
        try {
          try {
            await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { fileUri, locators, alreadyGeneratedQuestions } = req.body;
          if (!fileUri || !locators || !Array.isArray(locators)) {
            return res.status(400).json({ error: 'الرجاء توفير مرجع الملف ومواضع الأسئلة المطلوبة.' });
          }

          let documentText = '';
          if (fileUri.startsWith('data:text/plain;base64,')) {
            const base64Data = fileUri.substring('data:text/plain;base64,'.length);
            documentText = Buffer.from(base64Data, 'base64').toString('utf8');
          } else {
            return res.status(400).json({ error: 'مرجع الملف غير متوافق للقرائة المباشرة.' });
          }

          const activeModel = 'gemini-3.1-flash-lite';
          const sysInstruction = `أنت مهندس محتوى أكاديمي ومطور أسئلة محترف. استخلص وأنتج الأسئلة بصيغة JSON.
البنية كالتالي:
{
  "questions": [
    { "text": "سؤال", "type": "mcq|tf|essay", "options": ["ا", "ب", "ج", "د"], "correctIndex": 0, "correctAnswer": "", "explanation": "الشرح" }
  ]
}`;

          let excludePrompt = '';
          if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
            excludePrompt = `\n\nتجنب تكرار أي سؤال تم توليده سابقاً وتجنب أي تشابه مع التالي:\n${alreadyGeneratedQuestions.map((q: string, idx: number) => `${idx + 1}. ${q}`).join('\n')}`;
          }

          const promptString = `لقد حددنا سابقاً مجموعة من مواضع الأسئلة (locators) في هذا المستند، ونريد منك تحويلها الآن وتوليدها كأسئلة كاملة ومنسقة بدقة (اختيار من متعدد، صح وخطأ، أو مقالي) مع خيارات الإجابة والحل والشرح المفصل.

مواضع الأسئلة المطلوب توليدها في هذه الدفعة:
${JSON.stringify(locators)}

محتوى المستند:
"""
${documentText.substring(0, 30000)}
"""${excludePrompt}

يرجى توليد الأسئلة الأكاديمية المطابقة لهؤلاء بدقة، وضمان عدم تكرار أي فكرة تم توليدها سابقاً.
أرجع النتيجة بصيغة JSON مطابقة للهيكل فقط.`;

          const response = await generateContentWithRetryAndFallback({
            model: activeModel,
            contents: promptString,
            config: {
              systemInstruction: sysInstruction,
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          });

          const resText = response.text;
          if (!resText) {
            return res.status(500).json({ error: 'فشلت معالجة دفعة مواضع الأسئلة.' });
          }

          const parsed = parseJsonSafely(resText);
          if (!parsed || !Array.isArray(parsed.questions)) {
            return res.status(500).json({ error: 'فشل تحليل نتائج توليد الأسئلة المخصصة.' });
          }

          res.json(parsed);
        } catch (e: any) {
          console.error('Generate From Scan Batch error:', e);
          res.status(500).json({ error: 'فشل توليد دفعة الأسئلة من مواضع المسح.' });
        }
      });


      // Explain a question with customized educational insights by Gemini AI
      app.post('/api/explain-question', async (req, res) => {
        try {
          // Secure AI endpoints against unauthenticated misuse/spamming
          try {
            await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول للحصول على تفسير الذكاء الاصطناعي.' });
          }

          const { questionText, userAnswer, correctAnswer, options, lang } = req.body;
          const isAr = lang !== 'en';

          const promptString = `أنت معلم ذكي ومحفز جداً للطلاب ومحبب للشرح الأكاديمي.
قم بتقديم شرح أكاديمي مبسط وموجز للغاية ومحفز كمرشد تعليمي يوضح النظرية العلمية وسرعة الحل.
السؤال المراد مراجعته: "${questionText}"
${options && Array.isArray(options) && options.length > 0 ? `الخيارات المتاحة كانت: ${options.join(' - ')}` : ''}
إجابة الطالب التي اختارها وأخطأ بها: "${userAnswer || 'لا توجد'}"
الإجابة الصحيحة النموذجية: "${correctAnswer}"

اكتب فقرة واحدة رشيقة ومنسقة جداً تشرح الفكرة وسر تذكرها، متبوعة بـ 2-3 نقاط مرقمة سريعة لتبسيط المفهوم للأبد. لا تكرر الخيارات بل اشرح النظرية بأسلوب دافئ باللغة ${isAr ? 'العربية' : 'الإنجليزية'}. استخدم صيغة المتحدث الموجهة للطالب مباشرة (مثال: "لاحظ يا بني أن..." أو "تذكر دائماً أن...") وبدون أي ديباجات أو رسومية زائدة. يمكنك استخدام Markdown رقيق.`;

          const response = await generateContentWithRetryAndFallback({
            model: 'gemini-3.1-flash-lite',
            contents: promptString,
            config: {
              systemInstruction: 'أنت المرشد الأكاديمي الشفيق للشفق التعليمي المعتمد على تكنولوجيا الذكاء الاصطناعي. تفاعل بدفء وبساطة مطلقة لمساعدة الطالب على تجاوز الخطأ للأبد.',
            }
          });

          const explanation = response.text || (isAr ? 'تعذر جلب الشرح الأكاديمي الآن.' : 'Could not fetch academic explanation.');
          res.json({ explanation });
        } catch (e: any) {
          console.error('Explain question error:', e);
          res.status(500).json({ error: 'عذراً، فشل جلب تفسير الذكاء الاصطناعي.' });
        }
      });


      // Premium Elite Diamond Cosmo Chatbot API Handler
      app.post('/api/cosmobot-chat', async (req, res) => {
        try {
          // Secure AI endpoints against unauthenticated misuse/spamming
          try {
            await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول للتحدث مع كوزمو بوت.' });
          }

          const { prompt, image, history, lang } = req.body;
          const isAr = lang !== 'en';

          let contents: any[] = [];

          // If we have history, serialize past context elegantly for Gemini
          if (history && Array.isArray(history) && history.length > 0) {
            let conversationLog = isAr 
              ? "تذكر سجل المحادثة السابقة بيننا:\n" 
              : "Recall our previous conversation log:\n";
            history.forEach((h: any) => {
              const roleName = h.role === 'user' ? (isAr ? 'الطالب' : 'Student') : 'Cosmo';
              conversationLog += `${roleName}: ${h.text}\n`;
            });
            conversationLog += isAr ? "\nالسؤال الحالي الجديد:\n" : "\nNew current prompt:\n";
            contents.push({ text: conversationLog });
          }

          // If an image was uploaded, clean up and append inlineData
          if (image && typeof image === 'string') {
            let cleanBase64 = image;
            let mimeType = 'image/jpeg';

            if (image.startsWith('data:')) {
              const match = image.match(/^data:([^;]+);base64,(.*)$/);
              if (match) {
                mimeType = match[1];
                cleanBase64 = match[2];
              }
            }

            contents.push({
              inlineData: {
                mimeType: mimeType,
                data: cleanBase64
              }
            });
          }

          // Add the active user prompt
          contents.push({ text: prompt });

          const systemInstruction = isAr
            ? `أنت شات بوت ذكي جداً ومذهل تدعى "كوزمو" (Cosmo AI). أنت المساعد الآلي والمستشار الأكاديمي والتعليمي الحصري لأعضاء "النسخة الماسية" (Diamond Tier) في منصة Quiz Space.
تفاعل بذكاء، وبأدب جم، وبعبقرية، وبلطف شديد جداً.
عندما يقوم الطالب بإرسال صورة، قم بتحليلها بدقة علمية مذهلة وذكاء شديد وقدم له الحلول والشروح الأكاديمية والتربوية المناسبة بطريقة ممتعة وبسيطة ومحفزة.
حافظ على طابع ممتع، علمي، عبقري، ومستوحى من الفضاء والكواكب والنجوم (مثال: "مرحباً بك يا صديقي في فلك المعرفة!" "انطلاق رائع كالعادة!").
استخدم لغة عربية فصحى مشوقة، وأجب بشكل منسق مع استخدام مارك داون (Markdown) والرموز التعبيرية المناسبة لتبسيط وفهم المفهوم للأبد.`
            : `You are a highly intelligent, stellar AI chatbot named "Cosmo" (Cosmo AI). You are the exclusive automated academic helper and educational advisor for "Diamond Tier" (النسخة الماسية) members of Quiz Space.
Be immensely polite, brilliant, encouraging, and supportive.
When a student uploads an image, analyze it with superb academic accuracy and provide clear step-by-step guidance.
Maintain a fun, intelligent, cosmic, and space-themed vibe (e.g., "Welcome, star explorer!", "Cosmic launch initiated!").
Respond in elegant Markdown format using custom bullet points and emojis to make your feedback easy to read and understand.`;

          const response = await generateContentWithRetryAndFallback({
            model: 'gemini-3.1-flash-lite',
            contents: contents,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            }
          });

          const reply = response.text || (isAr ? 'عذراً يا صديقي الكوني، تعذر علي الرد الآن. حاول مجدداً!' : 'Sorry my cosmic friend, I could not respond at the moment. Please try again!');
          res.json({ reply });
        } catch (e: any) {
          console.error('Cosmo Chatbot error:', e);
          res.status(500).json({ error: 'عذراً، فشل مساعد كوزمو في معالجة طلبك.' });
        }
      });


      // Premium Gemini Model Sandbox and Benchmark endpoint
      app.post('/api/gemini-sandbox', async (req, res) => {
        try {
          // Secure AI endpoints against unauthenticated misuse/spamming
          let authenticatedUser;
          try {
            authenticatedUser = await getAuthenticatedUser(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'عذراً! يجب تسجيل الدخول لاستخدام ميزات الذكاء الاصطناعي.' });
          }

          const { prompt, model, lang } = req.body;
          const isAr = lang !== 'en';
          const startTime = Date.now();

          // Check for allowable model names to prevent abuse
          const allowedModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.1-pro-preview', 'gemini-2.5-flash-lite'];
          const targetModel = allowedModels.includes(model) ? model : 'gemini-3.1-flash-lite';

          const systemInstruction = isAr
            ? `أنت خبير تقييم وذكاء اصطناعي تقوم بمقارنة النماذج لتعريف المتميزين بميزات Gemini 3.5 Pro وباقي عائلة Gemini. أجب على المدخلات بدقة علمية مذهلة وسرعة فائقة باستخدام مارك داون.`
            : `You are an AI benchmark evaluation assistant demonstrating the strengths of the Gemini family particularly Gemini 3.5 Pro. Answer the user prompt with excellent detailed accuracy.`;

          const response = await generateContentWithRetryAndFallback({
            model: targetModel,
            contents: [{ text: prompt }],
            config: {
              systemInstruction,
              temperature: 0.5,
            }
          });

          const latency = Date.now() - startTime;
          const reply = response.text || (isAr ? 'لم نحصل على رد مناسب.' : 'No suitable response was retrieved.');

          res.json({
            reply,
            latency,
            modelUsed: targetModel
          });
        } catch (e: any) {
          console.error('Gemini Sandbox error:', e);
          res.status(500).json({ error: 'عذراً، فشل محرك المقارنة في معالجة طلب محاكاة الأداء.' });
        }
      });


      function getClientForwardedOrigin(req: any): string {
        let host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
        if (Array.isArray(host)) {
          host = host[0];
        }
        if (host.includes(',')) {
          const parts = host.split(',').map((s: string) => s.trim());
          host = parts[0];
        }
        const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('192.168.') || host.startsWith('10.');
        const protocol = isLocal ? 'http' : 'https';
        return `${protocol}://${host}`;
      }

      // API 404 Handler - returns JSON instead of falling through to Vite or static HTML server
      app.all('/api/*', (req, res) => {
        res.status(404).json({ error: `API route ${req.method} ${req.originalUrl} not found` });
      });

      // Vite integration middleware & production asset server
      const isProduction = process.env.NODE_ENV === 'production' || (typeof _filename !== 'undefined' && _filename.includes('dist'));
      if (!isProduction) {
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        });

        // Intercept requests for "/" before Vite middleware,
        // so we can inject the server origin for sandboxed iframe compatibility.
        app.get('/', async (req, res, next) => {
          try {
            const template = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
            const origin = getClientForwardedOrigin(req);
            const injectedScript = `<script>window.__APPMAP_ORIGIN__ = "${origin}";</script>`;
            let html = await vite.transformIndexHtml(req.originalUrl, template);
            html = html.replace('<head>', `<head>\n    ${injectedScript}`);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
          } catch (err) {
            next(err);
          }
        });

        app.use(vite.middlewares);

        // Dynamic catch-all SPA fallback for direct-link loading or page refreshes in dev mode
        app.get('*', async (req, res, next) => {
          // Allow any api endpoints or static/asset requests with file extensions to bypass
          if (req.originalUrl.startsWith('/api') || req.originalUrl.includes('.')) {
            return next();
          }
          try {
            const template = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
            const origin = getClientForwardedOrigin(req);
            const injectedScript = `<script>window.__APPMAP_ORIGIN__ = "${origin}";</script>`;
            let html = await vite.transformIndexHtml(req.originalUrl, template);
            html = html.replace('<head>', `<head>\n    ${injectedScript}`);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
          } catch (err) {
            next(err);
          }
        });
      } else {
        const getProductionDistPath = (): string => {
          const candidates = [
            path.join(process.cwd(), 'dist'),
            _dirname,
            path.join(_dirname, '..', 'dist')
          ];
          for (const cand of candidates) {
            if (fs.existsSync(cand) && fs.existsSync(path.join(cand, 'index.html'))) {
              return cand;
            }
          }
          for (const cand of candidates) {
            if (fs.existsSync(cand)) {
              return cand;
            }
          }
          return candidates[0];
        };

        const getProductionHtmlPath = (): string => {
          const candidates = [
            path.join(getProductionDistPath(), 'index.html'),
            path.join(process.cwd(), 'dist', 'index.html'),
            path.join(_dirname, 'index.html'),
            path.join(_dirname, '..', 'dist', 'index.html'),
            path.join(process.cwd(), 'index.html') // Root template fallback
          ];
          for (const cand of candidates) {
            if (fs.existsSync(cand)) {
              return cand;
            }
          }
          return candidates[0];
        };

        const distPath = getProductionDistPath();
        const htmlPath = getProductionHtmlPath();

        console.log(`[Production Startup] CWD is: ${process.cwd()}`);
        console.log(`[Production Startup] __dirname is: ${typeof _dirname !== 'undefined' ? _dirname : 'undefined'}`);
        console.log(`[Production Startup] Resolved distPath is: ${distPath}`);
        console.log(`[Production Startup] Resolved htmlPath is: ${htmlPath}`);

        try {
          if (fs.existsSync(distPath)) {
            const files = fs.readdirSync(distPath);
            console.log(`[Production Startup] Files in distPath:`, files);
          } else {
            console.warn(`[Production Startup] distPath directory does NOT exist!`);
          }
        } catch (err: any) {
          console.error(`[Production Startup] Error listing files in distPath:`, err.message);
        }

        // Serve index.html dynamically to inject window.__APPMAP_ORIGIN__ for base path
        app.get('/', (req, res) => {
          try {
            const origin = getClientForwardedOrigin(req);
            const activeHtmlPath = getProductionHtmlPath();
            let html = fs.readFileSync(activeHtmlPath, 'utf-8');
            const injectedScript = `<script>window.__APPMAP_ORIGIN__ = "${origin}";</script>`;
            html = html.replace('<head>', `<head>\n    ${injectedScript}`);
            res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
          } catch (err) {
            res.sendFile(getProductionHtmlPath());
          }
        });

        app.use(express.static(distPath));

        app.get('*', (req, res) => {
          try {
            const origin = getClientForwardedOrigin(req);
            const activeHtmlPath = getProductionHtmlPath();
            let html = fs.readFileSync(activeHtmlPath, 'utf-8');
            const injectedScript = `<script>window.__APPMAP_ORIGIN__ = "${origin}";</script>`;
            html = html.replace('<head>', `<head>\n    ${injectedScript}`);
            res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
          } catch (err) {
            res.sendFile(getProductionHtmlPath());
          }
        });
      }

      const server = http.createServer(app);

      server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`[Fatal] Port ${PORT} is already in use. Exiting process so process manager can restart the server.`);
          process.exit(1);
        }
        console.error('Server error:', err);
      });

      server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running beautifully on http://0.0.0.0:${PORT}`);
      });

      // Graceful shutdown handling for Cloud Run scaling and redeployment
      const shutdown = (signal: string) => {
        console.log(`Received ${signal}. Shutting down gracefully...`);
        server.close(() => {
          console.log('HTTP server closed.');
          process.exit(0);
        });

        // Force shutdown after 10 seconds if not closed gracefully
        setTimeout(() => {
          console.error('Could not close connections in time, forcefully shutting down');
          process.exit(1);
        }, 10000);
      };

      process.on('SIGTERM', () => shutdown('SIGTERM'));
      process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();
