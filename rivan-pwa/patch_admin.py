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

# 1. Add Admin Login button to splash
new_button = """
          <button onClick="{{ goAdminLogin }}" style="width:100%;height:58px;border:1.5px solid rgba(255,255,255,.35);border-radius:18px;background:rgba(255,255,255,.08);color:#eaf2e6;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer">Admin Login</button>
"""
if 'goAdminLogin' not in html[:html.find('===== LOGIN =====')]:
    html = html.replace('Agent Login</button>', 'Agent Login</button>' + new_button)

# 2. Extract Agent Login block, modify it for Admin Login
agent_login = find_block(html, '<!-- ===== AGENT LOGIN ===== -->')
if agent_login:
    admin_login = agent_login.replace('===== AGENT LOGIN =====', '===== ADMIN LOGIN =====')
    admin_login = admin_login.replace('value="{{ isAgentLogin }}"', 'value="{{ isAdminLogin }}"')
    admin_login = admin_login.replace('Agent Portal', 'Admin Portal')
    admin_login = admin_login.replace('Sign in as a Rivan Agent', 'Sign in as a Rivan Admin')
    admin_login = admin_login.replace('onClick="{{ goAgentDash }}"', 'onClick="{{ goAdminDash }}"')
    
    html = html.replace(agent_login, agent_login + '\n\n      ' + admin_login)
else:
    print("Could not find agent login block")

# 3. Modify JS to add isAdminLogin, goAdminLogin, and goAdminDash
if "isAdminLogin: screen==='admin_login'" not in html:
    html = html.replace(
        "isLogin: screen==='login', isAgentLogin: screen==='agent_login', isOtp: screen==='otp',",
        "isLogin: screen==='login', isAgentLogin: screen==='agent_login', isAdminLogin: screen==='admin_login', isOtp: screen==='otp',"
    )
if "goAdminLogin:()=>this.set('admin_login')" not in html:
    html = html.replace(
        "goSplash:()=>this.set('splash'), goLogin:()=>this.set('login'), goAgentLogin:()=>this.set('agent_login'), goAgentDash:()=>{ window.location.href='Rivan%20Agent%20Dashboard.html'; },",
        "goSplash:()=>this.set('splash'), goLogin:()=>this.set('login'), goAgentLogin:()=>this.set('agent_login'), goAgentDash:()=>{ window.location.href='Rivan%20Agent%20Dashboard.html'; }, goAdminLogin:()=>this.set('admin_login'), goAdminDash:()=>{ window.location.href='Rivan%20Admin%20Dashboard.html'; },"
    )

with open('Rivan Login.dc.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Admin patch applied successfully!")
