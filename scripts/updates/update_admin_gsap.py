import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Add ref and useGSAP to the main container
pattern = re.compile(r'(export default function AdminDashboard.*?\{.*?)(  const isAr = lang === \'ar\';)', re.DOTALL)
replacement = r'''\1\2
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Initial load animation for header and stats
    gsap.fromTo(
      ".admin-header-anim",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
    );
    
    gsap.fromTo(
      ".admin-nav-item",
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "back.out(1.2)" }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    // Animate tab content switching
    gsap.fromTo(
      ".admin-content-panel",
      { opacity: 0, y: 15, scale: 0.99 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out", clearProps: "all" }
    );
  }, { scope: containerRef, dependencies: [activeTab] });
'''
content = pattern.sub(replacement, content)

# Now, add the classes to the JSX
# We need to wrap the return in <div ref={containerRef} ...> instead of its current root
# Let's see what the return looks like:
pattern2 = re.compile(r'(return \(\s*)<div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">')
replacement2 = r'\1<div ref={containerRef} className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">'
content = pattern2.sub(replacement2, content)

# Add "admin-header-anim" to the h2/p elements inside the main content or the nav title
# Let's replace the nav title area:
pattern3 = re.compile(r'(<div className="p-6">\s*<div className="flex items-center gap-3 mb-2">)')
replacement3 = r'<div className="p-6 admin-header-anim">\n          <div className="flex items-center gap-3 mb-2">'
content = pattern3.sub(replacement3, content)

# Add "admin-nav-item" to the nav buttons
pattern4 = re.compile(r'(<button\s*key=\{tab\.id\}\s*onClick=\{[^\}]+\}\s*className=\{`w-full flex items-center gap-3 px-4 py-3 rounded-xl)')
replacement4 = r'\1 admin-nav-item'
content = pattern4.sub(replacement4, content)

# Add "admin-content-panel" to the active tab containers inside the main body
pattern5 = re.compile(r'(\s*\{activeTab === \'overview\' && \(\s*)<div className="space-y-6">')
replacement5 = r'\1<div className="space-y-6 admin-content-panel">'
content = pattern5.sub(replacement5, content)

pattern6 = re.compile(r'(\s*\{activeTab === \'users\' && \(\s*)<div className="space-y-6">')
replacement6 = r'\1<div className="space-y-6 admin-content-panel">'
content = pattern6.sub(replacement6, content)

pattern7 = re.compile(r'(\s*\{activeTab === \'content\' && \(\s*)<div className="space-y-6">')
replacement7 = r'\1<div className="space-y-6 admin-content-panel">'
content = pattern7.sub(replacement7, content)

pattern8 = re.compile(r'(\s*\{activeTab === \'system\' && \(\s*)<div className="space-y-6">')
replacement8 = r'\1<div className="space-y-6 admin-content-panel">'
content = pattern8.sub(replacement8, content)

pattern9 = re.compile(r'(\s*\{activeTab === \'monetization\' && \(\s*)<div className="space-y-6">')
replacement9 = r'\1<div className="space-y-6 admin-content-panel">'
content = pattern9.sub(replacement9, content)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

