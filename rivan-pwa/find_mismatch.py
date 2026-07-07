import sys

with open('src/pages/Visits.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.count('{') != line.count('}'):
        print(f"Line {i+1}: {line.strip()}")
