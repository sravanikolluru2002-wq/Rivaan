import os

def fix_admin(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # AdminDashboard.jsx
    if "AdminDashboard.jsx" in filepath:
        content = content.replace(
            "{ recentActivities.map((a, index) => (\n                    ))}<table",
            "<table"
        )
        content = content.replace(
            "<tbody>\n                  <tr",
            "<tbody>\n                  { recentActivities.map((a, index) => (\n                  <tr"
        )
        content = content.replace(
            "</td>\n                    </tr>\n                  \n                </tbody>",
            "</td>\n                    </tr>\n                  ))}\n                </tbody>"
        )
        content = content.replace(
            "{ recentActivities.map((a, index) => ( ))} <table",
            "<table"
        )
        content = content.replace(
            "<tbody>\n                  { recentActivities.map((a, index) => (\n                  <tr",
            "<tbody>\n                  { recentActivities.map((a, index) => (\n                  <tr"
        )
        
    # AppDashboard.jsx
    if "AppDashboard.jsx" in filepath:
        content = content.replace(
            "transition: 'background'}} .2s>",
            "transition: 'background .2s'}}>"
        )

    # Visits.jsx
    if "Visits.jsx" in filepath:
        content = content.replace("  );\n}\n}", "  );\n}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.jsx') and not filename.endswith('_raw.jsx'):
        fix_admin(os.path.join(pages_dir, filename))
        print(f"Fixed {filename}")
