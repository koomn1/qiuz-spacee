import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const replacement = `    const app = express();
      const PORT = 3000;

      // Rate Limiting (Protects from Brute Force and AI cost draining)
      const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        message: { error: 'عذراً! تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً.' },
        standardHeaders: true,
        legacyHeaders: false,
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
      });`;

content = content.replace(/    const app = express\(\);\s+const PORT = 3000;\s+app\.use\(express\.json\(\{ limit: "50mb" \}\)\);/, replacement);

fs.writeFileSync('server.ts', content);
console.log('Fixed server.ts');
