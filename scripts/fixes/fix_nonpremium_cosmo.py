import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Non premium button
pattern = re.compile(r'(<div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-\[#128c7e\] rounded-full blur-xl opacity-35 animate-pulse pointer-events-none scale-105" />\s*)<button[^>]*handleToggleAssistant.*?</button>', re.DOTALL)

replacement = r'''\1
                <button
                  onClick={handleToggleAssistant}
                  className="relative overflow-hidden w-16 h-16 rounded-full bg-[#0a0e1a]/85 backdrop-blur-2xl text-white flex items-center justify-center cursor-pointer border border-white/15 hover:border-emerald-500/50 transition-all shadow-[0_12px_35px_rgba(10,14,26,0.5)] group hover:scale-105"
                  title={lang === 'ar' ? 'اسأل كوزمو الذكي' : 'Ask Cosmo AI'}
                >
                  {/* Inner mesh gradient sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-400/20 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Rotating glowing halo line inside */}
                  <div className="absolute -inset-y-12 -inset-x-6 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent rotate-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  
                  {/* Lock Screen Indicator */}
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-[#0a0e1a] shadow-inner shrink-0 overflow-hidden border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                    <Bot className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300" />
                    <div className="absolute -bottom-1 -right-1 bg-[#0a0e1a] rounded-full p-0.5 border border-white/10">
                      <Lock className="w-2.5 h-2.5 text-slate-500" />
                    </div>
                  </div>
                </button>'''

new_content = pattern.sub(replacement, content)

with open('src/App.tsx', 'w') as f:
    f.write(new_content)
