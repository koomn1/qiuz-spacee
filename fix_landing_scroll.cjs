const fs = require('fs');
let code = fs.readFileSync('src/pages/LandingPage.tsx', 'utf-8');

code = code.replace(
  `      <FeatureScrollReveal features={[
        { title: 'Interactive Learning', desc: 'Dive into beautifully designed challenges.' },
        { title: 'AI-Powered Insights', desc: 'Analyze your progress with smart analytics.' },
        { title: 'Global Competitions', desc: 'Join leaderboards and unlock achievements.' }
      ]} />`,
  `      <FeatureScrollReveal isAr={isAr} features={[
        { 
          title: isAr ? 'تعلم تفاعلي' : 'Interactive Learning', 
          desc: isAr ? 'انغمس في تحديات مصممة بجمال وإبداع.' : 'Dive into beautifully designed challenges.' 
        },
        { 
          title: isAr ? 'رؤى بالذكاء الاصطناعي' : 'AI-Powered Insights', 
          desc: isAr ? 'حلل تقدمك مع تحليلات ذكية ودقيقة.' : 'Analyze your progress with smart analytics.' 
        },
        { 
          title: isAr ? 'منافسات عالمية' : 'Global Competitions', 
          desc: isAr ? 'انضم لقوائم المتصدرين وافتح الإنجازات.' : 'Join leaderboards and unlock achievements.' 
        }
      ]} />`
);

fs.writeFileSync('src/pages/LandingPage.tsx', code);
console.log('Fixed LandingPage.tsx FeatureScrollReveal translations and isAr prop');
