import os
import re

def fix_public():
    path = 'frontend/public/Rivan Login.dc.html'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove google/facebook icons and continue with divider
    content = re.sub(r"<div[^>]*>\s*<span[^>]*></span>\s*<span[^>]*>or continue with</span>\s*<span[^>]*></span>\s*</div>\s*<div[^>]*>\s*<button[^>]*>G</button>\s*<button[^>]*></button>\s*<button[^>]*>f</button>\s*</div>", "", content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_public()
print('Fixed public!')
