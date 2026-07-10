import os
import re

def strip_framer(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check if motion is imported
    if 'motion' not in content and 'AnimatePresence' not in content:
        return
        
    # Remove imports
    content = re.sub(r"import\s*\{[^}]*motion[^}]*\}\s*from\s*['\"]motion/react['\"];?\n?", "", content)
    content = re.sub(r"import\s*\{[^}]*AnimatePresence[^}]*\}\s*from\s*['\"]motion/react['\"];?\n?", "", content)
    
    # Remove <AnimatePresence> and </AnimatePresence> tags
    content = re.sub(r"<\s*AnimatePresence[^>]*>", "", content)
    content = re.sub(r"<\/\s*AnimatePresence\s*>", "", content)
    
    # Replace <motion.tag> with <tag>
    content = re.sub(r"<\s*motion\.(div|span|button|a|p|ul|li|svg|path|h1|h2|h3|h4|h5|h6|nav|header|footer|section)", r"<\1", content)
    content = re.sub(r"<\/\s*motion\.(div|span|button|a|p|ul|li|svg|path|h1|h2|h3|h4|h5|h6|nav|header|footer|section)\s*>", r"</\1>", content)
    
    # We need to remove framer-motion props: initial, animate, exit, transition, whileHover, whileTap, variants, custom, layout, layoutId
    # This regex matches propName={...} or propName="..."
    # Since {...} might contain nested braces, we need a recursive-like or simple balanced brace matcher
    # A simple regex for {...} without deep nesting:
    prop_pattern = r'\b(initial|animate|exit|transition|whileHover|whileTap|variants|custom|layout|layoutId|key)\s*=\s*(?:\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|"[^"]*"|\'[^\']*\')'
    
    # Run it a few times in case of multiple props per line or adjacent
    for _ in range(5):
        content = re.sub(prop_pattern, "", content)
        
    # Clean up empty className={`...`} that might result, though prop_pattern doesn't touch className.
    
    # Also remove `mode="wait"` which was on AnimatePresence
    content = re.sub(r'\bmode="wait"', "", content)
    content = re.sub(r"\bmode='wait'", "", content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Stripped {filepath}")

for root, _, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            strip_framer(os.path.join(root, f))
