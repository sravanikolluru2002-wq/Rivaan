import os
import re

path = 'frontend/src/pages/AdminDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
if "getJson" not in content:
    content = content.replace(
        "import { loadSession, clearSession } from '../lib/auth';",
        "import { loadSession, clearSession, getJson } from '../lib/auth';"
    )

# 2. Add state inside AdminDashboard component
# We find where `const adminName = ...` is
state_injection = '''
  const [adminStats, setAdminStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminAudit, setAdminAudit] = useState([]);
  const [adminProperties, setAdminProperties] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session?.access_token) return;
        
        // Parallel fetching
        const [statsData, usersData, auditData, propsData] = await Promise.all([
          getJson('/api/admin/stats', session.access_token).catch(() => null),
          getJson('/api/admin/users', session.access_token).catch(() => []),
          getJson('/api/admin/audit-logs', session.access_token).catch(() => []),
          getJson('/api/admin/properties', session.access_token).catch(() => []),
        ]);
        
        setAdminStats(statsData);
        setAdminUsers(usersData);
        setAdminAudit(auditData);
        setAdminProperties(propsData);
        
      } catch (err) {
        console.error("Admin fetch error", err);
      }
    };
    fetchData();
  }, [session]);

'''

content = content.replace(
    "const initials = adminName.substring(0, 2).toUpperCase();",
    "const initials = adminName.substring(0, 2).toUpperCase();\n" + state_injection
)

# 3. Replace KPIs
kpis_def = '''  const kpis = [
    { title: 'Total Revenue', value: '?4.2 Cr', trend: '+12.5%', isUp: true },
    { title: 'Total Sales', value: '184', trend: '+8.2%', isUp: true },
    { title: 'Active Projects', value: '12', trend: 'Stable', isUp: true },
    { title: 'Total Agents', value: '45', trend: '+2 New', isUp: true },
  ];'''

kpis_rep = '''  const kpis = [
    { title: 'Total Revenue', value: adminStats?.total_revenue ? `?${(adminStats.total_revenue / 10000000).toFixed(1)} Cr` : '?4.2 Cr', trend: '+12.5%', isUp: true },
    { title: 'Total Bookings', value: adminStats?.total_bookings || '184', trend: '+8.2%', isUp: true },
    { title: 'Active Plots', value: adminStats?.total_plots || '12', trend: 'Stable', isUp: true },
    { title: 'Total Agents', value: adminStats?.total_agents || '45', trend: '+2 New', isUp: true },
  ];'''
content = content.replace(kpis_def, kpis_rep)

# 4. Replace Users table (line 207 inside USERS section)
# We find the 'users: { title: 'User Management'' section
users_pattern = re.compile(r"users: \{ title: 'User Management', cols: \['Name', 'Role', 'Email', 'Phone', 'Status', 'Joined'\], rows: \[\s*\[cC\('Ananya Sharma'.*?\]\}\,", re.DOTALL)

users_rep = '''users: { title: 'User Management', cols: ['Name', 'Role', 'Email', 'Phone', 'Status', 'Joined'], rows: adminUsers.map(u => [
      cC(u.name || 'Unknown', 1),
      cC(u.role || 'Customer'),
      cC(u.email || 'N/A'),
      cC(u.phone || 'N/A'),
      cP(u.status || 'active', u.status === 'active' ? 'success' : 'warn'),
      cC(new Date(u.created_at || Date.now()).toLocaleDateString())
    ])},'''

content = re.sub(users_pattern, users_rep, content)

# 5. Replace Audit Logs
audit_pattern = re.compile(r"audit: \{ title: 'Audit Logs', cols: \['Date', 'Time', 'Action', 'User', 'Status'\], rows: \[.*?\]\},", re.DOTALL)
audit_rep = '''audit: { title: 'Audit Logs', cols: ['Date', 'Time', 'Action', 'User', 'Status'], rows: adminAudit.slice(0, 50).map(a => {
      const d = new Date(a.created_at || Date.now());
      return [
        cC(d.toLocaleDateString()),
        cC(d.toLocaleTimeString()),
        cC(a.action || 'Action', 1),
        cC(a.user_id || 'System'),
        cP(a.status || 'Success', 'success')
      ];
    })},'''
content = re.sub(audit_pattern, audit_rep, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Admin replaced!")
