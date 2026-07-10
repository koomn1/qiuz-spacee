import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Move activeAdminTab declaration above useGSAP
pattern = re.compile(r'(  useGSAP\(\(\) => \{.*?  const \[activeAdminTab, setActiveAdminTab\] = useState<\'overview\' \| \'users\' \| \'quizzes\' \| \'subscriptions\' \| \'coupons\' \| \'settings\' \| \'classrooms\'>\(\'overview\'\);)', re.DOTALL)

def replacer(m):
    text = m.group(1)
    # Extract the useState line
    state_line = "  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'users' | 'quizzes' | 'subscriptions' | 'coupons' | 'settings' | 'classrooms'>('overview');\n"
    # Remove it from the text
    text = text.replace(state_line, "")
    # Add it before useGSAP
    return state_line + text

content = pattern.sub(replacer, content)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
