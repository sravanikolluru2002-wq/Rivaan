const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

// Helper to camelCase CSS properties
function camelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Damaged state: style={{'width': '78px'}}:78px;height:78px;...
  // Wait, the first value might be '100%' or whatever.
  // The original match was firstKey and rest.
  // The first key was e.g. width. The damaged string is style={{'width': '...'}}:78px;height...
  // Let's just match style=\{\{'([a-zA-Z]+)': '([^']+)'\}\}:([^\s>]+)
  // And also we might have remaining original undamaged ones: style=\{([a-zA-Z-]+)\}:([^\s>]+)
  
  const damagedRegex = /style=\{\{'([a-zA-Z]+)': '([^']+)'\}\}:([^\s>]+)/g;
  content = content.replace(damagedRegex, (match, firstKey, firstVal, rest) => {
    // Reconstruct the full string: width:78px;height...
    // Note: the original firstVal is actually not needed because it's duplicated in the rest string!
    // Wait, let's look at the damaged string:
    // style={{'width': '78px'}}:78px;height...
    // So the rest string IS "78px;height..."
    const fullStr = `${firstKey}:${rest}`;
    
    const parts = fullStr.split(';');
    const styleObjProps = [];
    
    for (let part of parts) {
      if (!part) continue;
      const colonIdx = part.indexOf(':');
      if (colonIdx === -1) continue;
      
      let key = part.slice(0, colonIdx).trim();
      let val = part.slice(colonIdx + 1).trim();
      
      key = camelCase(key);
      
      let isVar = false;
      if (/^[a-zA-Z_]+\.[a-zA-Z_]+$/.test(val)) {
        isVar = true;
      } else if (val === 'statusColor' || val === 'width' || val === 'tl.dotBg') {
        isVar = true;
      }
      
      if (val.includes('linear-gradient') || val.includes('#') || val.includes('px') || val.includes('%') || val === 'flex' || val === 'none' || val === 'relative' || val === 'absolute' || val === 'center' || val === 'space-between' || val === 'transparent' || val === 'auto') {
        isVar = false;
      }
      
      if (isVar) {
        styleObjProps.push(`'${key}': ${val}`);
      } else {
        if (val.includes('${')) {
           styleObjProps.push(`'${key}': \`${val.replace(/\$\$\{/g, '${')}\``);
        } else {
           styleObjProps.push(`'${key}': '${val}'`);
        }
      }
    }
    
    changed = true;
    return `style={{${styleObjProps.join(', ')}}}`;
  });
  
  // Also fix any undamaged ones that were missed because of colons
  const undamagedRegex = /style=\{([a-zA-Z-]+)\}:([^\s>]+)/g;
  content = content.replace(undamagedRegex, (match, firstKey, rest) => {
    const fullStr = `${firstKey}:${rest}`;
    
    const parts = fullStr.split(';');
    const styleObjProps = [];
    
    for (let part of parts) {
      if (!part) continue;
      const colonIdx = part.indexOf(':');
      if (colonIdx === -1) continue;
      
      let key = part.slice(0, colonIdx).trim();
      let val = part.slice(colonIdx + 1).trim();
      
      key = camelCase(key);
      
      let isVar = false;
      if (/^[a-zA-Z_]+\.[a-zA-Z_]+$/.test(val)) {
        isVar = true;
      } else if (val === 'statusColor' || val === 'width' || val === 'tl.dotBg') {
        isVar = true;
      }
      
      if (val.includes('linear-gradient') || val.includes('#') || val.includes('px') || val.includes('%') || val === 'flex' || val === 'none' || val === 'relative' || val === 'absolute' || val === 'center' || val === 'space-between' || val === 'transparent' || val === 'auto') {
        isVar = false;
      }
      
      if (isVar) {
        styleObjProps.push(`'${key}': ${val}`);
      } else {
        if (val.includes('${')) {
           styleObjProps.push(`'${key}': \`${val.replace(/\$\$\{/g, '${')}\``);
        } else {
           styleObjProps.push(`'${key}': '${val}'`);
        }
      }
    }
    
    changed = true;
    return `style={{${styleObjProps.join(', ')}}}`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed styles in ${file}`);
  }
}
