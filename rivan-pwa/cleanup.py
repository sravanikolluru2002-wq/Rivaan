import re

# Read the broken file
with open('Rivan Login.dc.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Define the start and end of the broken agent block
start_marker = "      <!-- ===== AGENT LOGIN ===== -->"
# Find the start
start_idx = html.find(start_marker)
if start_idx != -1:
    # Find the next email field block to know where the agent block ends
    # The agent block was the top half of isLogin, ending at </div>\n        </sc-if>\n
    # Next comes the email field of the ORIGINAL login block:
    end_marker = "        <!-- email field -->\n        <sc-if value=\"{{ isEmailMethod }}\""
    end_idx = html.find(end_marker, start_idx)
    
    if end_idx != -1:
        # Remove the broken block
        html = html[:start_idx] + html[end_idx:]

with open('Rivan Login.dc.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Cleaned up broken agent block.")
