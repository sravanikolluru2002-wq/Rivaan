import sys

with open('src/pages/Visits.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# We want to find the first `{` in JSX that doesn't have a matching `}`.
# Since `{` and `}` are 433 and 432, we know exactly 1 is missing.
# Let's just track the stack of `{`
stack = []
for i, c in enumerate(text):
    if c == '{':
        stack.append(i)
    elif c == '}':
        if stack:
            stack.pop()
        else:
            print("Extra } at", i)

print("Unclosed { at:")
for i in stack:
    # print context
    start = max(0, i-30)
    end = min(len(text), i+30)
    print(f"Index {i}: {text[start:end]}")
