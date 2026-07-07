import re

with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Remove from <x-dc> up to </helmet>\n
c = re.sub(r'<x-dc>\s*<helmet>.*?</helmet>\s*', '', c, flags=re.DOTALL)
c = c.replace('</x-dc>', '')
    
with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed AdminDashboard")
