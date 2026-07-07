const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Fix attribute string interpolation: attr="{var.prop}" -> attr={var.prop}
  // This matches things like d="{q.icon}", fill="{sel.cdColor}", className="rv-nav-btn {navClassHome}"
  // Wait, if it's className="rv-nav-btn {navClassHome}", we need className={`rv-nav-btn ${navClassHome}`}
  
  // First, let's fix exact matches like attr="{something}"
  const exactRegex = /([a-zA-Z-]+)="\{([a-zA-Z0-9_.]+)\}"/g;
  if (exactRegex.test(content)) {
    content = content.replace(exactRegex, '$1={$2}');
    changed = true;
  }

  // Second, fix mixed strings like className="rv-nav-btn {someVar}"
  // This is a bit trickier. We can find `className="[^"]*\{[^\}]*\}[^"]*"`
  // And replace the string with a template literal.
  const mixedRegex = /className="([^"]*?)\{([a-zA-Z0-9_.]+)\}([^"]*?)"/g;
  if (mixedRegex.test(content)) {
    content = content.replace(mixedRegex, (match, before, varName, after) => {
      // Actually, in AppDashboard, navClassHome doesn't exist, it should be (cur==='home'?'active':'')
      return `className={\`${before}\${${varName}}${after}\`}`;
    });
    changed = true;
  }
  
  // For AppDashboard specifically:
  if (file === 'AppDashboard.jsx') {
    // 1. Fix `className="rv-scroll"` -> `className="rv-scroll with-nav"`
    content = content.replace(/className="rv-scroll"/g, 'className="rv-scroll with-nav"');
    
    // 2. Fix the undefined variables navClassHome etc.
    content = content.replace(/\$\{navClassHome\}/g, `\${cur === 'home' ? 'active' : ''}`);
    content = content.replace(/\$\{navClassProps\}/g, `\${cur === 'props' ? 'active' : ''}`);
    content = content.replace(/\$\{navClassPayments\}/g, `\${cur === 'payments' ? 'active' : ''}`);
    content = content.replace(/\$\{navClassProfile\}/g, `\${cur === 'profile' ? 'active' : ''}`);
    
    changed = true;
  }

  // For AdminDashboard specifically:
  if (file === 'AdminDashboard.jsx') {
    content = content.replace(/className={\`ad-side \$\{sideCls\}\`}/g, 'className={`ad-side ${sideCls}`}');
    // Also fix any missed `className="ad-side {sideCls}"`
    content = content.replace(/className="ad-side \{sideCls\}"/g, 'className={`ad-side ${sideCls}`}');
    changed = true;
  }
  
  // For AgentDashboard specifically:
  if (file === 'AgentDashboard.jsx') {
    // Same for sideCls
    content = content.replace(/className="ad-side \{sideCls\}"/g, 'className={`ad-side ${sideCls}`}');
    changed = true;
  }
  
  // For Visits.jsx specifically:
  if (file === 'Visits.jsx') {
    content = content.replace(/className="rv-scroll"/g, 'className="rv-scroll with-nav"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
}
