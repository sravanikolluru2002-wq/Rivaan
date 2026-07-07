import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = {
        "<p style={{margin: '5px'}} 0 0;font-size:14px;font-weight:700;color:p.color>{p.v}</p>":
            "<p style={{margin: '5px 0 0', fontSize: '14px', fontWeight: '700', color: p.color}}>{p.v}</p>",
            
        "<div style={{display: 'flex', gap: '13px', background: 'n.bg', borderRadius: '16px', padding: '15px', border: '1px'}} solid #eef3ec>":
            "<div style={{display: 'flex', gap: '13px', background: n.bg, borderRadius: '16px', padding: '15px', border: '1px solid #eef3ec'}}>",

        "<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px'}} 0;border-top:p.border>":
            "<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderTop: p.border}}>",

        "<span style={{width: '24px', height: '24px', borderRadius: '50%', background: tl.dotBg, border: '2px'}} solid tl.dotBorder;display:flex;align-items:center;justify-content:center;flex:none>":
            "<span style={{width: '24px', height: '24px', borderRadius: '50%', background: tl.dotBg, border: `2px solid ${tl.dotBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>",
            
        # Additional potential missing ones if we were unlucky
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
