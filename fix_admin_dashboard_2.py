import os
import re

def fix_admin_dashboard():
    path = 'frontend/src/pages/AdminDashboard.jsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace specific Admin User occurrences
    content = content.replace("['Full Name', 'Admin User']", "['Full Name', adminName]")
    content = content.replace("'admin@rivanrealty.com'", "user.email || 'admin@rivanrealty.com'")
    content = content.replace("'+91 90000 12345'", "user.phone ? '+91 ' + user.phone : '+91 90000 12345'")

    # Optionally replace 'Admin User' in the mock tables to look consistent with logged in user
    content = content.replace("'Admin User'", "adminName")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_admin_dashboard()
print('Fixed!')
