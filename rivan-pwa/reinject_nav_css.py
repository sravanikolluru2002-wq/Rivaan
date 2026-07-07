import re, glob

# Extract NAV_CSS from restore_nav.py
with open('restore_nav.py', 'r', encoding='utf-8') as f:
    restore_code = f.read()
    
nav_css_match = re.search(r'NAV_CSS = """(.*?)"""', restore_code, re.DOTALL)
if not nav_css_match:
    print("Could not find NAV_CSS")
    exit(1)

nav_css = nav_css_match.group(1)

files = ['Rivan App.dc.html', 'Rivan Visits.dc.html', 'Rivan My Lands.dc.html']
for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()
    
    if '.rv-nav {' in html:
        print(f"{fname} already has nav CSS")
        continue
        
    html = html.replace('</style>', nav_css + '\n</style>')
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"Injected NAV_CSS into {fname}")
