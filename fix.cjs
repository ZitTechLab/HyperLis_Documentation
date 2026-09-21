const fs = require('fs');
const path = require('path');

const docsBaseDir = path.join(__dirname, 'src', 'content', 'docs');
const imagesBaseDir = path.join(__dirname, 'public', 'images', 'hyperlis');

// Migrate license-management.mdx from extend-features to license if exists
const oldLicenseFile = path.join(docsBaseDir, 'extend-features', 'license-management.mdx');
const newLicenseDir = path.join(docsBaseDir, 'license');
const newLicenseFile = path.join(newLicenseDir, 'license-management.mdx');

if (fs.existsSync(oldLicenseFile)) {
  if (!fs.existsSync(newLicenseDir)) {
    fs.mkdirSync(newLicenseDir, { recursive: true });
  }
  fs.copyFileSync(oldLicenseFile, newLicenseFile);
  fs.rmSync(oldLicenseFile, { force: true });
  console.log('Migrated license-management.mdx from extend-features -> license');
}

// Clean obsolete uwu route/components if switching to query param
const uwuDocFile = path.join(docsBaseDir, 'uwu.mdx');
if (fs.existsSync(uwuDocFile)) {
  fs.unlinkSync(uwuDocFile);
  console.log('Cleaned obsolete uwu.mdx');
}
const uwuComponentsDir = path.join(__dirname, 'src', 'components', 'uwu');
if (fs.existsSync(uwuComponentsDir)) {
  fs.rmSync(uwuComponentsDir, { recursive: true, force: true });
  console.log('Cleaned obsolete src/components/uwu');
}

// Clean obsolete general docs if migrating to hdsd-md structure
const obsoleteGeneralFiles = [
  'app-telemetry.mdx', 'error-reporting.mdx', 'fullscreen-optimizations.mdx',
  'optimize-performance.mdx', 'print-fax-service.mdx', 'privacy-telemetry.mdx',
  'smartscreen.mdx', 'sticky-keys.mdx'
];
obsoleteGeneralFiles.forEach(f => {
  const p = path.join(docsBaseDir, 'general', f);
  if (fs.existsSync(p)) {
    try {
      fs.unlinkSync(p);
      console.log(`Cleaned obsolete general doc: ${f}`);
    } catch (e) {
      console.error(e);
    }
  }
});

// Clean obsolete doc files across other tabs
const obsoleteDocFiles = [
  { folder: 'windows', file: 'gaming-optimizations.mdx' },
  { folder: 'windows', file: 'system-privacy.mdx' },
  { folder: 'windows', file: 'taskbar-extras.mdx' },
  { folder: 'uwp-apps', file: 'safe-preset.mdx' },
  { folder: 'uwp-apps', file: 'aggressive-customize.mdx' },
  { folder: 'uwp-apps', file: 'packages.mdx' },
  { folder: 'uwp-apps', file: 'capabilities.mdx' },
  { folder: 'uwp-apps', file: 'optional-features.mdx' },
  { folder: 'uwp-apps', file: 'powershell-terminal-log.mdx' },
  { folder: 'startup-apps', file: 'startup-management.mdx' },
  { folder: 'startup-apps', file: 'backup.mdx' },
  { folder: 'startup-apps', file: 'restore.mdx' },
  { folder: 'extend-features', file: 'system-utilities.mdx' },
];
obsoleteDocFiles.forEach(({ folder, file }) => {
  const p = path.join(docsBaseDir, folder, file);
  if (fs.existsSync(p)) {
    try {
      fs.unlinkSync(p);
      console.log(`Cleaned obsolete doc file: ${folder}/${file}`);
    } catch (e) {
      console.error(e);
    }
  }
});

// Clean 404.md if 404.mdx exists
const old404Md = path.join(docsBaseDir, '404.md');
if (fs.existsSync(old404Md) && fs.existsSync(path.join(docsBaseDir, '404.mdx'))) {
  try {
    fs.unlinkSync(old404Md);
    console.log('Removed obsolete 404.md in favor of 404.mdx');
  } catch (e) {
    console.error(e);
  }
}

// Migrate overview to dashboard if exists
const oldOverviewDocDir = path.join(docsBaseDir, 'overview');
const newDashboardDocDir = path.join(docsBaseDir, 'dashboard');
if (fs.existsSync(oldOverviewDocDir)) {
  if (!fs.existsSync(newDashboardDocDir)) {
    fs.mkdirSync(newDashboardDocDir, { recursive: true });
  }
  const oldFiles = fs.readdirSync(oldOverviewDocDir);
  oldFiles.forEach(file => {
    fs.copyFileSync(path.join(oldOverviewDocDir, file), path.join(newDashboardDocDir, file));
  });
  fs.rmSync(oldOverviewDocDir, { recursive: true, force: true });
  console.log('Migrated docs overview -> dashboard');
}

