import re

with open('src/pages/AppDashboard_raw.jsx', 'r', encoding='utf-8') as f:
    raw = f.read()

# find everything inside <div className="rv-scroll" ...> </div>
# In the raw file, it's inside <div className="rv-scroll" ...> ... </div> </div>
# The raw file has:
# <div className="rv-scroll" style={{position:'absolute',inset:'0',overflowY:'auto'}}>
# ...
# </div>
# </div>

m = re.search(r'<div className="rv-scroll"[^>]*>(.*)</div>\s*</div>', raw, re.DOTALL)
if m:
    scroll_content = m.group(1)
    
    with open('src/pages/AppDashboard.jsx', 'r', encoding='utf-8') as f2:
        app = f2.read()
    
    # replace the rv-scroll content in AppDashboard.jsx
    app_new = re.sub(
        r'(<div className=\{`rv-scroll \$\{showNav \? \'with-nav\' : \'\'\}`\} style=\{\{ position: \'absolute\', inset: \'0\', overflowY: \'auto\' \}\}>).*?(</div\>\s*\{showNav && \()',
        r'\1\n' + scroll_content.replace('\\', '\\\\') + r'\n\2',
        app,
        flags=re.DOTALL
    )
    
    with open('src/pages/AppDashboard.jsx', 'w', encoding='utf-8') as f3:
        f3.write(app_new)
    print("Merged AppDashboard_raw.jsx into AppDashboard.jsx")
else:
    print("Could not find rv-scroll content in raw")
