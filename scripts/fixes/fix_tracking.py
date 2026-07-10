import re

with open('src/components/HeroAnimation.tsx', 'r') as f:
    content = f.read()

# Fix tracking-wide for sparkTextRef
content = content.replace(
    'className="text-2xl md:text-5xl text-[#0ae448] font-black tracking-wide"',
    'className={`text-2xl md:text-5xl text-[#0ae448] font-black ${isAr ? "" : "tracking-wide"}`}'
)

# Also fix the main Title tracking-tighter which might be okay, but let's be safe
content = content.replace(
    'bg-cover bg-center tracking-tighter font-display"',
    'bg-cover bg-center ${isAr ? "" : "tracking-tighter"} font-display"`'
)
# Wait, the main title className is a string, I need to make it a template literal
old_headline_class = """className="text-[10vw] sm:text-[7vw] md:text-[5rem] leading-[1.1] font-black text-transparent bg-clip-text bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center tracking-tighter font-display\""""
new_headline_class = """className={`text-[10vw] sm:text-[7vw] md:text-[5rem] leading-[1.1] font-black text-transparent bg-clip-text bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center font-display ${isAr ? '' : 'tracking-tighter'}`}\""""

content = content.replace(old_headline_class, new_headline_class)

with open('src/components/HeroAnimation.tsx', 'w') as f:
    f.write(content)
print("Removed letter-spacing for Arabic")