const oldOverviewImgDir = path.join(imagesBaseDir, 'overview');
const newDashboardImgDir = path.join(imagesBaseDir, 'dashboard');
if (fs.existsSync(oldOverviewImgDir)) {
  if (!fs.existsSync(newDashboardImgDir)) {
    fs.mkdirSync(newDashboardImgDir, { recursive: true });
  }
  const oldImgs = fs.readdirSync(oldOverviewImgDir);
  oldImgs.forEach(img => {
    let destName = img === 'overview-01.png' ? 'dashboard-01.png' : img;
    fs.copyFileSync(path.join(oldOverviewImgDir, img), path.join(newDashboardImgDir, destName));
  });
  fs.rmSync(oldOverviewImgDir, { recursive: true, force: true });
  console.log('Migrated images overview -> dashboard');
}

// Migrate getting-started files from dashboard to getting-started
const gettingStartedFiles = [
  'about-hyperlis.mdx', 'activation-donation.mdx', 'changelog.mdx',
  'faq.mdx', 'installation.mdx', 'language.mdx',
  'overview.mdx', 'safety-policy.mdx'
];
const gettingStartedDir = path.join(docsBaseDir, 'getting-started');
if (!fs.existsSync(gettingStartedDir)) {
  fs.mkdirSync(gettingStartedDir, { recursive: true });
}
gettingStartedFiles.forEach(file => {
  const oldPath = path.join(docsBaseDir, 'dashboard', file);
  const newPath = path.join(gettingStartedDir, file);
  if (fs.existsSync(oldPath)) {
    fs.copyFileSync(oldPath, newPath);
    fs.unlinkSync(oldPath);
    console.log(`Moved ${file} from dashboard -> getting-started`);
  }
});

// Migrate installation-activation.mdx to installation.mdx if exists
const oldInstallFile = path.join(gettingStartedDir, 'installation-activation.mdx');
const newInstallFile = path.join(gettingStartedDir, 'installation.mdx');
if (fs.existsSync(oldInstallFile)) {
  fs.copyFileSync(oldInstallFile, newInstallFile);
  fs.unlinkSync(oldInstallFile);
  console.log('Renamed installation-activation.mdx -> installation.mdx');
}

// Sync images from old directory names to new directory names
const imgSyncMap = [
  { from: 'dashboard', to: 'getting-started' },
  { from: 'downloads', to: 'download' },
  { from: 'cleanup', to: 'cleaning' },
  { from: 'hardware', to: 'hardware-info' },
  { from: 'license', to: 'manage-license' },
  { from: 'printer-repair', to: 'errors' },
  { from: 'windows-repair', to: 'errors' },
];

imgSyncMap.forEach(({ from, to }) => {
  const fromDir = path.join(imagesBaseDir, from);
  const toDir = path.join(imagesBaseDir, to);
  if (fs.existsSync(fromDir)) {
    if (!fs.existsSync(toDir)) fs.mkdirSync(toDir, { recursive: true });
    const files = fs.readdirSync(fromDir);
    files.forEach(file => {
      const srcFile = path.join(fromDir, file);
      const destFile = path.join(toDir, file);
      if (!fs.existsSync(destFile) && fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`Synced image ${from}/${file} -> ${to}/${file}`);
      }
    });
  }
});

const tabConfigs = {
  'getting-started': { name: 'Bắt đầu', img: 'dashboard-01.png' },
  'dashboard': { name: 'Dashboard', img: 'dashboard-01.png' },
  'general': { name: 'Chung (General)', img: 'general-01.png' },
  'windows': { name: 'Windows', img: 'windows-01.png' },
  'uwp-apps': { name: 'Ứng dụng UWP (UWP Apps)', img: 'uwp-apps-01.png' },
  'startup-apps': { name: 'Khởi chạy (Startup Apps)', img: 'startup-apps-01.png' },
  'download': { name: 'Tải xuống (Downloads)', img: 'downloads-01.png' },
  'cleaning': { name: 'Dọn dẹp (Cleanup)', img: 'cleanup-01.png' },
  'network': { name: 'Mạng (Network)', img: 'network-01.png' },
  'usb-boot': { name: 'USB Boot', img: 'usb-boot-01.png' },
  'hardware-info': { name: 'Phần cứng (Hardware)', img: 'hardware-01.png' },
  'manage-license': { name: 'QL Bản quyền (Manage License)', img: 'license-01.png' },
  'convert-skus': { name: 'Đổi phiên bản (Convert SKUs)', img: 'convert-skus-01.png' },
  'office-setup': { name: 'Cài đặt Office (Office Setup)', img: 'office-setup-01.png' },
  'extend-features': { name: 'Tính năng khác (Extend Features)', img: 'extend-features-01.png' },
  'wsap': { name: 'WSAP', img: 'wsap-01.png' },
  'errors': { name: 'Sửa lỗi (Errors)', img: 'printer-repair-01.png' },
  'settings': { name: 'Cài đặt (Settings)', img: 'settings-01.png' }
};

