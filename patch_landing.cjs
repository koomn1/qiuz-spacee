const fs = require('fs');
let code = fs.readFileSync('src/pages/LandingPage.tsx', 'utf-8');

code = code.replace(
  "import { GsapHero } from '../components/GsapHero';",
  "import { HeroAnimation } from '../components/HeroAnimation';\nimport { FeatureScrollReveal } from '../components/FeatureScrollReveal';"
);

code = code.replace(
  "<GsapHero t={t} isAr={isAr} onCreateQuizTab={onCreateQuizTab} />",
  "<HeroAnimation t={t} isAr={isAr} onCreateQuizTab={onCreateQuizTab} />\n\n      <FeatureScrollReveal features={[\n        { title: 'Interactive Learning', desc: 'Dive into beautifully designed challenges.' },\n        { title: 'AI-Powered Insights', desc: 'Analyze your progress with smart analytics.' },\n        { title: 'Global Competitions', desc: 'Join leaderboards and unlock achievements.' }\n      ]} />"
);

fs.writeFileSync('src/pages/LandingPage.tsx', code);
console.log("Patched LandingPage.tsx");
