import re
import sys

with open('server.ts', 'r') as f:
    content = f.read()

def replace_endpoint(path, new_content):
    global content
    # Find app.post(path ... or app.get(path ...
    # We will just replace it via regex
    # But since it's a bit complex, let's just do exact string replacements of known segments.
    pass

