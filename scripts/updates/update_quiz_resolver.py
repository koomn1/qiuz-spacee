import re

with open('src/components/QuizResolver.tsx', 'r') as f:
    content = f.read()

# Add GSAP imports
if 'useGSAP' not in content:
    content = content.replace("import React, { useState, useEffect, useRef } from 'react';", 
                              "import React, { useState, useEffect, useRef } from 'react';\nimport gsap from 'gsap';\nimport { useGSAP } from '@gsap/react';")

# Hook up GSAP to animate the main container
gsap_hook = """  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, { scope: containerRef, dependencies: [currentIdx, isQuizCompleted, isGeneratingPdf] });
"""

# Inject it after const { t, isAr } = useLanguage();
content = re.sub(r'(const \{ t, isAr \} = useLanguage\(\);)', r'\1\n' + gsap_hook, content)

# Attach containerRef to the root div
content = content.replace('<div className="max-w-3xl mx-auto space-y-8 pb-16 animate-fade-in print:bg-white print:p-0">',
                          '<div ref={containerRef} className="max-w-3xl mx-auto space-y-8 pb-16 print:bg-white print:p-0">')

with open('src/components/QuizResolver.tsx', 'w') as f:
    f.write(content)
print("Updated QuizResolver with GSAP")
