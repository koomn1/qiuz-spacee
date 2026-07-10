import re

with open('src/components/ExtraFeatures.tsx', 'r') as f:
    content = f.read()

# Add containerRef to SettingsSection
# Search for:
#   const [badgeSymbol, setBadgeSymbol] = useState('🛡️');
#   const [badgeColor, setBadgeColor] = useState('#3b82f6');
# and add:
#   const containerRef = useRef<HTMLDivElement>(null);
#   useGSAP(() => {
#     gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
#   }, { scope: containerRef });
#   useGSAP(() => {
#     gsap.fromTo(".settings-tab-content", { opacity: 0, scale: 0.98, x: -15 }, { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "back.out(1.2)", clearProps: "all" });
#   }, { scope: containerRef, dependencies: [activeTab] });

pattern = re.compile(r'(const \[badgeColor, setBadgeColor\] = useState\(\'#3b82f6\'\);)')
replacement = r'''\1
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
  }, { scope: containerRef });
  
  useGSAP(() => {
    gsap.fromTo(".settings-tab-content", { opacity: 0, scale: 0.98, y: 15 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "back.out(1.2)", clearProps: "all" });
  }, { scope: containerRef, dependencies: [activeTab] });
'''
content = pattern.sub(replacement, content)

# Update return statement to include ref
# Search for:
#   return (
#     <div className="max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in text-right" style={{ textAlign: isAr ? 'right' : 'left' }}>
# Replace with:
#   return (
#     <div ref={containerRef} className="max-w-5xl mx-auto flex flex-col gap-6 text-right" style={{ textAlign: isAr ? 'right' : 'left' }}>

content = content.replace(
    '''  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in text-right" style={{ textAlign: isAr ? 'right' : 'left' }}>''',
    '''  return (
    <div ref={containerRef} className="max-w-5xl mx-auto flex flex-col gap-6 text-right" style={{ textAlign: isAr ? 'right' : 'left' }}>'''
)

# Add "settings-tab-content" to the tab wrappers
content = content.replace(
    '''{activeTab === 1 && (
          <div                                                className="space-y-6"          >''',
    '''{activeTab === 1 && (
          <div className="space-y-6 settings-tab-content">'''
)

content = content.replace(
    '''{activeTab === 2 && (
          <div                                    className="space-y-6"          >''',
    '''{activeTab === 2 && (
          <div className="space-y-6 settings-tab-content">'''
)

content = content.replace(
    '''{activeTab === 3 && (
          <div                                    className="space-y-8"          >''',
    '''{activeTab === 3 && (
          <div className="space-y-8 settings-tab-content">'''
)

with open('src/components/ExtraFeatures.tsx', 'w') as f:
    f.write(content)
