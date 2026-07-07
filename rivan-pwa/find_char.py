with open('src/pages/MyLands.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

print("MyLands 68200-68300:")
print(repr(c[68200:68300]))

with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

print("Admin 47000-47050:")
print(repr(c[46950:47050]))
