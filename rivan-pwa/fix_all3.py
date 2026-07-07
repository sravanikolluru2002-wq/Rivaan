import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix &amp;&amp; to &&
    content = content.replace('&amp;&amp;', '&&')
    # Or if it's just &amp;
    content = content.replace('&&amp;', '&&')
    content = content.replace('&amp;', '&')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.jsx'):
        fix_file(os.path.join(pages_dir, filename))
        print(f"Fixed {filename}")
