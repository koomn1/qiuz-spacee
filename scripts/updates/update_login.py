import re

with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()

if 'useGSAP' not in content:
    content = content.replace("import React, { useState } from 'react';", 
                              "import React, { useState, useRef } from 'react';\nimport gsap from 'gsap';\nimport { useGSAP } from '@gsap/react';")

gsap_hook = """  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".anim-item", 
      { opacity: 0, y: 30, rotationX: 45 },
      { opacity: 1, y: 0, rotationX: 0, duration: 1, stagger: 0.1, ease: 'back.out(1.5)' }
    );
  }, { scope: containerRef, dependencies: [isLogin] });
"""

content = re.sub(r'(const \{ t, isAr \} = useLanguage\(\);)', r'\1\n' + gsap_hook, content)

content = content.replace('<div className="relative min-h-[85vh] flex items-center justify-center p-4">',
                          '<div ref={containerRef} className="relative min-h-[85vh] flex items-center justify-center p-4">')

content = content.replace('className="relative w-full max-w-md"', 'className="relative w-full max-w-md anim-item"')

with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)
print("Updated Login with GSAP")
