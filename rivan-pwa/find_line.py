def print_line(filename, char_idx):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    current_char = 0
    for i, line in enumerate(lines):
        if current_char <= char_idx < current_char + len(line) + 1:
            print(f"{filename} Line {i+1}:")
            print(f"  {line}")
            col = char_idx - current_char
            print(f"  {' ' * col}^")
            return
        current_char += len(line) + 1 # +1 for \n

print_line('src/pages/AdminDashboard.jsx', 47014)
print_line('src/pages/MyLands.jsx', 68228)
