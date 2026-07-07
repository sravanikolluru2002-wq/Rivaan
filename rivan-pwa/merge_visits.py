import re

with open('src/pages/Visits_raw.jsx', 'r', encoding='utf-8') as f:
    raw = f.read()

m = re.search(r'<div className="rv-scroll"[^>]*>(.*)</div>\s*<nav', raw, re.DOTALL)
if not m:
    m = re.search(r'<div className="rv-scroll"[^>]*>(.*)</div>\s*<div', raw, re.DOTALL)

if m:
    scroll_content = m.group(1)
    # the nav is separate from the scroll content in raw HTML. Let's make sure it matches.
    # In Visits.dc.html, there is <div class="rv-scroll"...>...</div> then <nav ...> then <sc-if value="{{ showCancel }}">...
    # So rv-scroll closes, then nav, then cancel modal.
    # We want to grab everything inside <div className="rv-scroll"...> ... </div>
    
    with open('src/pages/Visits.jsx', 'r', encoding='utf-8') as f2:
        app = f2.read()
    
    app_new = re.sub(
        r'(<div className=\{`rv-scroll \$\{showNav \? \'with-nav\' : \'\'\}`\} style=\{\{ position: \'absolute\', inset: \'0\', overflowY: \'auto\' \}\}>).*?(</div\>\s*\{showNav && \()',
        r'\1\n' + scroll_content.replace('\\', '\\\\') + r'\n\2',
        app,
        flags=re.DOTALL
    )
    
    with open('src/pages/Visits.jsx', 'w', encoding='utf-8') as f3:
        f3.write(app_new)
    print("Merged Visits_raw.jsx into Visits.jsx")
else:
    print("Could not find rv-scroll content in raw")
