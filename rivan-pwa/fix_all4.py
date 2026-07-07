import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix style=t.style to style={t.style}
    content = re.sub(r'style=([a-zA-Z0-9_\.]+)', r'style={\1}', content)
    
    # Fix / /> to />
    content = content.replace('/ />', '/>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.jsx'):
        fix_file(os.path.join(pages_dir, filename))
        print(f"Fixed {filename}")
