import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'src', 'content', 'docs');
const PUBLIC_IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images', 'hyperlis');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend Editor UI
app.use(express.static(path.join(__dirname, 'public')));


// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.query.folder || 'misc';
    const destDir = path.join(PUBLIC_IMAGES_DIR, folder);
    
    // Create folder if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    cb(null, destDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${timestamp}-${originalName}`);
  }
});

const upload = multer({ storage: storage });

// API 1: Lấy danh sách file và thư mục trong src/content/docs
app.get('/api/docs/tree', (req, res) => {
  const getTree = (dirPath) => {
    const result = [];
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      const relativePath = path.relative(DOCS_DIR, itemPath).replace(/\\/g, '/');
      
      if (stat.isDirectory()) {
        result.push({
          type: 'directory',
          name: item,
          path: relativePath,
          children: getTree(itemPath)
        });
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        result.push({
          type: 'file',
          name: item,
          path: relativePath
        });
      }
    }
    return result;
  };
  
  try {
    const tree = getTree(DOCS_DIR);
    res.json({ success: true, tree });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API 2: Lấy nội dung file
app.get('/api/docs/file', (req, res) => {
  const filePath = req.query.path;
  if (!filePath) return res.status(400).json({ error: 'Missing path' });
  
  const fullPath = path.join(DOCS_DIR, filePath);
  // Security check to ensure it stays within DOCS_DIR
  if (!fullPath.startsWith(DOCS_DIR)) return res.status(403).json({ error: 'Forbidden' });
  
  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    res.json({ success: true, content });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API 3: Lưu nội dung file
app.post('/api/docs/file', (req, res) => {
  const { path: filePath, content } = req.body;
  if (!filePath || content === undefined) return res.status(400).json({ error: 'Invalid data' });
  
  const fullPath = path.join(DOCS_DIR, filePath);
  if (!fullPath.startsWith(DOCS_DIR)) return res.status(403).json({ error: 'Forbidden' });
  
  try {
    // Create directory if it doesn't exist (for new files)
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(fullPath, content, 'utf-8');
    res.json({ success: true, message: 'Saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API 4: Upload ảnh
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  const folder = req.query.folder || 'misc';
  const urlPath = `/images/hyperlis/${folder}/${req.file.filename}`;
  
  res.json({ 
    success: true, 
    url: urlPath,
    message: 'Upload successful'
  });
});

// API 5: Publish lên GitHub
app.post('/api/publish', (req, res) => {
  const commitMsg = req.body.message || 'docs: Cập nhật bài viết qua HyperLis CMS';
  
  exec(`git add . && git commit -m "${commitMsg}" && git push`, { cwd: ROOT_DIR }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Git Error: ${error.message}`);
      // Có thể là working tree clean (không có gì để commit), 
      // ta vẫn có thể trả về lỗi để UI xử lý, nhưng thường git push vẫn chạy nếu có commit cũ
      if (stdout.includes('nothing to commit')) {
        return res.json({ success: true, message: 'Không có thay đổi nào mới để Publish.' });
      }
      return res.status(500).json({ success: false, error: error.message });
    }
    
    res.json({ success: true, message: 'Đã Publish lên GitHub thành công!', details: stdout });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`CMS Backend Server is running at http://localhost:${PORT}`);
});
