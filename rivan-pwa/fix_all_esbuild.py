import re

with open('src/pages/MyLands.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('  const sel = selData;\n', '')
c = c.replace('  const cat = catData;\n', '')

# Remove extra ))} which is causing the Expected ")" but found "style" error
# The original error was: Expected ")" but found "style" on <button style={{...}}>
# This means esbuild parsed `))}` and closed the `isLands && (` block early!
# Wait, if `))}` closed `isLands && (`, then the button is outside the block and the parser sees `<button ...>` and thinks it's a new statement, but it's inside `return ( <>` ... wait, `isLands && (` is INSIDE `return ( <>`.
# Let's just remove the first `))}` right before `<button style=`
c = c.replace("              ))}\n            </div>\n          </div>\n          <button style={{", "            </div>\n          </div>\n          <button style={{")

with open('src/pages/MyLands.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix the Unexpected token at 47014 which was because I still didn't fix `style={font}-size:11px` ?
# Wait, I ran a script to fix that, but maybe it didn't match!
# Let's replace it explicitly
c = c.replace("style={font}-size:11px;font-weight:700;color:p.color", "style={{fontSize: '11px', fontWeight: '700', color: p.color}}")

with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
