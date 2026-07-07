// Fix all pages: remove notch/status-bar divs and fix scroll containers
const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/AppDashboard.jsx',
  'src/pages/Login.jsx',
  'src/pages/MyLands.jsx',
  'src/pages/Visits.jsx',
];

const baseDir = 'd:/MyUserFolders/Downloads/Real estate app login design/rivan-pwa';

for (const file of files) {
  const filePath = path.join(baseDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Remove the notch div (the black pill at top center)
  // Pattern: <div style={{...width:'150px', height:'30px'...background:'#0c2615'...}}></div>
  content = content.replace(
    /\s*\{?\/\*\s*notch\s*\*\/\s*\}?\s*\n?/g,
    '\n'
  );
  
  // Remove notch div - matches the inline notch element
  content = content.replace(
    /\s*<div\s+style=\{?\{[^}]*'?width'?\s*:\s*'?150px'?[^}]*'?background'?\s*:\s*'?#0c2615'?[^}]*\}\}?>\s*<\/div>/g,
    ''
  );
  content = content.replace(
    /\s*<div\s+style=\{?\{[^}]*background[^}]*#0c2615[^}]*\}\}?>\s*<\/div>/g,
    ''
  );

  // Remove the status bar div (the one with 9:41 and battery)
  // It wraps <span>9:41</span><span>▟▟▟ 100%</span> or similar
  content = content.replace(
    /\s*<div\s+style=\{?\{[^}]*pointerEvents[^}]*\}\}?>\s*\n?\s*<span>[^<]*9:41[^<]*<\/span>[^<]*<span[^>]*>[^<]*<\/span>\s*\n?\s*<\/div>/g,
    ''
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed: ' + file);
  } else {
    console.log('No change: ' + file);
  }
}
console.log('Done');
