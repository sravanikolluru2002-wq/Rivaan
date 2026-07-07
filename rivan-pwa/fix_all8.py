import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = {
        'style={font}-size:12px;font-weight:700;color:v.cdColor': "style={{fontSize: '12px', fontWeight: '700', color: v.cdColor}}",
        'style={font}-size:13px;font-weight:700;color:sel.cdColor': "style={{fontSize: '13px', fontWeight: '700', color: sel.cdColor}}",
        'style={font}-size:13px;color:s.color;font-weight:700': "style={{fontSize: '13px', color: s.color, fontWeight: '700'}}",
        'style={font}-size:11px;font-weight:700;color:p.color': "style={{fontSize: '11px', fontWeight: '700', color: p.color}}",
        'style={font}-size:11.5px;font-weight:800;color:p.deltaColor': "style={{fontSize: '11.5px', fontWeight: '800', color: p.deltaColor}}",
        
        "style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '11px'}} 0;border-top:a.border>":
            "style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderTop: a.border}}>",
            
        "style={{width: '100%', display: 'flex', alignItems: 'center', gap: '13px', padding: '16px'}} 18px;border:none;background:transparent;cursor:pointer;font-family:inherit;border-top:p.border>":
            "style={{width: '100%', display: 'flex', alignItems: 'center', gap: '13px', padding: '16px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', borderTop: p.border}}>",
            
        "style={{background: 'p.bg', borderRadius: '13px', padding: '14px'}}>":
            "style={{background: p.bg, borderRadius: '13px', padding: '14px'}}>",

        # Wait, the MyLands gap issue from fix_all6 might also be present in AdminDashboard
        # Let's fix AdminDashboard 33645..33646 if it happens again. But we'll run vite build to see.
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
