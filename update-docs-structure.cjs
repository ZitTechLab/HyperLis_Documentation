const fs = require('fs');
const path = require('path');

const docsBaseDir = path.join(__dirname, 'src', 'content', 'docs');
const imagesBaseDir = path.join(__dirname, 'public', 'images', 'hyperlis');

const targetFolders = [
  'dashboard', 'general', 'windows', 'uwp-apps', 'startup-apps', 'downloads',
  'cleanup', 'network', 'usb-boot', 'hardware', 'license', 'convert-skus', 'office-setup',
  'extend-features', 'wsap', 'printer-repair', 'windows-repair'
];

// 1. Ensure image folders exist
targetFolders.forEach(folder => {
  const imgFolder = path.join(imagesBaseDir, folder);
  if (!fs.existsSync(imgFolder)) {
    fs.mkdirSync(imgFolder, { recursive: true });
    fs.writeFileSync(path.join(imgFolder, '.gitkeep'), '');
  }
});

// 2. Process each doc file
targetFolders.forEach(folder => {
  const folderPath = path.join(docsBaseDir, folder);
  if (!fs.existsSync(folderPath)) return;
  const files = fs.readdirSync(folderPath);

  files.forEach(file => {
    if (!file.endsWith('.mdx')) return;
    const fileBase = file.replace('.mdx', '');
    const filePath = path.join(folderPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip changelog.mdx if it only has feed
    if (file === 'changelog.mdx') return;

    // Parse frontmatter
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if (!frontmatterMatch) return;

    const frontmatter = frontmatterMatch[0];
    let body = content.substring(frontmatter.length);

    // Extract title from frontmatter
    const titleMatch = frontmatter.match(/title:\s*(.*)/);
    const title = titleMatch ? titleMatch[1].trim().replace(/^['"]|['"]$/g, '') : fileBase;

    // Extract imports
    const importLines = [];
    const nonImportLines = [];
    const lines = body.split(/\r?\n/);
    let insideImportBlock = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('import ')) {
        importLines.push(line);
      } else if (line.trim() === '' && insideImportBlock && importLines.length > 0) {
        // empty line between imports
      } else {
        insideImportBlock = false;
        nonImportLines.push(line);
      }
    }

    // Ensure Screenshot is imported
    const hasScreenshotImport = importLines.some(l => l.includes('Screenshot'));
    if (!hasScreenshotImport) {
      importLines.push("import Screenshot from '../../../components/Screenshot.astro';");
    }

    let restOfDoc = nonImportLines.join('\n');

    // Remove any existing Screenshot blocks and old Illustration sections
    // Match <Screenshot ... />
    restOfDoc = restOfDoc.replace(/<Screenshot[\s\S]*?\/>\r?\n?/g, '');
    
    // Remove sections like ## X. Minh họa giao diện / ## X. Hình ảnh minh họa
    restOfDoc = restOfDoc.replace(/##\s*\d*\.?\s*(Minh họa giao diện|Hình ảnh minh họa|Hình ảnh giao diện)[\s\S]*?(?=(##|$))/gi, '');

    // Now re-split into sections by ##
    const sections = [];
    const rawSections = restOfDoc.split(/(?=^##\s+)/m);

    for (let s of rawSections) {
      s = s.trim();
      if (!s) continue;
      if (s.startsWith('##')) {
        // clean the heading number
        s = s.replace(/^##\s*\d*\.?\s*/, '');
        sections.push(s);
      } else {
        // introduction text before any section
        sections.push(s);
      }
    }

    // Build new body
    let newBody = '';
    newBody += importLines.join('\n') + '\n\n';

    // 1. Hình ảnh giao diện
    const imagePath = `/images/hyperlis/${folder}/${fileBase}-01.png`;
    newBody += `## 1. Hình ảnh giao diện\n\n`;
    newBody += `<Screenshot \n  src="${imagePath}" \n  alt="Hình ảnh giao diện ${title}" \n  caption="Hình 1: Giao diện chức năng ${title}" \n  title="${title}"\n/>\n\n`;

    // Renumber subsequent sections starting from 2
    let sectionIndex = 2;
    for (let sec of sections) {
      if (sec.startsWith('##')) {
        const cleanHeading = sec.replace(/^##\s*\d*\.?\s*/, '');
        newBody += `## ${sectionIndex}. ${cleanHeading}\n\n`;
        sectionIndex++;
      } else if (sec.length > 0) {
        // If it starts with text without ##, check if it has heading or is plain text
        const firstLineBreak = sec.indexOf('\n');
        let headingText = sec;
        let bodyText = '';
        if (firstLineBreak !== -1) {
          headingText = sec.substring(0, firstLineBreak);
          bodyText = sec.substring(firstLineBreak + 1);
        }
        
        // Remove old number
        headingText = headingText.replace(/^\d*\.?\s*/, '').trim();
        newBody += `## ${sectionIndex}. ${headingText}\n\n${bodyText}\n\n`;
        sectionIndex++;
      }
    }

    // Clean up duplicate newlines
    newBody = newBody.replace(/\n{3,}/g, '\n\n').trim() + '\n';

    const finalContent = frontmatter + '\n' + newBody;
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log(`Formatted: ${folder}/${file}`);
  });
});

console.log('All files updated successfully with Section 1. Hình ảnh giao diện!');
