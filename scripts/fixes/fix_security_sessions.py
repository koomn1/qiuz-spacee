import re

with open('src/pages/settings/Security.tsx', 'r') as f:
    content = f.read()

# Make the device display more rich
# Search for:
#                     <td className="px-5 py-4 flex items-center gap-3">
#                       <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 shrink-0">
#                         {s.device.toLowerCase().includes('iphone') || s.device.toLowerCase().includes('phone') ? (
#                           <Smartphone className="w-4 h-4" />
#                         ) : (
#                           <Laptop className="w-4 h-4" />
#                         )}
#                       </div>
#                       <span className="font-bold">{s.device}</span>
#                     </td>
#                     <td className="px-5 py-4 text-xs font-semibold">{s.location}</td>

pattern = re.compile(r'                    <td className="px-5 py-4 flex items-center gap-3">.*?                    </td>\s*<td className="px-5 py-4 text-xs font-semibold">\{s\.location\}</td>', re.DOTALL)

replacement = r'''                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 shrink-0">
                          {s.device.toLowerCase().includes('iphone') || s.device.toLowerCase().includes('phone') || s.device.toLowerCase().includes('android') ? (
                            <Smartphone className="w-5 h-5" />
                          ) : (
                            <Laptop className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex flex-col text-left" style={{ textAlign: isAr ? 'right' : 'left' }}>
                          <span className="font-bold text-slate-800 dark:text-white text-sm">{s.device}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{s.ipAddress || 'IP: Unknown'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                       <div className="flex flex-col text-left" style={{ textAlign: isAr ? 'right' : 'left' }}>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{s.location}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{s.lastActive || (isAr ? 'منذ فترة' : 'Recently')}</span>
                       </div>
                    </td>'''

content = pattern.sub(replacement, content)

with open('src/pages/settings/Security.tsx', 'w') as f:
    f.write(content)

