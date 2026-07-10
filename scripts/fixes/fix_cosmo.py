import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the Cosmo AI button
# Search for:
#                 <button                                                                                                            
#                   onClick={handleToggleAssistant}
#                   className="relative overflow-hidden h-14 px-5 rounded-[24px] bg-[#0a0e1a]/85 backdrop-blur-2xl text-white flex items-center gap-3.5 cursor-pointer border border-white/15 hover:border-primary/50 transition-all font-display shadow-[0_12px_35px_rgba(10,14,26,0.5)] group"
#                 >
# to
#                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-primary/20 group-hover:border-primary/30 transition-all shrink-0">
#                    <span className="text-[10px] font-bold">✦</span>
#                  </div>
#                </button>

pattern = re.compile(r'(<div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-primary to-pink-500 rounded-full blur-xl opacity-35 animate-pulse pointer-events-none scale-105" />\s*)<button[^>]*handleToggleAssistant.*?</button>', re.DOTALL)

replacement = r'''\1
                <button
                  onClick={handleToggleAssistant}
                  className="relative overflow-hidden w-16 h-16 rounded-full bg-[#0a0e1a]/85 backdrop-blur-2xl text-white flex items-center justify-center cursor-pointer border border-white/15 hover:border-primary/50 transition-all shadow-[0_12px_35px_rgba(10,14,26,0.5)] group hover:scale-105"
                  title={lang === 'ar' ? 'اسأل كوزمو الذكي' : 'Ask Cosmo AI'}
                >
                  {/* Inner animated mesh gradient sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-primary/30 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Rotating glowing halo line inside */}
                  <div className="absolute -inset-y-12 -inset-x-6 bg-gradient-to-r from-transparent via-primary/20 to-transparent rotate-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  
                  {/* Active Smart Orb Container */}
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 shadow-inner shrink-0 overflow-hidden border border-white/20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] animate-pulse" />
                    <Bot className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                    <Sparkles className="absolute top-1 right-1 w-3 h-3 text-amber-300 animate-bounce" />
                    <span className="absolute bottom-1 left-1 flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                </button>'''

new_content = pattern.sub(replacement, content)

with open('src/App.tsx', 'w') as f:
    f.write(new_content)