const validDocTabs = Object.keys(tabConfigs);

const preserveImgFolders = [
  'getting-started', 'dashboard', 'general', 'windows', 'uwp-apps', 'startup-apps',
  'download', 'downloads', 'cleaning', 'cleanup', 'network',
  'usb-boot', 'hardware-info', 'hardware', 'manage-license', 'license',
  'convert-skus', 'office-setup', 'extend-features', 'wsap',
  'errors', 'printer-repair', 'windows-repair', 'settings', '404'
];

// 1. Ensure all valid image folders exist in public/images/hyperlis/
preserveImgFolders.forEach(folder => {
  const imgFolder = path.join(imagesBaseDir, folder);
  if (!fs.existsSync(imgFolder)) {
    fs.mkdirSync(imgFolder, { recursive: true });
  }
  const gitkeep = path.join(imgFolder, '.gitkeep');
  if (!fs.existsSync(gitkeep)) {
    fs.writeFileSync(gitkeep, '');
  }
});

// 2. Remove unused / obsolete folders in docsBaseDir
if (fs.existsSync(docsBaseDir)) {
  const existingDocsFolders = fs.readdirSync(docsBaseDir, { withFileTypes: true });
  existingDocsFolders.forEach(item => {
    if (item.isDirectory() && !validDocTabs.includes(item.name)) {
      const unusedFolder = path.join(docsBaseDir, item.name);
      fs.rmSync(unusedFolder, { recursive: true, force: true });
      console.log(`Cleaned unused docs folder: ${item.name}`);
    }
  });
}

// 3. Remove unused / obsolete folders in imagesBaseDir
if (fs.existsSync(imagesBaseDir)) {
  const existingImgFolders = fs.readdirSync(imagesBaseDir, { withFileTypes: true });
  existingImgFolders.forEach(item => {
    if (item.isDirectory() && !preserveImgFolders.includes(item.name)) {
      const unusedFolder = path.join(imagesBaseDir, item.name);
      fs.rmSync(unusedFolder, { recursive: true, force: true });
      console.log(`Cleaned unused image folder: ${item.name}`);
    }
  });
}

// Emoji cleaning regex
const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{FE0F}]/gu;

