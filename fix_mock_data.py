import os
import re

def fix_app_dashboard():
    path = 'frontend/src/pages/AppDashboard.jsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add import
    if 'loadSession' not in content:
        content = content.replace(
            "import { useNavigate } from 'react-router-dom';",
            "import { useNavigate } from 'react-router-dom';\nimport { loadSession } from '../lib/auth';"
        )
    
    # Add session
    if 'const session = loadSession();' not in content:
        content = content.replace(
            "const navigate = useNavigate();",
            "const navigate = useNavigate();\n  const session = loadSession();\n  const user = session?.user || {};"
        )

    # Replace user name and initials
    content = re.sub(
        r"const userName\s*=\s*'Sravani';",
        "const userName = String(user.name || user.full_name || 'Rivan User').split(' ')[0];",
        content
    )
    content = re.sub(
        r"const initials\s*=\s*'SK';",
        "const initials = String(user.name || user.full_name || 'RU').substring(0, 2).toUpperCase();",
        content
    )

    # Replace personal profile values
    content = content.replace("'Sravani K'", "user.name || user.full_name || 'Rivan User'")
    content = content.replace("'+91 98765 43210'", "user.phone ? '+91 ' + user.phone : '+91 98765 43210'")
    content = content.replace("'sravani@gmail.com'", "user.email || 'customer@rivan.com'")
    content = content.replace("sravani@gmail.com", "{user.email || 'customer@rivan.com'}")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_admin_dashboard():
    path = 'frontend/src/pages/AdminDashboard.jsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'loadSession' not in content:
        content = content.replace(
            "import { useNavigate } from 'react-router-dom';",
            "import { useNavigate } from 'react-router-dom';\nimport { loadSession } from '../lib/auth';"
        )
    
    if 'const session = loadSession();' not in content:
        content = content.replace(
            "const navigate = useNavigate();",
            "const navigate = useNavigate();\n  const session = loadSession();\n  const user = session?.user || {};"
        )
    
    content = re.sub(
        r"const adminName\s*=\s*'Admin User';",
        "const adminName = user.name || user.full_name || 'Admin User';",
        content
    )

    # Replace remaining 'Sravani K' in mock lists with generic name
    content = content.replace("Sravani K", "Ananya Sharma")
    content = content.replace("sravani@rivan.com", "ananya@rivan.com")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_other_files():
    files = ['frontend/src/pages/Visits.jsx', 'frontend/src/pages/MyLands.jsx', 'frontend/src/pages/DcPage.tsx']
    for f in files:
        if not os.path.exists(f): continue
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        content = content.replace("Sravani K", "Ananya Sharma")
        content = content.replace("Sravani", "Ananya")
        content = content.replace("sravani@gmail.com", "ananya@gmail.com")
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)

def fix_login_pwa():
    path = 'rivan-pwa/src/pages/Login.jsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove google/facebook icons and continue with divider
    content = re.sub(r"<div[^>]*>\s*<span[^>]*></span>\s*<span[^>]*>or continue with</span>\s*<span[^>]*></span>\s*</div>\s*<div[^>]*>\s*<button[^>]*>G</button>\s*<button[^>]*></button>\s*<button[^>]*>f</button>\s*</div>", "", content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_app_dashboard()
fix_admin_dashboard()
fix_other_files()
fix_login_pwa()
print('Fixed!')
