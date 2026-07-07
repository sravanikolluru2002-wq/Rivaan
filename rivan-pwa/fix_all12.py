import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = {
        "<p style={{margin: '4px'}} 0 0;font-size:17px;font-weight:800;color:p.color>{p.value}</p>":
            "<p style={{margin: '4px 0 0', fontSize: '17px', fontWeight: '800', color: p.color}}>{p.value}</p>",
            
        "<div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '13px'}} 0;border-top:r.border>":
            "<div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 0', borderTop: r.border}}>",

        "<div style={{display: 'flex', alignItems: 'center', gap: '13px', padding: '15px'}} 18px;border-top:t.border>":
            "<div style={{display: 'flex', alignItems: 'center', gap: '13px', padding: '15px 18px', borderTop: t.border}}>",

        # Fix MyLands missing block
        """                    <span style={{width: '2px', height: tl.lineH, background: tl.lineBg}}></span>
                  
</div>""": 
        """                    <span style={{width: '2px', height: tl.lineH, background: tl.lineBg}}></span>
                  </div>
                  <div style={{flex: '1', paddingBottom: tl.pad}}>
                    <p style={{margin: '0', fontSize: '13.5px', fontWeight: '700', color: tl.titleColor}}>{tl.title}</p>
                    <p style={{margin: '3px 0 0', fontSize: '11.5px', color: tl.dateColor, fontWeight: '600'}}>{tl.date}</p>
                  </div>
                </div>"""
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
