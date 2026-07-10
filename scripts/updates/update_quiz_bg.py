import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Increase opacity of dark mode background
old_bg = """          {/* Dark mode background elements (similar to Landing Page Hero) */}
          <div className="absolute inset-0 hidden dark:block opacity-60">"""

new_bg = """          {/* Dark mode background elements (similar to Landing Page Hero) */}
          <div className="absolute inset-0 hidden dark:block opacity-100">"""

content = content.replace(old_bg, new_bg)

with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/components/QuizResolver.tsx', 'r') as f:
    content = f.read()

# Update Quiz Resolver card background
old_card_bg = """bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"""
new_card_bg = """bg-white/95 dark:bg-[#090d16]/70 backdrop-blur-3xl"""

content = content.replace(old_card_bg, new_card_bg)

with open('src/components/QuizResolver.tsx', 'w') as f:
    f.write(content)

print("Updated QuizResolver and App bg")
