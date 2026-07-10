import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-60 select-none">
          <div 
            className="absolute -top-40 -left-40 w-[600px] h-[500px] bg-gradient-to-tr from-primary/15 via-emerald-500/5 to-purple-600/10 rounded-full filter blur-[120px] transition-all duration-[20s]"
            style={{
              animation: 'pulse 12s infinite ease-in-out alternate'
            }}
          />
          <div 
            className="absolute -bottom-40 -right-40 w-[700px] h-[600px] bg-gradient-to-br from-indigo-500/10 via-teal-400/10 to-rose-500/5 rounded-full filter blur-[140px] transition-all duration-[25s]"
            style={{
              animation: 'pulse 15s infinite ease-in-out alternate-reverse'
            }}
          />
        </div>"""

replacement = """        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Light mode background elements */}
          <div className="absolute inset-0 dark:hidden opacity-30">
            <div 
              className="absolute -top-40 -left-40 w-[600px] h-[500px] bg-gradient-to-tr from-primary/15 via-emerald-500/5 to-purple-600/10 rounded-full filter blur-[120px] transition-all duration-[20s]"
              style={{ animation: 'pulse 12s infinite ease-in-out alternate' }}
            />
            <div 
              className="absolute -bottom-40 -right-40 w-[700px] h-[600px] bg-gradient-to-br from-indigo-500/10 via-teal-400/10 to-rose-500/5 rounded-full filter blur-[140px] transition-all duration-[25s]"
              style={{ animation: 'pulse 15s infinite ease-in-out alternate-reverse' }}
            />
          </div>

          {/* Dark mode background elements (similar to Landing Page Hero) */}
          <div className="absolute inset-0 hidden dark:block opacity-60">
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e512_1px,transparent_1px),linear-gradient(to_bottom,#4f46e512_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_80%,transparent_100%)]" />
            
            {/* Glowing Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#0ae448]/5 blur-[120px] mix-blend-screen" />
            <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/10 blur-[120px] mix-blend-screen" />
          </div>
        </div>"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Background updated in App.tsx")
else:
    print("Target not found")

