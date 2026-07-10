import re

def wrap_return(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find `return (` followed by `{`
    # We can replace `return (\n          {` with `return (\n        <>\n          {`
    content = re.sub(r'return\s*\(\s*\{', r'return (\n        <>\n          {', content)
    
    # We also need to find the matching closing bracket or just look at the end of the file.
    # At the end of the file it is usually `\n      )\n    }\n  );` or something.
    if '<>' in content and '</>' not in content:
        # replace the last `);` with `</>\n  );`
        content = re.sub(r'(\}\s*)\);\s*$', r'\1</>\n  );', content)

    with open(filepath, 'w') as f:
        f.write(content)

wrap_return('src/App.tsx')
wrap_return('src/components/AuthModal.tsx')
wrap_return('src/components/DrivePicker.tsx')

print("Fixed syntax")
