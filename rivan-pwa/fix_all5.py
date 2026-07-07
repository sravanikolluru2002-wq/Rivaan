import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # AppDashboard.jsx specific fixes
    content = content.replace(
        '<div style={height}:96px;background:f.grad;position:relative>',
        '<div style={{height: \'96px\', background: f.grad, position: \'relative\'}}>'
    )
    
    # Check if there are any remaining <sc-for>
    content = re.sub(
        r'<sc-for list="\{?\{?([^}]+)\}?\}?" as="([^"]+)"[^>]*>',
        r'{ \1.map((\2, index) => (',
        content
    )
    content = content.replace('</sc-for>', '))} ')

    # Visits.jsx specific - sometimes `))}` without being inside `{...}`? No, if it was inside `{...}`, then it's fine.
    # What if there's a stray <sc-if ...> ?
    content = re.sub(
        r'<sc-if value="\{?\{?([^}]+)\}?\}?"[^>]*>',
        r'{ \1 && (',
        content
    )
    content = content.replace('</sc-if>', ')} ')

    # Fix generic Icon style if it is broken
    content = content.replace('dY"? {f.tag}', '{f.tag}')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.jsx'):
        fix_file(os.path.join(pages_dir, filename))
        print(f"Fixed {filename}")
