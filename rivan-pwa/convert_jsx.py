import re
import sys

def style_to_react(style_str):
    if not style_str.strip():
        return "{}"
    if "{{" in style_str:
        return style_str.replace("{{ ", "").replace(" }}", "")
    parts = style_str.split(';')
    out = []
    for p in parts:
        if ':' in p:
            k, v = p.split(':', 1)
            k = k.strip()
            v = v.strip().replace("'", "\\'")
            # camelCase key
            parts_k = k.split('-')
            k_camel = parts_k[0] + ''.join(x.capitalize() for x in parts_k[1:])
            out.append(f"'{k_camel}': '{v}'")
    return "{{ " + ", ".join(out) + " }}"

def convert_html_to_jsx(html):
    # Self close inputs and imgs if not closed
    html = re.sub(r'<(input|img)([^>]*)>(?!</\1>)', r'<\1\2 />', html)
    html = re.sub(r'/>\s*</(input|img)>', '/>', html)

    # Class -> className
    html = html.replace('class="', 'className="')

    # onclick -> onClick, etc is already mostly onClick in the HTML
    html = re.sub(r'onClick="\{\{\s*(.*?)\s*\}\}"', r'onClick={\1}', html)
    html = re.sub(r'onInput="\{\{\s*(.*?)\s*\}\}"', r'onInput={\1}', html)
    html = re.sub(r'onKeyDown="\{\{\s*(.*?)\s*\}\}"', r'onKeyDown={\1}', html)
    
    # Values
    html = re.sub(r'value="\{\{\s*(.*?)\s*\}\}"', r'value={\1}', html)
    
    # Styles
    def style_replacer(match):
        return 'style=' + style_to_react(match.group(1))
    html = re.sub(r'style="([^"]*)"', style_replacer, html)

    # Dynamic styles
    def style_dynamic(match):
        return 'style={' + match.group(1) + '}'
    html = re.sub(r'style=\{\{\s*(.*?)\s*\}\}', style_dynamic, html)

    # Variables in text or attributes
    html = re.sub(r'\{\{\s*(.*?)\s*\}\}', r'{\1}', html)

    # sc-if
    html = re.sub(r'<sc-if[^>]*value=\{([^}]+)\}[^>]*>', r'{\1 && (', html)
    html = re.sub(r'</sc-if>', r')}', html)

    # sc-for
    html = re.sub(r'<sc-for[^>]*list=\{([^}]+)\}[^>]*as="([^"]+)"[^>]*>', r'{\1.map((\2, index) => (', html)
    html = re.sub(r'</sc-for>', r'))}', html)

    # Fix unescaped entities
    html = html.replace('& ', '&amp; ')

    return html

if __name__ == "__main__":
    import os
    if not os.path.exists('src/pages'):
        os.makedirs('src/pages')
    
    in_file = sys.argv[1]
    out_file = sys.argv[2]

    with open(in_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract DOM
    dom_match = re.search(r'<div class="rv-stage">(.*?)</div>\s*</x-dc>', content, re.DOTALL)
    if dom_match:
        dom = dom_match.group(1)
        jsx = convert_html_to_jsx(dom)
        with open(out_file, 'w', encoding='utf-8') as f:
            f.write(jsx)
            print(f"Wrote {out_file}")
    else:
        # Fallback to whole body if not using DCLogic
        body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL)
        if body_match:
            dom = body_match.group(1)
            jsx = convert_html_to_jsx(dom)
            with open(out_file, 'w', encoding='utf-8') as f:
                f.write(jsx)
                print(f"Wrote {out_file}")
