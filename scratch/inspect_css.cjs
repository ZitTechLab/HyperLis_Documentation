const fs = require('fs');
const files = fs.readdirSync('dist/_astro').filter(f => f.startsWith('index.') && f.endsWith('.css'));
if (files.length > 0) {
  const content = fs.readFileSync('dist/_astro/' + files[0], 'utf8');
  // find rules matching header, page, main-frame
  const matches = content.match(/([^{}]*(?:header|\.page|\.main-frame|\.main-pane|--sl-nav)[^{}]*\{[^}]*\})/g) || [];
  console.log('Total matches:', matches.length);
  for (const m of matches.slice(0, 30)) {
    console.log(m);
  }
}
