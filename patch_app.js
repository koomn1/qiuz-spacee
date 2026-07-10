const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes("import { ScrollSmoother }")) {
  code = code.replace(
    "import { motion, AnimatePresence } from 'motion/react';",
    "import { motion, AnimatePresence } from 'motion/react';\nimport gsap from 'gsap';\nimport { ScrollSmoother } from 'gsap/ScrollSmoother';\nimport { useGSAP } from '@gsap/react';\n\ngsap.registerPlugin(useGSAP, ScrollSmoother);"
  );
  
  code = code.replace(
    "const [isLoadingQuizzes, setIsLoadingQuizzes] = React.useState(true);",
    "const [isLoadingQuizzes, setIsLoadingQuizzes] = React.useState(true);\n\n  useGSAP(() => {\n    ScrollSmoother.create({\n      wrapper: '#smooth-wrapper',\n      content: '#smooth-content',\n      smooth: 1.5,\n      effects: true\n    });\n  });"
  );
  
  // Wrap main content
  code = code.replace(
    '<div className="flex-1 flex flex-col min-w-0 transition-colors duration-300 relative overflow-x-hidden">',
    '<div id="smooth-wrapper"><div id="smooth-content"><div className="flex-1 flex flex-col min-w-0 transition-colors duration-300 relative overflow-x-hidden">'
  );
  
  code = code.replace(
    '</motion.div>',
    '</div></div></motion.div>'
  );

  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched App.tsx for ScrollSmoother");
} else {
  console.log("Already patched");
}
