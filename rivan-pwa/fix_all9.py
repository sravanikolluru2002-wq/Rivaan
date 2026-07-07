import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = {
        "style={{display: 'flex', alignItems: 'center', gap: '9px', background: sel.cdBg, borderRadius: '14px', padding: '12px'}} 14px;margin-bottom:16px>":
            "style={{display: 'flex', alignItems: 'center', gap: '9px', background: sel.cdBg, borderRadius: '14px', padding: '12px 14px', marginBottom: '16px'}}>",
            
        "style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '11px'}} 0;border-top:b.border>":
            "style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderTop: b.border}}>",

        "style={{position: 'absolute', top: '3px', left: cz.a1knob, width: '22px', height: '22px', borderRadius: '50%', background: '#fff', boxShadow: '0'}} 2px 5px rgba(0,0,0,.2)>":
            "style={{position: 'absolute', top: '3px', left: cz.a1knob, width: '22px', height: '22px', borderRadius: '50%', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,.2)'}}>",
            
        "style={{position: 'absolute', top: '3px', left: cz.a2knob, width: '22px', height: '22px', borderRadius: '50%', background: '#fff', boxShadow: '0'}} 2px 5px rgba(0,0,0,.2)>":
            "style={{position: 'absolute', top: '3px', left: cz.a2knob, width: '22px', height: '22px', borderRadius: '50%', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,.2)'}}>",

        "style={{width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '15px'}} 18px;border:none;background:transparent;cursor:pointer;font-family:inherit;border-top:i.border>":
            "style={{width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', borderTop: i.border}}>",
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.jsx') and not filename.endswith('_raw.jsx'):
        fix_file(os.path.join(pages_dir, filename))
        print(f"Fixed {filename}")
