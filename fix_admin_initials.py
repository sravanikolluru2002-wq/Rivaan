import os

path = 'frontend/src/pages/AdminDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const adminName = user.name || user.full_name || 'Admin User';",
    "const adminName = user.name || user.full_name || 'Admin User';\n  const initials = adminName.substring(0, 2).toUpperCase();"
)

content = content.replace(">AU<", ">{initials}<")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
