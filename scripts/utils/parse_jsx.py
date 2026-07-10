with open('src/pages/UserProfile.tsx', 'r') as f:
    content = f.read()

start = content.find('{isEditing && (')
end = content.find(')}', start + 100) + 2
block = content[start:end]

lines = block.split('\n')
for i in range(35, 45):
    print(f"{i}: {lines[i]}")