function stripEmojisAndNumbers(text) {
  return text
    .replace(emojiRegex, '')
    .replace(/^[0-9]+[️⃣\.\)\-]?\s*/u, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// 4. Process each doc file
validDocTabs.forEach(folder => {
  const tabInfo = tabConfigs[folder];
  const folderPath = path.join(docsBaseDir, folder);
  if (!fs.existsSync(folderPath)) return;

  // Check what images exist in the folder
  const imgFolder = path.join(imagesBaseDir, folder);
  let availableImages = [];
  if (fs.existsSync(imgFolder)) {
    availableImages = fs.readdirSync(imgFolder)
      .filter(f => /\.(png|webp|jpg|jpeg|svg)$/i.test(f) && f !== '.gitkeep')
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  }

  const files = fs.readdirSync(folderPath);

  files.forEach(file => {
    if (!file.endsWith('.mdx')) return;
    const filePath = path.join(folderPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip changelog.mdx feed
    if (file === 'changelog.mdx') return;

    // Parse frontmatter
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if (!frontmatterMatch) return;

    const frontmatter = frontmatterMatch[0].trim();
    let body = content.substring(frontmatterMatch[0].length);

    // Extract imports
    let importLines = [];
    const nonImportLines = [];
    const lines = body.split(/\r?\n/);
    let insideImportBlock = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('import ')) {
        let normalizedLine = line
          .replace(/from '\.\.\/\.\.\/components\//g, "from '../../../components/")
          .replace(/from '\.\.\/\.\.\/\.\.\/\.\.\/components\//g, "from '../../../components/");
        importLines.push(normalizedLine);
      } else if (line.trim() === '' && insideImportBlock && importLines.length > 0) {
        // skip empty lines in import block
      } else {
        insideImportBlock = false;
        nonImportLines.push(line);
      }
    }

    const noScreenshotFiles = ['faq.mdx', 'safety-policy.mdx'];
    const isNoScreenshot = noScreenshotFiles.includes(file);

    // Ensure Screenshot is imported if needed
    const hasScreenshotImport = importLines.some(l => l.includes('Screenshot'));
    if (!isNoScreenshot && !hasScreenshotImport) {
      importLines.push("import Screenshot from '../../../components/Screenshot.astro';");
    } else if (isNoScreenshot && hasScreenshotImport) {
      importLines = importLines.filter(l => !l.includes('Screenshot'));
    }

    let restOfDoc = nonImportLines.join('\n');

    // Remove any existing Screenshot blocks
    restOfDoc = restOfDoc.replace(/<Screenshot[\s\S]*?\/>\r?\n?/g, '');

    // Clean emojis from all subheadings (###, ####) and list items
    restOfDoc = restOfDoc.replace(/^(###+\s+)(.*)$/gm, (match, prefix, title) => {
      return prefix + stripEmojisAndNumbers(title);
    });

    // Re-split into sections by ##
    const rawSections = restOfDoc.split(/(?=^##\s+)/m);
    const cleanedSections = [];

    for (let s of rawSections) {
      s = s.trim();
      if (!s) continue;
      if (s.startsWith('##')) {
        const firstLineBreak = s.indexOf('\n');
        let headingText = s;
        let secBody = '';
        if (firstLineBreak !== -1) {
          headingText = s.substring(0, firstLineBreak);
          secBody = s.substring(firstLineBreak + 1).trim();
        }
        
        let cleanHeading = headingText.replace(/^##\s*\d*\.?\s*/, '').trim();
        cleanHeading = stripEmojisAndNumbers(cleanHeading);
        
        // Skip illustration headings
        if (cleanHeading === 'Hình ảnh minh họa' || cleanHeading === 'Minh họa giao diện' || cleanHeading === 'Hình ảnh giao diện') {
          if (secBody) {
            cleanedSections.push({ isHeading: false, content: secBody });
          }
          continue;
        }

        cleanedSections.push({ isHeading: true, heading: cleanHeading, body: secBody });
      } else {
        cleanedSections.push({ isHeading: false, content: s });
      }
    }

    // Build new body
    let newBody = '';
    newBody += importLines.join('\n') + '\n\n';

    let sectionIndex = 1;

    if (!isNoScreenshot) {
      // Section 1: 1. Hình ảnh giao diện
      newBody += `## 1. Hình ảnh giao diện\n\n`;

      if (folder === 'getting-started' && file === 'language.mdx') {
        newBody += `<Screenshot \n  src="/images/hyperlis/settings/settings-01.png" \n  alt="Giao diện tab Cài đặt Ngôn ngữ"\n/>\n\n`;
      } else {
        let pageImages = [...availableImages];
        if (folder === 'errors') {
          if (file.includes('printer')) {
            pageImages = availableImages.filter(img => img.includes('printer'));
          } else if (file.includes('windows')) {
            pageImages = availableImages.filter(img => img.includes('windows'));
          }
        }

        if (pageImages.length > 0) {
          pageImages.forEach((imgName, idx) => {
            const imagePath = `/images/hyperlis/${folder}/${imgName}`;
            const altSuffix = pageImages.length > 1 ? ` - Ảnh ${idx + 1}` : '';
            newBody += `<Screenshot \n  src="${imagePath}" \n  alt="Giao diện tab ${tabInfo.name}${altSuffix}"\n/>\n\n`;
          });
        } else {
          const imagePath = `/images/hyperlis/${folder}/${tabInfo.img}`;
          newBody += `<Screenshot \n  src="${imagePath}" \n  alt="Giao diện tab ${tabInfo.name}"\n/>\n\n`;
        }
      }
      sectionIndex = 2;
    }

    // Renumber remaining sections starting from sectionIndex
    for (let item of cleanedSections) {
      if (item.isHeading) {
        newBody += `## ${sectionIndex}. ${item.heading}\n\n`;
        if (item.body) {
          newBody += `${item.body}\n\n`;
        }
        sectionIndex++;
      } else if (item.content) {
        newBody += `${item.content}\n\n`;
      }
    }

    // Clean duplicate newlines
    newBody = newBody.replace(/\n{3,}/g, '\n\n').trim() + '\n';

    const finalContent = frontmatter + '\n\n' + newBody;
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log(`Updated images and headings in ${folder}/${file}`);
  });
});

console.log('All documentation pages and image folders successfully synchronized!');
