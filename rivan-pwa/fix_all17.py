import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = {
        # Revert the extra } from fix_all16
        "  );\n}\n}\n}\n": "  );\n}\n",
        "  );\n}\n}\n": "  );\n}\n",

        # AdminDashboard.jsx
        "<div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '13px'}} 0;border-top:s.border>":
            "<div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 0', borderTop: s.border}}>",

        # AppDashboard.jsx
        "<button style={{width: '100%', display: 'flex', alignItems: 'center', gap: '13px', padding: '15px'}} 18px;border:none;background:transparent;cursor:pointer;font-family:inherit;border-top:s.border>":
            "<button style={{width: '100%', display: 'flex', alignItems: 'center', gap: '13px', padding: '15px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', borderTop: s.border}}>",
            
        "<span style={{position: 'absolute', top: '3px', left: 't.knob', width: '22px', height: '22px', borderRadius: '50%', background: '#fff', transition: 'left'}} .2s;box-shadow:0 2px 5px rgba(0,0,0,.2)></span>":
            "<span style={{position: 'absolute', top: '3px', left: t.knob, width: '22px', height: '22px', borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 2px 5px rgba(0,0,0,.2)'}}></span>",

        "<button onClick={t.toggle} style={{width: '48px', height: '28px', borderRadius: '16px', border: 'none', cursor: 'pointer', position: 'relative', background: 't.track', transition: 'background'}} .2s>":
            "<button onClick={t.toggle} style={{width: '48px', height: '28px', borderRadius: '16px', border: 'none', cursor: 'pointer', position: 'relative', background: t.track, transition: 'background .2s'}}>",

    }

    for old, new in replacements.items():
        if old in content:
            content = content.replace(old, new)
            
    # Remove any extra } at EOF if it's there due to repeated running of my scripts
    while content.endswith("  );\n}\n}\n"):
        content = content[:-2]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.jsx') and not filename.endswith('_raw.jsx'):
        fix_file(os.path.join(pages_dir, filename))
        print(f"Fixed {filename}")
