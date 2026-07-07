import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix HTML comments <!-- ... --> to {/* ... */}
    content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', content)
    
    # Fix style={'key': 'val'} to style={{'key': 'val'}}
    # We find style={...} where it doesn't start with {{ and ends with }
    # Since we are using python, let's just do a string replacement if it matches the specific pattern
    # It seems to be produced as style={'something': 'something'}
    content = re.sub(r'style=\{([^\}\{]+?:[^\}\{]+?)\}', r'style={{\1}}', content)

    # Also fix onclick="{openSide}" to onClick={openSide}
    content = re.sub(r'onclick="\{([^\}]+)\}"', r'onClick={\1}', content)
    # Also for any other onclick="{...}"
    content = re.sub(r'onclick="([^"]+)"', r'onClick={\1}', content)
    
    # Also if there's any onClick="{...}"
    content = re.sub(r'onClick="\{([^\}]+)\}"', r'onClick={\1}', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.jsx'):
        fix_file(os.path.join(pages_dir, filename))
        print(f"Fixed {filename}")
