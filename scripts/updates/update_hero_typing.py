import re

with open('src/components/HeroAnimation.tsx', 'r') as f:
    content = f.read()

old_jsx = """        <p 
          ref={sparkTextRef} 
          className="mt-6 text-2xl md:text-5xl text-[#0ae448] font-black tracking-wide max-w-3xl text-center min-h-[70px]"
          style={{ textShadow: '0 0 30px rgba(10,228,72,0.6)' }}
        >
        </p>"""

new_jsx = """        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 min-h-[70px]">
          <span className="text-2xl md:text-5xl text-slate-300 font-bold drop-shadow-md">
            {isAr ? 'في مجال' : 'IN'}
          </span>
          <div className="flex items-center">
            <span 
              ref={sparkTextRef} 
              className="text-2xl md:text-5xl text-[#0ae448] font-black tracking-wide"
              style={{ textShadow: '0 0 30px rgba(10,228,72,0.5)' }}
            >
            </span>
            <span className="w-1 md:w-1.5 h-8 md:h-12 bg-[#0ae448] ml-1 animate-[pulse_0.8s_ease-in-out_infinite]" />
          </div>
        </div>"""

content = content.replace(old_jsx, new_jsx)

# Also update the type/erase to be slightly slower and smoother
old_type_erase = """    // Type/Erase with GSAP TextPlugin
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

new_type_erase = """    // Type/Erase with GSAP TextPlugin
    if (sparkTextRef.current) {
      sparkTextRef.current.innerText = '';
      const tl = gsap.timeline({ repeat: -1, delay: 1 });

      topicsToUse.forEach((topic) => {
        tl.to(sparkTextRef.current, {
          text: topic,
          duration: topic.length * 0.1,
          ease: "none",
        })
        .to({}, { duration: 3 })
        .to(sparkTextRef.current, {
          text: "",
          duration: topic.length * 0.05,
          ease: "none",
        });
      });
    }"""

content = content.replace(old_type_erase, new_type_erase)

with open('src/components/HeroAnimation.tsx', 'w') as f:
    f.write(content)
print("Updated HeroAnimation.tsx typing effect")

