import os

path = 'frontend/src/pages/DcPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
if "getJson" not in content:
    content = content.replace(
        'import { loadSession } from "../lib/auth";',
        'import { loadSession, getJson } from "../lib/auth";'
    )

# 2. Inject state and fetching inside DcPage
fetch_injection = '''
      let agentDataStr = "";
      if (title.includes("Agent")) {
        try {
          const session = loadSession();
          if (session?.access_token) {
            const [dashboard, leads, bookings, visits] = await Promise.all([
              getJson('/api/agent/dashboard', session.access_token).catch(()=>null),
              getJson('/api/crm/leads', session.access_token).catch(()=>[]),
              getJson('/api/agent/bookings', session.access_token).catch(()=>[]),
              getJson('/api/agent/site-visits', session.access_token).catch(()=>[]),
            ]);
            agentDataStr = `<script>
              window.__AGENT_DATA = {
                dashboard: ${JSON.stringify(dashboard)},
                leads: ${JSON.stringify(leads)},
                bookings: ${JSON.stringify(bookings)},
                visits: ${JSON.stringify(visits)}
              };
            </script>`;
          }
        } catch (e) { console.error("Agent fetch err", e); }
      }
'''
content = content.replace(
    'const sourceDoc = new DOMParser().parseFromString(html, "text/html");',
    fetch_injection + '\n      const sourceDoc = new DOMParser().parseFromString(html, "text/html");'
)

content = content.replace(
    'host.innerHTML = bodyMarkup;',
    'host.innerHTML = agentDataStr + bodyMarkup;'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("DcPage replaced!")
