import sys
with open('src/pages/Visits.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

depth_brace = 0
depth_paren = 0
for i, line in enumerate(lines):
    depth_brace += line.count('{') - line.count('}')
    depth_paren += line.count('(') - line.count(')')
    if depth_brace < 0 or depth_paren < 0:
        print(f"Line {i+1}: brace={depth_brace}, paren={depth_paren}")

print(f"Final: brace={depth_brace}, paren={depth_paren}")
