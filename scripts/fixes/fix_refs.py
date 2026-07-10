import re

with open('src/components/HeroAnimation.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'ref=\{el => (orbsRef\.current\[\d+\] = el)\}', r'ref={el => { \1; }}', content)
content = re.sub(r'ref=\{el => (iconsRef\.current\[\d+\] = el)\}', r'ref={el => { \1; }}', content)

with open('src/components/HeroAnimation.tsx', 'w') as f:
    f.write(content)
