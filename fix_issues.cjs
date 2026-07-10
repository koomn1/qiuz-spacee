const fs = require('fs');

// 1. Fix Arabic text splitting (HeroAnimation.tsx)
let heroCode = fs.readFileSync('src/components/HeroAnimation.tsx', 'utf-8');
heroCode = heroCode.replace(
  "type: 'chars,words'",
  "type: 'words'"
);
heroCode = heroCode.replace(
  "gsap.fromTo(split.chars",
  "gsap.fromTo(split.words"
);
fs.writeFileSync('src/components/HeroAnimation.tsx', heroCode);
console.log("Fixed Arabic text splitting in HeroAnimation.tsx");

// 2. Fix Scroll (App.tsx) - Remove ScrollSmoother
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace("import { ScrollSmoother } from 'gsap/ScrollSmoother';\n", "");
appCode = appCode.replace("gsap.registerPlugin(useGSAP, ScrollSmoother);", "gsap.registerPlugin(useGSAP);");

// Remove the ScrollSmoother.create block
appCode = appCode.replace(/useGSAP\(\(\) => \{\s*ScrollSmoother\.create\(\{[\s\S]*?\}\);\s*\}\);/, "");

// Remove the smooth-wrapper and smooth-content divs
appCode = appCode.replace('<div id="smooth-wrapper" className="w-full h-full absolute inset-0"><div id="smooth-content" className="w-full"><div className="flex-1 flex flex-col min-w-0 transition-colors duration-300 relative overflow-x-hidden">', '<div className="flex-1 flex flex-col min-w-0 transition-colors duration-300 relative overflow-x-hidden">');

appCode = appCode.replace('</div></div></motion.div> {/* Closes <motion.div key="main-app"', '</motion.div> {/* Closes <motion.div key="main-app"');

fs.writeFileSync('src/App.tsx', appCode);
console.log("Removed ScrollSmoother from App.tsx to fix scrolling");
