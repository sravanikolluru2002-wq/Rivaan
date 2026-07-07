import os
import re

path = 'frontend/src/pages/AppDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

notifs_def = '''  const notifs = [
    { title: 'Visit Slot Confirmed', body: 'Your Sirpuram Gardens site visit has been confirmed for Saturday 11:00 AM.', time: '2 hours ago', unread: true, icon: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', iconColor: '#e2822a', iconBg: '#fdefe0' },
    { title: 'Property References Ready', body: 'Sirpuram Gardens brochure, map and facing photos are ready to review.', time: 'Yesterday', unread: true, icon: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5', iconColor: '#1a5e2e', iconBg: '#eef6ea' },
    { title: 'Payment Received', body: 'We received your booking advance for Sirpuram Gardens. Thank you!', time: '2 days ago', unread: false, icon: 'M5 12l4 4 10-10', iconColor: '#1a5e2e', iconBg: '#eef6ea' },
    { title: 'KYC Verified', body: 'Your identity documents have been successfully verified.', time: '5 days ago', unread: false, icon: 'M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6z', iconColor: '#1a5e2e', iconBg: '#eef6ea' },
  ].map((n) => ({ ...n, bg: n.unread ? '#f4faf1' : '#fff' }));'''

notifs_replacement = '''  const [notifs, setNotifs] = useState([]);
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await getJson('/api/notifications', session.access_token);
        const mapped = data.map(n => ({
          title: n.title || 'Notification',
          body: n.body || n.message || '',
          time: new Date(n.created_at).toLocaleDateString(),
          unread: !n.is_read,
          icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18',
          iconColor: '#1a5e2e',
          iconBg: '#eef6ea',
          bg: !n.is_read ? '#f4faf1' : '#fff'
        }));
        setNotifs(mapped);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    if (session?.access_token) {
      fetchNotifs();
    }
  }, [session]);'''

content = content.replace(notifs_def, notifs_replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced notifs!")
