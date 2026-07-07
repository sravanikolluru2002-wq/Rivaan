import re

with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Remove everything from <x-dc> up to the first <div className="ad-container"> (or similar)
# Let's search for <div className="ad-container">
match = re.search(r'(<div className="ad-container">.*)', c, re.DOTALL)
if match:
    # also remove the trailing </x-dc> if present
    clean_html = match.group(1)
    if clean_html.endswith('</x-dc>\n'):
        clean_html = clean_html[:-8]
        
    c = re.sub(r'return \(\s*<x-dc>.*?(<div className="ad-container">)', r'return (\n\1', c, flags=re.DOTALL)
    c = c.replace('</x-dc>\n', '')
    c = c.replace('</x-dc>', '')
    
    with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Fixed AdminDashboard")
else:
    print("Could not find ad-container")
