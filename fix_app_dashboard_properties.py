import os
import re

path = 'frontend/src/pages/AppDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we import getJson if not already there
if "getJson" not in content:
    content = content.replace(
        "import { loadSession, clearSession, putJson, saveSession } from '../lib/auth';",
        "import { loadSession, clearSession, putJson, getJson, saveSession } from '../lib/auth';"
    )

# Find where exploreProps is defined
exploreProps_def = '''  const exploreProps = [
    { name: 'Emerald Estate', loc: 'Visakhapatnam, Andhra Pradesh', tag: 'Bheemili', price: '?4,50,000', grad: 'linear-gradient(150deg,#2f6b3a 0%,#6ba15a 55%,#c7dc9c 100%)', plots: 120, avail: 45, dimg: 'Property Image 1.jpeg' },
    { name: 'Green City Enclave', loc: 'Anakapalle, Andhra Pradesh', tag: 'Anakapalle', price: '?2,80,000', grad: 'linear-gradient(150deg,#356b52 0%,#5a9a7a 55%,#9cdcbd 100%)', plots: 80, avail: 12, dimg: 'Property Image 2.jpeg' },
    { name: 'Sunrise Valley', loc: 'Visakhapatnam, Andhra Pradesh', tag: 'Yendada', price: '?8,90,000', grad: 'linear-gradient(150deg,#4a6b2f 0%,#84a95a 55%,#d8ebc1 100%)', plots: 50, avail: 5, dimg: 'Property Image 3.jpeg' },
    { name: 'Emerald Heights', loc: 'Visakhapatnam, Andhra Pradesh', tag: 'Seethammadhara', price: '?12,00,000', grad: 'linear-gradient(150deg,#2f5b6b 0%,#5a8a9a 55%,#b4dbe6 100%)', plots: 40, avail: 2, dimg: 'Property Image 4.jpeg' },
    { name: 'Green Valley Farms', loc: 'Bheemili, Andhra Pradesh', tag: 'Bheemili', price: '?3,20,000', grad: 'linear-gradient(150deg,#2f6b3a 0%,#6ba15a 55%,#c7dc9c 100%)', plots: 200, avail: 85, dimg: 'Property Image 1.jpeg' },
  ];'''

exploreProps_replacement = '''  const [exploreProps, setExploreProps] = useState([]);
  const [explorePropsLoading, setExplorePropsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setExplorePropsLoading(true);
        const data = await getJson('/api/properties');
        // Map backend properties to UI expected format
        const mapped = data.map((p, i) => {
          const grads = [
            'linear-gradient(150deg,#2f6b3a 0%,#6ba15a 55%,#c7dc9c 100%)',
            'linear-gradient(150deg,#356b52 0%,#5a9a7a 55%,#9cdcbd 100%)',
            'linear-gradient(150deg,#4a6b2f 0%,#84a95a 55%,#d8ebc1 100%)',
            'linear-gradient(150deg,#2f5b6b 0%,#5a8a9a 55%,#b4dbe6 100%)'
          ];
          return {
            id: p.id,
            name: p.name || 'Unnamed Property',
            loc: p.location || 'Unknown Location',
            tag: (p.location || '').split(',')[0],
            price: p.starting_price ? ? : 'Price on Request',
            grad: grads[i % grads.length],
            plots: p.total_plots || 0,
            avail: p.available_plots || 0,
            dimg: p.main_image || 'Property Image 1.jpeg'
          };
        });
        setExploreProps(mapped);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setExplorePropsLoading(false);
      }
    };
    fetchProperties();
  }, []);'''

content = content.replace(exploreProps_def, exploreProps_replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced properties!")
