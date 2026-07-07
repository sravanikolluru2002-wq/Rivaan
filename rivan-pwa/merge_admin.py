import re

with open('src/pages/AdminDashboard_raw.jsx', 'r', encoding='utf-8') as f:
    raw = f.read()

m = re.search(r'(<main.*?.*?</main>)', raw, re.DOTALL | re.IGNORECASE)
if m:
    main_content = m.group(1)
    
    with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f2:
        app = f2.read()
    
    app_new = app.replace('{/* REPLACE_ME */}', main_content.replace('\\', '\\\\'))
    
    with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f3:
        f3.write(app_new)
    print("Merged AdminDashboard_raw.jsx into AdminDashboard.jsx")
else:
    print("Could not find <main> content in raw")
