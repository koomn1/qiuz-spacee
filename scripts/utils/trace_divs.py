with open('src/pages/UserProfile.tsx', 'r') as f:
    lines = f.readlines()

div_count = 0
for i, line in enumerate(lines[875:1200]):
    opens = line.count('<div')
    closes = line.count('</div')
    div_count += opens
    div_count -= closes
    if opens > 0 or closes > 0:
        print(f"Line {876+i:4}: Level {div_count:2} | {line.strip()}")
