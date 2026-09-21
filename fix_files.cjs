const https = require('https');
const fs = require('fs');
const path = require('path');

const repoBase = 'https://raw.githubusercontent.com/tuanhaii26/HyperLis_Documentation/main/';
const files = [
  'src/data/changelog.json',
  'src/content/docs/manage-license/manage-license.mdx',
  'src/content/docs/getting-started/installation.mdx',
  'src/content/docs/getting-started/activation-donation.mdx',
  'src/components/QuickCTA.astro',
  'src/components/LandingFooter.astro'
];

files.forEach(f => {
  const url = repoBase + f;
  https.get(url, (res) => {
    let data = '';
    res.setEncoding('utf8');
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      let fixed = data.replace(/Zịt Tech Lab/g, "Zịt's Tech Lab");
      fs.writeFileSync(path.join(process.cwd(), f), fixed, 'utf8');
      console.log('Fixed ' + f);
    });
  }).on('error', err => {
    console.error('Error fetching ' + f, err);
  });
});
