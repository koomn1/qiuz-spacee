import re

with open('src/pages/AnalyticsDashboard.tsx', 'r') as f:
    content = f.read()

if 'useGSAP' not in content:
    content = content.replace("import React, { useState, useEffect } from 'react';", 
                              "import React, { useState, useEffect, useRef } from 'react';\nimport gsap from 'gsap';\nimport { useGSAP } from '@gsap/react';")

gsap_hook = """  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".anim-item", 
      { opacity: 0, y: 30, rotationX: 10 },
      { opacity: 1, y: 0, rotationX: 0, duration: 0.8, stagger: 0.05, ease: 'back.out(1.2)' }
    );
  }, { scope: containerRef });
"""

content = re.sub(r'(const \{ t, isAr \} = useLanguage\(\);)', r'\1\n' + gsap_hook, content)

content = content.replace('<div className="max-w-7xl mx-auto space-y-8">',
                          '<div ref={containerRef} className="max-w-7xl mx-auto space-y-8">')

content = content.replace('className="bg-white dark:bg-slate-800 rounded-3xl', 'className="bg-white dark:bg-slate-800 rounded-3xl anim-item')
content = content.replace('className="grid grid-cols-1 lg:grid-cols-3', 'className="grid grid-cols-1 lg:grid-cols-3 anim-item')

with open('src/pages/AnalyticsDashboard.tsx', 'w') as f:
    f.write(content)
print("Updated Analytics with GSAP")
