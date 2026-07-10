const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace("import gsap from 'gsap';\n", "");
code = code.replace("import { useGSAP } from '@gsap/react';\n", "");
code = code.replace("gsap.registerPlugin(useGSAP);\n", "");

fs.writeFileSync('src/App.tsx', code);
console.log("Cleaned up unused GSAP from App.tsx");
