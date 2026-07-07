import os
import re

def fix():
    # Login.jsx
    with open('src/pages/Login.jsx', 'r', encoding='utf-8') as f: c = f.read()
    c = c.replace('return (\n\n\n  {/* phone */}', 'return (\n    <>\n  {/* phone */}')
    if c.endswith('  );\n}\n'):
        c = c.replace('  );\n}\n', '    </>\n  );\n}\n')
    with open('src/pages/Login.jsx', 'w', encoding='utf-8') as f: f.write(c)

    # MyLands.jsx
    with open('src/pages/MyLands.jsx', 'r', encoding='utf-8') as f: c = f.read()
    c = c.replace("style={font}-size:13px;color:s.color;font-weight:700", "style={{fontSize: '13px', color: s.color, fontWeight: '700'}}")
    with open('src/pages/MyLands.jsx', 'w', encoding='utf-8') as f: f.write(c)

    # Visits.jsx
    with open('src/pages/Visits.jsx', 'r', encoding='utf-8') as f: c = f.read()
    c = c.replace("style={font}-size:12px;font-weight:700;color:v.cdColor", "style={{fontSize: '12px', fontWeight: '700', color: v.cdColor}}")
    with open('src/pages/Visits.jsx', 'w', encoding='utf-8') as f: f.write(c)

    # AdminDashboard.jsx
    with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f: c = f.read()
    c = c.replace("style={font}-size:11.5px;font-weight:800;color:p.deltaColor", "style={{fontSize: '11.5px', fontWeight: '800', color: p.deltaColor}}")
    with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f: f.write(c)

fix()
print("Fixed")
