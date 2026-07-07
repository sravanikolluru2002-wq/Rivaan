"""
Patch Rivan Login.dc.html to add Agent Login.
"""
import re

with open('Rivan Login.dc.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add "Agent Login" button to splash screen
new_button = """
          <button onClick="{{ goAgentLogin }}" style="width:100%;height:58px;border:1.5px solid rgba(255,255,255,.35);border-radius:18px;background:rgba(255,255,255,.08);color:#eaf2e6;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer">Agent Login</button>
"""
html = html.replace('Explore as Guest</button>', 'Explore as Guest</button>' + new_button)

# 2. Extract the login block, modify it for Agent Login, and insert it after the login block
login_block_match = re.search(r'(<!-- ===== LOGIN ===== -->.*?</sc-if>)', html, re.DOTALL)
if login_block_match:
    original_login = login_block_match.group(1)
    agent_login = original_login.replace('===== LOGIN =====', '===== AGENT LOGIN =====')
    agent_login = agent_login.replace('value="{{ isLogin }}"', 'value="{{ isAgentLogin }}"')
    agent_login = agent_login.replace('Welcome back 👋', 'Agent Portal')
    agent_login = agent_login.replace('Sign in to continue with Rivan Reality', 'Sign in as a Rivan Agent')
    agent_login = agent_login.replace('onClick="{{ loginContinue }}"', 'onClick="{{ goAgentDash }}"')
    agent_login = agent_login.replace('{{ loginBtnLabel }}', 'Access Dashboard')
    
    # insert agent_login after original_login
    html = html.replace(original_login, original_login + '\n\n      ' + agent_login)
else:
    print("Could not find login block")

# 3. Modify JS to add `isAgentLogin`, `goAgentLogin`, and `goAgentDash`
html = html.replace("isLogin: screen==='login', isOtp: screen==='otp',", "isLogin: screen==='login', isAgentLogin: screen==='agent_login', isOtp: screen==='otp',")
html = html.replace("goSplash:()=>this.set('splash'), goLogin:()=>this.set('login'),", "goSplash:()=>this.set('splash'), goLogin:()=>this.set('login'), goAgentLogin:()=>this.set('agent_login'), goAgentDash:()=>{ window.location.href='Rivan%20Agent%20Dashboard.html'; },")

with open('Rivan Login.dc.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Successfully added Agent Login!")
