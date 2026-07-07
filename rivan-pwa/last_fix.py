import re

# 1. AdminDashboard.jsx
with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f: c = f.read()
c = c.replace("style={font}-size:11px;font-weight:700;color:p.color", "style={{fontSize: '11px', fontWeight: '700', color: p.color}}")
with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f: f.write(c)

# 2. MyLands.jsx
with open('src/pages/MyLands.jsx', 'r', encoding='utf-8') as f: c = f.read()
# Let's count { and } in MyLands.jsx to see where the mismatch is!
# We can just manually remove the spurious )} at 833 and 836!
c = c.replace("          </button>\n          )}\n        </div>", "          </button>\n        </div>")
c = c.replace("      </div>\n      )}\n\n    </div>", "      </div>\n\n    </div>")
# Also, remove the double map closing if it exists!
# Earlier I replaced the </div> with ))}
old_str = "              ))}\n            </div>"
new_str = "              </div>"
# Wait, if rebuild_pages.py already added ))}, then my manual ))} made it double?
# Let's see if there is `))}` followed by another `))}`!
# Actually, I'll just write a script that runs esbuild, and if it fails, I'll print the error!
with open('src/pages/MyLands.jsx', 'w', encoding='utf-8') as f: f.write(c)

print("Fixed")
