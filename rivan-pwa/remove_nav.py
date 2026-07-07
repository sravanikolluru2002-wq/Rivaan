"""
Remove bottom nav bars from Rivan Visits and Rivan My Lands .dc.html files.
Also fix scrollPad in their JS.
"""
import re, glob

def remove_bottom_nav(content):
    """Remove any bottom nav sc-if block"""
    # Remove <!-- BOTTOM NAV --> wrapped sc-if block
    content = re.sub(
        r'\s*<!-- BOTTOM NAV -->\s*<sc-if[^>]*>.*?</sc-if>',
        '',
        content, flags=re.DOTALL
    )
    # Fix padding-bottom templated value to fixed 24px
    content = content.replace('padding-bottom:{{ scrollPad }}', 'padding-bottom:24px')
    return content

for fname in glob.glob('*.dc.html'):
    with open(fname, encoding='utf-8') as f:
        html = f.read()
    
    original_len = len(html)
    html = remove_bottom_nav(html)
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(html)
    
    removed = original_len - len(html)
    print(f"{fname}: removed {removed} chars")

print("Done.")
