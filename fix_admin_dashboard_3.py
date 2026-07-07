import os

def fix_admin_dashboard():
    path = 'frontend/src/pages/AdminDashboard.jsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix the cyclic reference
    content = content.replace("const adminName = user.name || user.full_name || adminName;", "const adminName = user.name || user.full_name || 'Admin User';")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_admin_dashboard()
print('Fixed!')
