import re

def find_block(html, start_comment):
    start_idx = html.find(start_comment)
    if start_idx == -1:
        return None
    
    sc_if_start = html.find('<sc-if', start_idx)
    if sc_if_start == -1:
        return None
    
    depth = 0
    idx = sc_if_start
    while idx < len(html):
        if html.startswith('<sc-if', idx):
            depth += 1
            idx += 6
        elif html.startswith('</sc-if>', idx):
            depth -= 1
            idx += 8
            if depth == 0:
                return html[start_idx:idx]
        else:
            idx += 1
    return None

with open('Rivan Login.dc.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add "Agent Login" button to splash screen (only if not already there, but we already added it in the first script, let's make sure we don't duplicate it)
# wait, the first script replaced Explore as Guest with both buttons.
new_button = """
          <button onClick="{{ goAgentLogin }}" style="width:100%;height:58px;border:1.5px solid rgba(255,255,255,.35);border-radius:18px;background:rgba(255,255,255,.08);color:#eaf2e6;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer">Agent Login</button>
"""
if 'goAgentLogin' not in html[:html.find('===== LOGIN =====')]: # search only in the splash area
    html = html.replace('Explore as Guest</button>', 'Explore as Guest</button>' + new_button)

# 2. Extract the login block, modify it for Agent Login, and insert it
original_login = find_block(html, '<!-- ===== LOGIN ===== -->')
if original_login:
    agent_login = original_login.replace('===== LOGIN =====', '===== AGENT LOGIN =====')
    agent_login = agent_login.replace('value="{{ isLogin }}"', 'value="{{ isAgentLogin }}"')
    agent_login = agent_login.replace('Welcome back 👋', 'Agent Portal')
    agent_login = agent_login.replace('Sign in to continue with Rivan Reality', 'Sign in as a Rivan Agent')
    agent_login = agent_login.replace('onClick="{{ loginContinue }}"', 'onClick="{{ goAgentDash }}"')
    agent_login = agent_login.replace('{{ loginBtnLabel }}', 'Access Dashboard')
    
    html = html.replace(original_login, original_login + '\n\n      ' + agent_login)
else:
    print("Could not find login block")

# 3. Modify JS to add isAgentLogin, goAgentLogin, and goAgentDash
if "isAgentLogin: screen==='agent_login'" not in html:
    html = html.replace(
        "isLogin: screen==='login', isOtp: screen==='otp',",
        "isLogin: screen==='login', isAgentLogin: screen==='agent_login', isOtp: screen==='otp',"
    )
if "goAgentLogin:()=>this.set('agent_login')" not in html:
    html = html.replace(
        "goSplash:()=>this.set('splash'), goLogin:()=>this.set('login'),",
        "goSplash:()=>this.set('splash'), goLogin:()=>this.set('login'), goAgentLogin:()=>this.set('agent_login'), goAgentDash:()=>{ window.location.href='Rivan%20Agent%20Dashboard.html'; },"
    )

with open('Rivan Login.dc.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Patch applied successfully!")
