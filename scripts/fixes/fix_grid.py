with open('src/pages/UserProfile.tsx', 'r') as f:
    content = f.read()

# Let's count all '<div' and '</div' in the whole file
divs = content.count('<div')
end_divs = content.count('</div')
print(f"Total <div: {divs}, Total </div: {end_divs}")
