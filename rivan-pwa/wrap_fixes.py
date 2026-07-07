import os
import re

def wrap_fixes():
    # Visits.jsx
    with open('src/pages/Visits.jsx', 'r', encoding='utf-8') as f: c = f.read()
    c = c.replace("style={font}-size:13px;font-weight:700;color:sel.cdColor", "style={{fontSize: '13px', fontWeight: '700', color: sel.cdColor}}")
    with open('src/pages/Visits.jsx', 'w', encoding='utf-8') as f: f.write(c)

    # MyLands.jsx
    with open('src/pages/MyLands.jsx', 'r', encoding='utf-8') as f: c = f.read()
    if 'return (\n    <>\n' not in c and 'return (\n<>' not in c:
        c = re.sub(r'return \(\s*<div', r'return (\n    <>\n      <div', c, count=1)
        c = re.sub(r'\s*\);\s*\}\s*$', r'\n    </>\n  );\n}\n', c)
    with open('src/pages/MyLands.jsx', 'w', encoding='utf-8') as f: f.write(c)

    # AdminDashboard.jsx
    with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f: c = f.read()
    if 'return (\n    <>\n' not in c and 'return (\n<>' not in c:
        c = re.sub(r'return \(\s*<div', r'return (\n    <>\n      <div', c, count=1)
        c = re.sub(r'\s*\);\s*\}\s*$', r'\n    </>\n  );\n}\n', c)
    with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f: f.write(c)

wrap_fixes()
print("Wrapped")
