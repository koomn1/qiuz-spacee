import re

with open('src/pages/QuizCreator.tsx', 'r') as f:
    content = f.read()

if 'useGSAP' not in content:
    content = content.replace("import React, { useState, useEffect, useRef } from 'react';", 
                              "import React, { useState, useEffect, useRef } from 'react';\nimport gsap from 'gsap';\nimport { useGSAP } from '@gsap/react';")

gsap_hook = """  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, { scope: containerRef, dependencies: [currentStep] });
"""

content = re.sub(r'(const \{ t, isAr \} = useLanguage\(\);)', r'\1\n' + gsap_hook, content)

content = content.replace('<div className="max-w-4xl mx-auto space-y-6">',
                          '<div ref={containerRef} className="max-w-4xl mx-auto space-y-6">')

with open('src/pages/QuizCreator.tsx', 'w') as f:
    f.write(content)
print("Updated QuizCreator with GSAP")
