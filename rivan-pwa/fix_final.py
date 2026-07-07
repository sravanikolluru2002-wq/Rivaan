import os
import re

# 1. AdminDashboard.jsx
with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f: c = f.read()
c = c.replace("<div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '11px'}} 0;border-top:n.border>", "<div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderTop: n.border}}>")
with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f: f.write(c)

# 2. MyLands.jsx
with open('src/pages/MyLands.jsx', 'r', encoding='utf-8') as f: c = f.read()
# Let's fix timeline map closing using regex
c = re.sub(
    r'(<p style={{margin: \'3px 0 0\', fontSize: \'11\.5px\', color: tl\.dateColor, fontWeight: \'600\'}}>{tl\.date}</p>\s*</div>\s*</div>)',
    r'\1\n              ))}',
    c
)
with open('src/pages/MyLands.jsx', 'w', encoding='utf-8') as f: f.write(c)

# 3. Visits.jsx
with open('src/pages/Visits.jsx', 'r', encoding='utf-8') as f: c = f.read()
if ")}\n\n        {showNav && (" in c:
    pass # we already have it
else:
    c = c.replace("{showNav && (", ")}\n\n        {showNav && (")

# Check if isBook && ( is closed properly
# We can use our script to find the unclosed block
def find_unclosed(text):
    blocks = []
    lines = text.split('\\n')
    for i, line in enumerate(lines):
        if '{' in line and '}' not in line:
            if line.strip().startswith('{') and ('&&' in line or '.map' in line):
                blocks.append((i+1, line.strip()))
        if ')}' in line and line.strip().startswith(')'):
            if blocks:
                blocks.pop()
    return blocks

print("Unclosed in Visits:", find_unclosed(c))
with open('src/pages/Visits.jsx', 'w', encoding='utf-8') as f: f.write(c)

# 4. AppDashboard.jsx
with open('src/pages/AppDashboard.jsx', 'r', encoding='utf-8') as f: c = f.read()
# Adjacent JSX at 996
# Maybe <br> was not replaced?
c = c.replace("<br>", "<br/>")
c = c.replace("towards<br/>Emerald", "towards<br/>\nEmerald")
# Why Adjacent JSX? Maybe a missing closing tag?
# Let's just wrap everything in AppDashboard.jsx return (...) in <> </>
c = re.sub(r'return \(\s*<div className="app-container">', r'return (\n    <>\n      <div className="app-container">', c)
c = re.sub(r'  \);\n}', r'    </>\n  );\n}', c)

with open('src/pages/AppDashboard.jsx', 'w', encoding='utf-8') as f: f.write(c)

print("Fixed")
