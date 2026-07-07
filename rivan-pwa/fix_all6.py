import os
import re

def css_to_jsx(css_str):
    parts = [p.strip() for p in css_str.split(';') if p.strip()]
    obj = []
    for p in parts:
        if ':' not in p: continue
        k, v = p.split(':', 1)
        k = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k.strip())
        v = v.strip()
        
        # known JS variables in the codebase styles
        js_vars = ['statusColor', 'sel.grad', 'sel.cdBg', 'v.cdBg', 'v.grad', 'p.grad', 's.grad', 'svc.grad', 
                   'cz.a1track', 'cz.a1knob', 'cz.a2track', 'cz.a2knob', 'order.grad', 'tl.dotBg', 'tl.dotBorder', 
                   'tl.lineH', 'tl.lineBg', 'tl.titleColor', 'tl.dateColor', 'n.grad', 'm.grad', 'sel.progress', 
                   'm.width', 'p.color', 'p.border', 'r.border', 'f.grad']
        
        if v in js_vars:
            obj.append(f"{k}: {v}")
        else:
            obj.append(f"{k}: '{v}'")
            
    return "{{" + ", ".join(obj) + "}}"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find style={k}:v...
    # It matches style={some_key}:some_val;other_key:other_val
    def replacer(m):
        k1 = m.group(1)
        rest = m.group(2)
        css_str = f"{k1}:{rest}"
        return f"style={css_to_jsx(css_str)}"

    # We match style={([^}]+)\}:([^\s>]+)
    # The [^\s>]+ matches until a space or > which are closing tags or other attributes
    # But wait, JSX attributes could end with " " or ">".
    content = re.sub(r'style=\{([^}]+)\}:([^\s>]+)', replacer, content)

    # Also there might be style={{'height': '9px'...}}<div style={height}:100%...> where it ends in >
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.jsx') and not filename.endswith('_raw.jsx'):
        fix_file(os.path.join(pages_dir, filename))
        print(f"Fixed {filename}")
