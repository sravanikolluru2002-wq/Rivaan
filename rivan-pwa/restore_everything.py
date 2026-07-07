import os
import re

def css_to_jsx(css_str):
    parts = [p.strip() for p in css_str.split(';') if p.strip()]
    obj = []
    # All lowercase keys get camelCased.
    # Values with dots are treated as JS expressions unless it's just a decimal (like .2s).
    for p in parts:
        if ':' not in p: continue
        k, v = p.split(':', 1)
        k = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k.strip())
        v = v.strip()
        
        is_var = False
        # If it's something like sel.grad, v.cdBg, statusColor etc.
        if '.' in v and not re.search(r'\d', v):
            is_var = True
        if v in ['statusColor']:
            is_var = True
            
        # Exceptions
        if 'rgba' in v or 'px' in v or '%' in v or 'url(' in v or '#' in v or v == 'none' or v == 'transparent' or v == 'flex' or v == 'center' or v == 'collapse' or v == 'inherit':
            is_var = False
            
        if is_var:
            obj.append(f"{k}: {v}")
        else:
            obj.append(f"{k}: '{v}'")
            
    return "{{" + ", ".join(obj) + "}}"

pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('_raw.jsx'):
        dest = filename.replace('_raw.jsx', '.jsx')
        with open(os.path.join(pages_dir, filename), 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix 1: HTML Comments
        content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', content)
        
        # Fix 2: style={'key': 'val'} -> style={{'key': 'val'}}
        content = re.sub(r'style=\{([^\}\{]+?:[^\}\{]+?)\}', r'style={{\1}}', content)

        # Fix 3: onclick="{func}" -> onClick={func}
        content = re.sub(r'onclick="\{([^\}]+)\}"', r'onClick={\1}', content)
        content = re.sub(r'onclick="([^"]+)"', r'onClick={\1}', content)
        content = re.sub(r'onClick="\{([^\}]+)\}"', r'onClick={\1}', content)

        # Fix 4: &amp;&amp; -> &&
        content = content.replace('&amp;&amp;', '&&').replace('&&amp;', '&&').replace('&amp;', '&')

        # Fix 5: style=t.style -> style={t.style}
        content = re.sub(r'style=([a-zA-Z0-9_\.]+)', r'style={\1}', content)
        
        # Fix 6: / /> -> />
        content = content.replace('/ />', '/>')
        
        # Fix 7: <sc-for> and <sc-if>
        content = re.sub(r'<sc-for list="\{?\{?([^}]+)\}?\}?" as="([^"]+)"[^>]*>', r'{ \1.map((\2, index) => (', content)
        content = content.replace('</sc-for>', '))} ')
        content = re.sub(r'<sc-if value="\{?\{?([^}]+)\}?\}?"[^>]*>', r'{ \1 && (', content)
        content = content.replace('</sc-if>', ')} ')

        # Fix 8: style={width}:... -> css_to_jsx
        def style_replacer(m):
            k = m.group(1)
            rest = m.group(2)
            # if rest contains `{...}` we should not parse it like this
            if '{' in rest: return m.group(0)
            return f"style={css_to_jsx(k + ':' + rest)}"
            
        content = re.sub(r'style=\{([a-zA-Z0-9\-]+)\}:([^>]*?)(?=\s+[a-zA-Z0-9\-]+=|>)', style_replacer, content)

        # Fix AdminDashboard specific
        if "AdminDashboard.jsx" in dest:
            content = content.replace("{ recentActivities.map((a, index) => (\n                    ))}<table", "<table")
            content = content.replace("<tbody>\n                  <tr", "<tbody>\n                  { recentActivities.map((a, index) => (\n                  <tr")
            content = content.replace("</td>\n                    </tr>\n                  \n                </tbody>", "</td>\n                    </tr>\n                  ))}\n                </tbody>")

        with open(os.path.join(pages_dir, dest), 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Restored and fixed {dest}")
