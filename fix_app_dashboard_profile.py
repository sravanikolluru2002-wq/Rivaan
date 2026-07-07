import os
import re

path = 'frontend/src/pages/AppDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import putJson
content = content.replace(
    "import { loadSession, clearSession } from '../lib/auth';",
    "import { loadSession, clearSession, putJson, saveSession } from '../lib/auth';"
)

# 2. Add state for profile form inside AppDashboard
state_injection = '''
  const [profileForm, setProfileForm] = useState({
    name: user.name || user.full_name || '',
    email: user.email || '',
    address: user.address || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      setProfileSaving(true);
      const res = await putJson('/api/auth/profile', profileForm, session.access_token);
      
      // We must merge the returned user object into the session to persist the change locally
      const updatedUser = { ...session.user, ...res.user, name: profileForm.name, email: profileForm.email, address: profileForm.address };
      const newSession = { ...session, user: updatedUser };
      saveSession(newSession);
      
      // Update local 'user' var for immediate UI update (though a page refresh might be better)
      alert('Profile updated successfully!');
      window.location.reload();
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setProfileSaving(false);
    }
  };
'''
content = content.replace(
    "const [showConfirm, setShowConfirm] = useState(false);",
    "const [showConfirm, setShowConfirm] = useState(false);\n" + state_injection
)

# 3. Replace the static personalFields render
old_personal_render = '''          { personalFields.map((p, index) => (
            <div style={{'marginTop': '15px'}}>
              <label style={{'fontSize': '12.5px', 'fontWeight': '700', 'color': '#3d4f40'}}>{p.label}</label>
              <div style={{'marginTop': '8px', 'display': 'flex', 'alignItems': 'center', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'padding': '0 15px', 'background': '#fbfdfa'}}>
                <input value={p.value} style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
              </div>
            </div>
          ))}
          <button style={{'marginTop': '26px', 'width': '100%', 'height': '56px', 'border': 'none', 'borderRadius': '16px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 14px 26px -12px rgba(18,68,35,.7)'}}>Save Changes</button>'''

new_personal_render = '''          
          <div style={{'marginTop': '15px'}}>
            <label style={{'fontSize': '12.5px', 'fontWeight': '700', 'color': '#3d4f40'}}>Full Name</label>
            <div style={{'marginTop': '8px', 'display': 'flex', 'alignItems': 'center', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'padding': '0 15px', 'background': '#fbfdfa'}}>
              <input name="name" value={profileForm.name} onChange={handleProfileChange} style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
            </div>
          </div>
          <div style={{'marginTop': '15px'}}>
            <label style={{'fontSize': '12.5px', 'fontWeight': '700', 'color': '#3d4f40'}}>Phone Number (Read Only)</label>
            <div style={{'marginTop': '8px', 'display': 'flex', 'alignItems': 'center', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'padding': '0 15px', 'background': '#f0f4ee'}}>
              <input value={user.phone ? '+91 ' + user.phone : 'N/A'} readOnly style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '600', 'color': '#6d7d6f'}}/>
            </div>
          </div>
          <div style={{'marginTop': '15px'}}>
            <label style={{'fontSize': '12.5px', 'fontWeight': '700', 'color': '#3d4f40'}}>Email Address</label>
            <div style={{'marginTop': '8px', 'display': 'flex', 'alignItems': 'center', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'padding': '0 15px', 'background': '#fbfdfa'}}>
              <input name="email" value={profileForm.email} onChange={handleProfileChange} type="email" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
            </div>
          </div>
          <div style={{'marginTop': '15px'}}>
            <label style={{'fontSize': '12.5px', 'fontWeight': '700', 'color': '#3d4f40'}}>Address / City</label>
            <div style={{'marginTop': '8px', 'display': 'flex', 'alignItems': 'center', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'padding': '0 15px', 'background': '#fbfdfa'}}>
              <input name="address" value={profileForm.address} onChange={handleProfileChange} style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
            </div>
          </div>
          
          <button onClick={saveProfile} disabled={profileSaving} style={{'marginTop': '26px', 'width': '100%', 'height': '56px', 'border': 'none', 'borderRadius': '16px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 14px 26px -12px rgba(18,68,35,.7)', 'opacity': profileSaving ? 0.7 : 1}}>{profileSaving ? 'Saving...' : 'Save Changes'}</button>'''

content = content.replace(old_personal_render, new_personal_render)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced!")
