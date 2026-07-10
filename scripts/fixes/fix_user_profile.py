import re

with open('src/pages/UserProfile.tsx', 'r') as f:
    content = f.read()

# Remove the Theme selection
content = re.sub(r'\{/\* App Global Theme Selection \*/\}.*?(?=\{/\* Custom User ID)', '', content, flags=re.DOTALL)

# Remove the Custom Badges and Verification Badges entirely
# From "{/* Custom Badges Configuration */}" up to "{/* Social Links Configuration */}"
content = re.sub(r'\{/\* Custom Badges Configuration \*/\}.*?(?=\{/\* Social Links Configuration \*/\})', '', content, flags=re.DOTALL)

# Replace the "Custom Premium Cover Design Selection" with a simple 2-option background selector that is available for ALL users, not just premium
bg_selector = """          {/* GSAP Cover Background Selection */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-6">
            <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {isAr ? 'خلفية الغلاف المتحركة' : 'Animated Cover Background'}
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setChosenBg('cosmic')}
                className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                  chosenBg === 'cosmic' || !chosenBg
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-2">🌌</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{isAr ? 'الفضاء الكوني' : 'Cosmic Space'}</div>
              </button>
              
              <button
                type="button"
                onClick={() => setChosenBg('waves')}
                className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                  chosenBg === 'waves'
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-indigo-500/50'
                }`}
              >
                <div className="text-2xl mb-2">🌊</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{isAr ? 'الأمواج النيون' : 'Neon Waves'}</div>
              </button>
            </div>
            
            {/* Cover Slogan block */}
            <div className="bg-slate-900/10 dark:bg-slate-950/20 p-5 rounded-3xl border border-slate-200 dark:border-slate-850 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-primary animate-pulse">✨</span>
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  {isAr ? 'عبارة الغلاف المكتوبة (Slogan) ✍️' : 'Cover Slogan Text ✍️'}
                </h4>
              </div>
              <input
                type="text"
                value={coverText}
                onChange={(e) => setCoverText(e.target.value)}
                maxLength={100}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-primary font-bold"
                placeholder={isAr ? "مثال: أهلاً بكم في صفي التعليمي الرقمي! 🚀" : "e.g. Welcome to my elite digital learning space! 🚀"}
              />
            </div>
          </div>
"""

content = re.sub(r'\{/\* Custom Premium Cover Design Selection.*?\{/\* Quick Buttons \*/\}', bg_selector + '\n          {/* Quick Buttons */}', content, flags=re.DOTALL)

# Make sure PremiumBackground gets 'cosmic' or 'waves'
content = content.replace("<PremiumBackground mode={isPremium ? chosenBg : 'cosmic'} settings={bgSettings} />", "<GsapCoverBackground mode={chosenBg || 'cosmic'} />")

# Update imports
content = content.replace("import { PremiumBackground } from '../components/PremiumBackground';", "import { GsapCoverBackground } from '../components/GsapCoverBackground';")
content = content.replace("import { BackgroundGallery } from '../components/BackgroundGallery';\n", "")

with open('src/pages/UserProfile.tsx', 'w') as f:
    f.write(content)

