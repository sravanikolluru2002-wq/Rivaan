import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = {
        # AdminDashboard.jsx
        "<div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px'}} 0;border-top:a.border>":
            "<div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderTop: a.border}}>",

        # AppDashboard.jsx
        "<span style={{position: 'absolute', top: '3px', left: 't.knob', width: '22px', height: '22px', borderRadius: '50%', background: '#fff', transition: 'left'}} .2s;box-shadow:0 2px 5px rgba(0,0,0,.2)></span>":
            "<span style={{position: 'absolute', top: '3px', left: t.knob, width: '22px', height: '22px', borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 2px 5px rgba(0,0,0,.2)'}}></span>",

        # Visits.jsx (adding missing closing brace)
        "  );\n}\n": "  );\n}\n}\n"
    }

    for old, new in replacements.items():
        if old in content:
            content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.jsx') and not filename.endswith('_raw.jsx'):
        fix_file(os.path.join(pages_dir, filename))
        print(f"Fixed {filename}")
