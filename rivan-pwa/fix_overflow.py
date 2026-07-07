import glob

for fname in ['Rivan Visits.dc.html', 'Rivan My Lands.dc.html']:
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()
    
    html = html.replace('overflow-x: hidden;\n    overflow-y: auto;', 'overflow: hidden;')
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Fixed overflow in {fname}")
