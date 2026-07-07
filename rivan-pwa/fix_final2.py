import os
import re

# 1. AdminDashboard.jsx
with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f: c = f.read()
# Remove <script> to </script>
c = re.sub(r'<script>.*?</script>', '', c, flags=re.DOTALL)
# Wrap the inside of return ( ... ); with <>...</>
if 'return (\n    <>\n' not in c:
    c = re.sub(r'return \(\n', r'return (\n    <>\n', c, count=1)
    c = re.sub(r'\n  \);\n}', r'\n    </>\n  );\n}', c)
with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f: f.write(c)

# 2. MyLands.jsx
with open('src/pages/MyLands.jsx', 'r', encoding='utf-8') as f: c = f.read()
if 'return (\n    <>\n' not in c and 'return (\n<>' not in c:
    c = re.sub(r'return \(\n', r'return (\n    <>\n', c, count=1)
    c = re.sub(r'\n  \);\n}', r'\n    </>\n  );\n}', c)
with open('src/pages/MyLands.jsx', 'w', encoding='utf-8') as f: f.write(c)

# 3. Visits.jsx
with open('src/pages/Visits.jsx', 'r', encoding='utf-8') as f: c = f.read()
c = c.replace('const sel = selData;', '')
if 'return (\n    <>\n' not in c and 'return (\n<>' not in c:
    c = re.sub(r'return \(\n', r'return (\n    <>\n', c, count=1)
    c = re.sub(r'\n  \);\n}', r'\n    </>\n  );\n}', c)
with open('src/pages/Visits.jsx', 'w', encoding='utf-8') as f: f.write(c)

print("Fixed")
