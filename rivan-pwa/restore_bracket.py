import re

with open('src/pages/MyLands.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add ))} back
c = c.replace(
"""                  <div style={{flex: '1', paddingBottom: tl.pad}}>
                    <p style={{margin: '0', fontSize: '13.5px', fontWeight: '700', color: tl.titleColor}}>{tl.title}</p>
                    <p style={{margin: '3px 0 0', fontSize: '11.5px', color: tl.dateColor, fontWeight: '600'}}>{tl.date}</p>
                  </div>
                </div>
            </div>""",
"""                  <div style={{flex: '1', paddingBottom: tl.pad}}>
                    <p style={{margin: '0', fontSize: '13.5px', fontWeight: '700', color: tl.titleColor}}>{tl.title}</p>
                    <p style={{margin: '3px 0 0', fontSize: '11.5px', color: tl.dateColor, fontWeight: '600'}}>{tl.date}</p>
                  </div>
                </div>
              ))}
            </div>"""
)

with open('src/pages/MyLands.jsx', 'w', encoding='utf-8') as f: f.write(c)
print("Added ))} back")
