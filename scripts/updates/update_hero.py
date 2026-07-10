import re

with open('src/components/HeroAnimation.tsx', 'r') as f:
    content = f.read()

# 1. Add TextPlugin to imports
content = content.replace("import { SplitText } from 'gsap/SplitText';", "import { SplitText } from 'gsap/SplitText';\nimport { TextPlugin } from 'gsap/TextPlugin';")
content = content.replace("gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);", "gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger, TextPlugin);")

# 2. Fix SplitText for Arabic
old_split = """      const split = new SplitText(headlineRef.current, { type: 'words,chars' });
      gsap.fromTo(split.chars, 
        { opacity: 0, y: 120, rotateX: -90, scale: 0.3 },
        { 
          opacity: 1, 
          y: 0, 
          rotateX: 0, 
          scale: 1,
          duration: 1.2, 
          stagger: 0.03, 
          ease: 'back.out(1.7)',
          delay: 0.2
        }
      );"""

new_split = """      const split = new SplitText(headlineRef.current, { type: isAr ? 'words' : 'words,chars' });
      const staggerElements = isAr ? split.words : split.chars;
      gsap.fromTo(staggerElements, 
        { opacity: 0, y: 120, rotateX: -90, scale: 0.3 },
        { 
          opacity: 1, 
          y: 0, 
          rotateX: 0, 
          scale: 1,
          duration: 1.2, 
          stagger: 0.03, 
          ease: 'back.out(1.7)',
          delay: 0.2
        }
      );"""

content = content.replace(old_split, new_split)

# 3. Fix Type/Erase text animation
old_type_erase = """    // Type/Erase with GSAP Clip-Path
    if (sparkTextRef.current) {
      const tl = gsap.timeline({ repeat: -1, delay: 2 });
      const startClip = isAr ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
      const endClip = 'inset(0 0 0 0)';
      const eraseClip = isAr ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';

      topicsToUse.forEach((topic) => {
        tl.call(() => {
          if (sparkTextRef.current) {
            sparkTextRef.current.innerText = topic;
          }
        })
        .fromTo(sparkTextRef.current, 
          { clipPath: startClip },
          { clipPath: endClip, duration: 1.2, ease: "power2.inOut" }
        )
        .to(sparkTextRef.current, {
          clipPath: eraseClip, duration: 0.8, ease: "power2.inOut", delay: 2.5
        });
      });
    }"""

new_type_erase = """    // Type/Erase with GSAP TextPlugin
    if (sparkTextRef.current) {
      sparkTextRef.current.innerText = '';
      const tl = gsap.timeline({ repeat: -1, delay: 1 });

      topicsToUse.forEach((topic) => {
        tl.to(sparkTextRef.current, {
          text: topic,
          duration: topic.length * 0.08,
          ease: "none",
        })
        .to({}, { duration: 2.5 })
        .to(sparkTextRef.current, {
          text: "",
          duration: topic.length * 0.04,
          ease: "none",
        });
      });
    }"""

content = content.replace(old_type_erase, new_type_erase)

# 4. Remove clipPath from style
old_p_style = """        <p 
          ref={sparkTextRef} 
          className="mt-6 text-2xl md:text-5xl text-[#0ae448] font-black tracking-wide max-w-3xl text-center min-h-[70px]"
          style={{ textShadow: '0 0 30px rgba(10,228,72,0.6)', clipPath: isAr ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }}
        >"""

new_p_style = """        <p 
          ref={sparkTextRef} 
          className="mt-6 text-2xl md:text-5xl text-[#0ae448] font-black tracking-wide max-w-3xl text-center min-h-[70px]"
          style={{ textShadow: '0 0 30px rgba(10,228,72,0.6)' }}
        >"""

content = content.replace(old_p_style, new_p_style)

with open('src/components/HeroAnimation.tsx', 'w') as f:
    f.write(content)
print('Updated HeroAnimation.tsx')
