import sys

def check_brackets(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    open_brace = content.count('{')
    close_brace = content.count('}')
    open_paren = content.count('(')
    close_paren = content.count(')')
    
    print(f"File: {filepath}")
    print(f"  {{: {open_brace}, }}: {close_brace}")
    print(f"  (: {open_paren}, ): {close_paren}")
    
    # Let's also check for unbalanced JSX tags
    # A simple tag stack
    import re
    tags = re.findall(r'<\/?([a-zA-Z0-9]+)[^>]*>', content)
    stack = []
    for tag in tags:
        # ignore self closing
        if tag in ['img', 'input', 'br', 'hr', 'path']: continue
        # but wait, the regex above captures just the tag name
        pass # too complex to do perfectly here

check_brackets('src/pages/Visits.jsx')
