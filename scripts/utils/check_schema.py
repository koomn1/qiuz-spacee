import re
with open('src/db/schema.ts', 'r') as f:
    content = f.read()

m = re.search(r'export const userSessions = pgTable.*?\}\);', content, re.DOTALL)
if m:
    print(m.group(0))
