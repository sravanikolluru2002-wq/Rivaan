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
        
        is_var = False
        if '.' in v and not re.search(r'\d', v): is_var = True
        if v in ['statusColor', 'flex', 'center', 'collapse', 'inherit']: is_var = False
        if v in ['statusColor', 'sel.grad', 'sel.cdBg', 'v.cdBg', 'v.grad', 'p.grad', 's.grad', 'svc.grad', 
                 'cz.a1track', 'cz.a1knob', 'cz.a2track', 'cz.a2knob', 'order.grad', 'tl.dotBg', 'tl.dotBorder', 
                 'tl.lineH', 'tl.lineBg', 'tl.titleColor', 'tl.dateColor', 'n.grad', 'm.grad', 'sel.progress', 
                 'm.width', 'p.color', 'p.border', 'r.border', 'f.grad', 'a.border', 'b.border', 't.knob', 't.border', 's.border', 'i.border', 'n.border', 't.track']:
            is_var = True
            
        if 'rgba' in v or 'px' in v or '%' in v or 'url(' in v or '#' in v or v == 'none' or v == 'transparent':
            is_var = False
            
        if is_var: obj.append(f"{k}: {v}")
        else: obj.append(f"{k}: '{v}'")
    return "{{" + ", ".join(obj) + "}}"

pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('_raw.jsx'):
        base = filename.replace('_raw.jsx', '.jsx')
        with open(os.path.join(pages_dir, filename), 'r', encoding='utf-8') as f:
            raw = f.read()

        raw = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', raw)
        raw = re.sub(r'style=\{([^\}\{]+?:[^\}\{]+?)\}', r'style={{\1}}', raw)
        raw = re.sub(r'onclick="\{([^\}]+)\}"', r'onClick={\1}', raw)
        raw = re.sub(r'onclick="([^"]+)"', r'onClick={\1}', raw)
        raw = re.sub(r'onClick="\{([^\}]+)\}"', r'onClick={\1}', raw)
        raw = raw.replace('&amp;&amp;', '&&').replace('&&amp;', '&&').replace('&amp;', '&')
        raw = re.sub(r'style=([a-zA-Z0-9_\.]+)', r'style={\1}', raw)
        raw = raw.replace('/ />', '/>')
        raw = re.sub(r'<sc-for list="\{?\{?([^}]+)\}?\}?" as="([^"]+)"[^>]*>', r'{ \1.map((\2, index) => (', raw)
        raw = raw.replace('</sc-for>', '))} ')
        raw = re.sub(r'<sc-if value="\{?\{?([^}]+)\}?\}?"[^>]*>', r'{ \1 && (', raw)
        raw = raw.replace('</sc-if>', ')} ')

        def style_replacer(m):
            k = m.group(1)
            rest = m.group(2)
            if '{' in rest: return m.group(0)
            return f"style={css_to_jsx(k + ':' + rest)}"
            
        raw = re.sub(r'style=\{([a-zA-Z0-9\-]+)\}:([^>]*?)(?=\s+[a-zA-Z0-9\-]+=|>)', style_replacer, raw)
        
        raw = raw.replace("<br>", "<br/>")

        # Specific fixes
        if "AdminDashboard" in base:
            raw = raw.replace("{ recentActivities.map((a, index) => (\n                    ))}<table", "<table")
            raw = raw.replace("<tbody>\n                  <tr", "<tbody>\n                  { recentActivities.map((a, index) => (\n                  <tr")
            raw = raw.replace("</td>\n                    </tr>\n                  \n                </tbody>", "</td>\n                    </tr>\n                  ))}\n                </tbody>")
            
            raw = raw.replace("{ auditLogs.map((l, index) => (\n                  ))}<table", "<table")
            raw = raw.replace("<tbody>\n                <tr", "<tbody>\n                { auditLogs.map((l, index) => (\n                <tr")
            raw = raw.replace("</td>\n                  </tr>\n                \n              </tbody>", "</td>\n                  </tr>\n                ))}\n              </tbody>")

        # Extract logic from current JS file
        with open(os.path.join(pages_dir, base), 'r', encoding='utf-8') as f:
            cur = f.read()
            
        match = re.search(r'(.*?return \().*', cur, re.DOTALL)
        if match:
            logic = match.group(1)
            # Ensure raw only has the JSX content without export function...
            # Since raw is just the JSX elements, we can just append it
            new_cur = logic + "\n" + raw + "\n  );\n}\n"
            with open(os.path.join(pages_dir, base), 'w', encoding='utf-8') as f:
                f.write(new_cur)
            print(f"Rebuilt {base}")
