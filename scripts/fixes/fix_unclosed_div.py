with open('src/pages/UserProfile.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "              {/* Social Links Configuration */}",
    "            </div>\n          {/* Social Links Configuration */}"
)

with open('src/pages/UserProfile.tsx', 'w') as f:
    f.write(content)
