import re

def fix_duplicate_nav(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()

    # Find all occurrences of <!-- ===================== MAIN NAV ===================== -->
    parts = html.split('<!-- ===================== MAIN NAV ===================== -->')
    
    if len(parts) > 2:
        # Keep the first part and the second part (which is the first nav), 
        # but remove the third part (the second nav) up to </nav>
        
        first_nav = parts[1]
        second_nav_and_rest = parts[2]
        
        # Remove everything up to the first </nav> in the second_nav_and_rest
        rest = re.sub(r'^.*?</nav>\s*', '', second_nav_and_rest, flags=re.DOTALL)
        
        new_html = parts[0] + '<!-- ===================== MAIN NAV ===================== -->' + first_nav + rest
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Fixed duplicates in {filename}")
    else:
        print(f"No duplicate nav found in {filename}")

fix_duplicate_nav('Rivan Visits.dc.html')
fix_duplicate_nav('Rivan My Lands.dc.html')
