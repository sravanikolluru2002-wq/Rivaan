import re

# 1. MyLands.jsx
with open('src/pages/MyLands.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Let's see if there is an extra </div> or if the nav is outside rv-phone
# We will just strip everything from return ( down, and replace it completely with a clean structure
# Actually, I'll just remove the <> </> and wrap the ENTIRE return block in <div className="rv-phone"> ... </div>
# Wait, MyLands.html didn't even have an rv-phone wrapper!
# I will just remove the <div className="rv-phone"> and the extra </div>!
c = c.replace('return (\n    <>\n      <div className="rv-phone">\n', 'return (\n    <>\n')
c = c.replace('</nav>\n\n  </div>\n    </>\n  );\n', '</nav>\n    </>\n  );\n')
with open('src/pages/MyLands.jsx', 'w', encoding='utf-8') as f: f.write(c)


# 2. AdminDashboard.jsx
with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('return (\n    <>\n\n<div className="ad-container">', 'return (\n    <div className="ad-container">')
# wait, if I remove <>, then ad-container is the root!
# But what if there are elements outside ad-container?
# Let's just make <> the absolute root for both.
c = c.replace('return (\n    <div className="ad-container">', 'return (\n    <>\n    <div className="ad-container">')
if '</nav>\n    </>\n  );\n' not in c:
    c = re.sub(r'\s*\);\s*\}\s*$', '\n    </>\n  );\n}\n', c)

# Let's fix the unexpected token at 47014.
# It was around <section style={{'background': '#fff', 'border': '1px solid #e7ede3',
# Maybe there is a missing closing brace?
# Let's just fix AdminDashboard by finding any unclosed { or }
# I'll just let esbuild tell me by running it.
with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f: f.write(c)

print("Fixed")
