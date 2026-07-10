import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the WhatsApp button
# Search for:
#                 <a                  href="https://wa.me/201018995002"                  target="_blank"                  rel="noopener noreferrer"                                                                                                            className="relative overflow-hidden h-14 px-5 rounded-[24px] bg-[#0f172a]/95 dark:bg-[#075e54]/95 text-white flex items-center gap-3.5 cursor-pointer border border-[#128c7e]/30 hover:border-[#128c7e]/60 transition-all font-display shadow-[0_12px_35px_rgba(18,140,126,0.4)] group inline-flex"                >

pattern = re.compile(r'(<div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-\[#128c7e\] rounded-full blur-xl opacity-35 animate-pulse pointer-events-none scale-105" />\s*)<a[^>]*wa\.me.*?</a\s*>', re.DOTALL)

replacement = r'''\1
                <a
                  href="https://wa.me/201018995002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden w-16 h-16 rounded-full bg-[#0f172a]/95 dark:bg-[#075e54]/95 text-white flex items-center justify-center cursor-pointer border border-[#128c7e]/30 hover:border-[#128c7e]/60 transition-all shadow-[0_12px_35px_rgba(18,140,126,0.4)] group hover:scale-105"
                  title={lang === 'ar' ? 'تواصل مع الدعم' : 'Contact Support'}
                >
                  {/* Inner animated sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-[#128c7e]/30 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Active Support Container */}
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#128c7e] to-[#25d366] shadow-inner shrink-0 overflow-hidden border border-white/20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] animate-pulse" />
                    <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute bottom-1 left-1 flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                </a>'''

new_content = pattern.sub(replacement, content)

with open('src/App.tsx', 'w') as f:
    f.write(new_content)
