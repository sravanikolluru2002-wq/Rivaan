import re

# 1. Visits.jsx (remove the extra )} I added)
with open('src/pages/Visits.jsx', 'r', encoding='utf-8') as f: c = f.read()
c = c.replace(")}\n\n        {showNav && (", "{showNav && (")
with open('src/pages/Visits.jsx', 'w', encoding='utf-8') as f: f.write(c)

# 2. MyLands.jsx (fix expected } but found ;)
with open('src/pages/MyLands.jsx', 'r', encoding='utf-8') as f: c = f.read()
if c.endswith("  );\n"):
    c += "}\n"
elif c.endswith("  );\n;"):
    c = c[:-1] + "}\n"
elif c.endswith("  );\n}\n"):
    pass
else:
    # Just ensure it ends with ); }
    c = re.sub(r'\s*\);\s*$', '\n  );\n}\n', c)
with open('src/pages/MyLands.jsx', 'w', encoding='utf-8') as f: f.write(c)

# 3. AdminDashboard.jsx (fix auditLogs map)
with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f: c = f.read()
c = c.replace("{ auditLogs.map((l, index) => (\n                  ))}<table", "<table")
c = c.replace("<tbody>\n                <tr", "<tbody>\n                { auditLogs.map((l, index) => (\n                <tr")
c = c.replace("</td>\n                  </tr>\n                \n              </tbody>", "</td>\n                  </tr>\n                ))}\n              </tbody>")
with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f: f.write(c)

# 4. AppDashboard.jsx
with open('src/pages/AppDashboard.jsx', 'r', encoding='utf-8') as f: c = f.read()
# Let's remove the <> </> I added
c = c.replace("return (\n    <>\n      <div className=\"app-container\">", "return (\n      <div className=\"app-container\">")
c = c.replace("    </>\n  );\n}", "  );\n}")
# Check where the adjacent element is.
# Maybe I should just check the EOF of AppDashboard.jsx
# Wait, maybe there's a missing </div> or extra </div> somewhere?
# Let's just wrap the entire return in a single <div>
c = re.sub(r'return \(\s*<div className="app-container">', r'return (\n<div className="app-container">', c)

with open('src/pages/AppDashboard.jsx', 'w', encoding='utf-8') as f: f.write(c)

