import re

with open('src/pages/MyLands_raw.jsx', 'r', encoding='utf-8') as f:
    raw = f.read()

m = re.search(r'<div className="rv-scroll"[^>]*>(.*)</div>\s*<nav', raw, re.DOTALL)
if not m:
    m = re.search(r'<div className="rv-scroll"[^>]*>(.*)</div>\s*<div', raw, re.DOTALL)
if not m:
    # Just grab everything in the last rv-scroll div closing
    m = re.search(r'<div className="rv-scroll"[^>]*>(.*)</div>\s*</div>\s*</div>\s*$', raw, re.DOTALL)

if m:
    scroll_content = m.group(1)
    
    with open('src/pages/MyLands.jsx', 'r', encoding='utf-8') as f2:
        app = f2.read()
    
    app_new = re.sub(
        r'(<div className=\{`rv-scroll \$\{showNav \? \'with-nav\' : \'\'\}`\} style=\{\{ position: \'absolute\', inset: 0, overflowY: \'auto\' \}\}>).*?(</div\>\s*\{showNav && \()',
        r'\1\n' + scroll_content.replace('\\', '\\\\') + r'\n\2',
        app,
        flags=re.DOTALL
    )
    
    with open('src/pages/MyLands.jsx', 'w', encoding='utf-8') as f3:
        f3.write(app_new)
    print("Merged MyLands_raw.jsx into MyLands.jsx")
else:
    print("Could not find rv-scroll content in raw")
