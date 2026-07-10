const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf-8');

code = code.replace(
  "import { MainLogo } from './MainLogo';",
  "import { MainLogo } from './MainLogo';\nimport { AnimatedLogo } from './AnimatedLogo';"
);

code = code.replace(
  '<MainLogo size="sm" />',
  '<div className="flex items-center gap-2"><AnimatedLogo className="w-8 h-8 text-[#0ae448]" /><span className="font-display font-bold text-xl text-slate-800 dark:text-slate-100 hidden sm:inline-block">SpaceQuiz</span></div>'
);

fs.writeFileSync('src/components/Header.tsx', code);
console.log("Patched Header.tsx");
