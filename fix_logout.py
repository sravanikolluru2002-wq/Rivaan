import os
import re

def fix_app_dashboard():
    path = 'frontend/src/pages/AppDashboard.jsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Import clearSession
    if 'clearSession' not in content:
        content = content.replace("import { loadSession } from '../lib/auth';", "import { loadSession, clearSession } from '../lib/auth';")

    # Replace null with logout function
    content = content.replace(
        "pm('M15 4h4v16h-4M10 8l-4 4 4 4M6 12h9', 'Logout', null,",
        "pm('M15 4h4v16h-4M10 8l-4 4 4 4M6 12h9', 'Logout', () => { clearSession(); navigate('/login'); },"
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_admin_dashboard():
    path = 'frontend/src/pages/AdminDashboard.jsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'clearSession' not in content:
        content = content.replace("import { loadSession } from '../lib/auth';", "import { loadSession, clearSession } from '../lib/auth';")

    # Replace Logout button
    content = re.sub(
        r"(<button[^>]*>Logout</button>)",
        r"<button onClick={() => { clearSession(); navigate('/login'); }} style={{'height': '42px', 'padding': '0 18px', 'border': '1px solid rgba(255,255,255,.3)', 'borderRadius': '12px', 'background': 'transparent', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '12.5px', 'fontWeight': '700', 'cursor': 'pointer'}}>Logout</button>",
        content
    )
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_agent_dashboard():
    path = 'frontend/public/Rivan Agent Dashboard.dc.html'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add logout to nav function
    content = content.replace(
        "nav(p){ this.setState({ page:p, sideOpen:false }); const el=document.querySelector('.crm-scroll'); }",
        "nav(p){ if(p==='logout'){ localStorage.removeItem('rivan_session'); window.location.href='/login'; return; } this.setState({ page:p, sideOpen:false }); const el=document.querySelector('.crm-scroll'); }"
    )

    # Add logout to NAV array
    content = content.replace(
        "['settings','Settings','M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z',0],",
        "['settings','Settings','M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z',0],\n      ['logout','Logout','M15 4h4v16h-4M10 8l-4 4 4 4M6 12h9',0],"
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_app_dashboard()
fix_admin_dashboard()
fix_agent_dashboard()
print('Logout buttons fixed!')
