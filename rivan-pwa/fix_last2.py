import os

def fix_all():
    # 1. AgentDashboard.jsx
    f = 'src/pages/AgentDashboard.jsx'
    with open(f, 'r', encoding='utf-8') as file: c = file.read()
    c = c.replace("  );\n}\n}\n", "  );\n}\n")
    with open(f, 'w', encoding='utf-8') as file: file.write(c)

    # 2. Login.jsx
    f = 'src/pages/Login.jsx'
    with open(f, 'r', encoding='utf-8') as file: c = file.read()
    while c.endswith("}\n}\n"):
        c = c[:-3] + "\n"
    with open(f, 'w', encoding='utf-8') as file: file.write(c)

    # 3. Visits.jsx
    f = 'src/pages/Visits.jsx'
    with open(f, 'r', encoding='utf-8') as file: c = file.read()
    c = c.replace("{showNav && (", ")}\n\n        {showNav && (")
    # Also clean EOF
    while c.endswith("}\n}\n"):
        c = c[:-3] + "\n"
    with open(f, 'w', encoding='utf-8') as file: file.write(c)

    # 4. AdminDashboard.jsx
    f = 'src/pages/AdminDashboard.jsx'
    with open(f, 'r', encoding='utf-8') as file: c = file.read()
    c = c.replace("<div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '13px'}} 0;border-top:s.border>", "<div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 0', borderTop: s.border}}>")
    with open(f, 'w', encoding='utf-8') as file: file.write(c)

    # 5. AppDashboard.jsx
    f = 'src/pages/AppDashboard.jsx'
    with open(f, 'r', encoding='utf-8') as file: c = file.read()
    c = c.replace("<button style={{width: '100%', display: 'flex', alignItems: 'center', gap: '13px', padding: '15px'}} 18px;border:none;background:transparent;cursor:pointer;font-family:inherit;border-top:s.border>", "<button style={{width: '100%', display: 'flex', alignItems: 'center', gap: '13px', padding: '15px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', borderTop: s.border}}>")
    c = c.replace("<br>", "<br/>")
    if "  );\n}\n;" in c:
        c = c.replace("  );\n}\n;", "  );\n}\n")
    # fix end of file if it has ; instead of }
    if c.endswith(";"):
        c = c[:-1] + "}"
    # Wait, error was "Expected } but found ;" at 997:4. 
    # Maybe it was  );\n};
    c = c.replace("  );\n};", "  );\n}")
    with open(f, 'w', encoding='utf-8') as file: file.write(c)

    # 6. MyLands.jsx
    f = 'src/pages/MyLands.jsx'
    with open(f, 'r', encoding='utf-8') as file: c = file.read()
    old_my_lands = '''                  <div style={{flex: '1', paddingBottom: tl.pad}}>
                    <p style={{margin: '0', fontSize: '13.5px', fontWeight: '700', color: tl.titleColor}}>{tl.title}</p>
                    <p style={{margin: '3px 0 0', fontSize: '11.5px', color: tl.dateColor, fontWeight: '600'}}>{tl.date}</p>
                  </div>
                </div>
            </div>'''
    new_my_lands = '''                  <div style={{flex: '1', paddingBottom: tl.pad}}>
                    <p style={{margin: '0', fontSize: '13.5px', fontWeight: '700', color: tl.titleColor}}>{tl.title}</p>
                    <p style={{margin: '3px 0 0', fontSize: '11.5px', color: tl.dateColor, fontWeight: '600'}}>{tl.date}</p>
                  </div>
                </div>
              ))}
            </div>'''
    c = c.replace(old_my_lands, new_my_lands)
    with open(f, 'w', encoding='utf-8') as file: file.write(c)
    
fix_all()
print("Done")
