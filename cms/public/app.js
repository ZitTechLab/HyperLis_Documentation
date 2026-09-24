let editor;
let currentFilePath = '';

// Khởi tạo Monaco Editor
require(['vs/editor/editor.main'], function () {
  editor = monaco.editor.create(document.getElementById('monaco-container'), {
    value: "Chọn một bài viết bên trái để bắt đầu chỉnh sửa...",
    language: 'markdown',
    theme: 'vs-dark',
    wordWrap: 'on',
    minimap: { enabled: false },
    fontSize: 14,
    automaticLayout: true
  });

  // Lắng nghe sự kiện Ctrl+S
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function() {
    saveFile();
  });

  // Lắng nghe Paste ảnh
  editor.onDidPaste((e) => {
    // Handling image paste would require native clipboard API, 
    // for simplicity, we'll implement Drag & Drop on the container
  });

  loadTree();
});

// Load thư mục
async function loadTree() {
  const res = await fetch('/api/docs/tree');
  const data = await res.json();
  if (data.success) {
    const treeEl = document.getElementById('file-tree');
    treeEl.innerHTML = '';
    renderTree(data.tree, treeEl);
  }
}

function renderTree(items, container) {
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    
    if (item.type === 'directory') {
      li.className = 'tree-dir';
      container.appendChild(li);
      renderTree(item.children, container);
    } else {
      li.className = 'tree-file';
      li.onclick = () => loadFile(item.path);
      container.appendChild(li);
    }
  });
}

// Load file
async function loadFile(path) {
  currentFilePath = path;
  
  // Highlight active
  document.querySelectorAll('.tree-file').forEach(el => {
    el.classList.remove('active');
    if (el.textContent === path.split('/').pop()) el.classList.add('active');
  });

  const res = await fetch(`/api/docs/file?path=${encodeURIComponent(path)}`);
  const data = await res.json();
  if (data.success) {
    editor.setValue(data.content);
    
    // Đổi link Iframe
    // VD: getting-started/overview.mdx -> /getting-started/overview/
    let previewPath = path.replace('.mdx', '').replace('.md', '');
    document.getElementById('preview-iframe').src = `http://localhost:4321/${previewPath}/`;
    showStatus(`Đã tải ${path}`);
  }
}

// Lưu file
async function saveFile() {
  if (!currentFilePath) return alert('Chưa chọn file!');
  
  const content = editor.getValue();
  const res = await fetch('/api/docs/file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: currentFilePath, content })
  });
  
  const data = await res.json();
  if (data.success) {
    showStatus('Đã lưu thành công!');
    // Không cần reload iframe, Astro HMR sẽ tự động làm
  } else {
    showStatus('Lỗi: ' + data.error, true);
  }
}

function showStatus(msg, isError = false) {
  const el = document.getElementById('status-msg');
  el.textContent = msg;
  el.style.color = isError ? 'red' : '#4CAF50';
  setTimeout(() => el.textContent = '', 3000);
}

// Bắt sự kiện Nút Save
document.getElementById('btn-save').onclick = saveFile;

// Nút Snippet
document.querySelectorAll('.btn-snippet').forEach(btn => {
  btn.onclick = () => {
    const type = btn.dataset.snippet;
    const position = editor.getPosition();
    let text = '';
    
    if (type === 'screenshot') {
      text = `<Screenshot \n  src="/images/hyperlis/chuyen-muc/anh-01.png" \n  alt="Mô tả ảnh" \n  caption="Ghi chú dưới ảnh" \n  title="Tên Tiêu Đề Ảnh"\n/>\n`;
    } else if (type === 'aside') {
      text = `\n<Aside type="caution">\n  Nội dung lưu ý ở đây.\n</Aside>\n`;
    } else if (type === 'beforeafter') {
      text = `\n<BeforeAfter \n  beforeSrc="/images/hyperlis/truoc.png" \n  afterSrc="/images/hyperlis/sau.png" \n/>\n`;
    }

    editor.executeEdits("snippet", [{
      range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
      text: text,
      forceMoveMarkers: true
    }]);
    editor.focus();
  };
});

// Xử lý Upload Drag & Drop vào Monaco
const monacoContainer = document.getElementById('monaco-container');
monacoContainer.addEventListener('dragover', (e) => {
  e.preventDefault();
  monacoContainer.style.opacity = '0.7';
});
monacoContainer.addEventListener('dragleave', (e) => {
  e.preventDefault();
  monacoContainer.style.opacity = '1';
});
monacoContainer.addEventListener('drop', async (e) => {
  e.preventDefault();
  monacoContainer.style.opacity = '1';
  
  if (!currentFilePath) return alert('Hãy chọn một bài viết trước khi kéo ảnh vào!');
  
  const files = e.dataTransfer.files;
  if (files.length === 0) return;
  const file = files[0];
  if (!file.type.startsWith('image/')) return alert('Chỉ hỗ trợ file ảnh!');
  
  // Xác định thư mục lưu ảnh dựa theo tên bài viết
  // VD: path = "getting-started/overview.mdx" -> folder = "getting-started"
  const folder = currentFilePath.split('/')[0] || 'misc';
  
  const formData = new FormData();
  formData.append('image', file);
  
  showStatus('Đang upload ảnh...');
  
  try {
    const res = await fetch(`/api/upload?folder=${encodeURIComponent(folder)}`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    
    if (data.success) {
      // Chèn mã Screenshot vào chỗ con trỏ
      const position = editor.getPosition();
      const text = `\n<Screenshot \n  src="${data.url}" \n  alt="${file.name}" \n  caption="Ghi chú ảnh" \n  title="Tiêu đề ảnh"\n/>\n`;
      
      editor.executeEdits("upload", [{
        range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
        text: text,
        forceMoveMarkers: true
      }]);
      showStatus('Upload thành công!');
    }
  } catch (err) {
    showStatus('Lỗi upload', true);
  }
});

// Nút Publish lên Web
document.getElementById('btn-publish').onclick = async () => {
  // Bắt buộc lưu file trước khi publish
  await saveFile();

  const btn = document.getElementById('btn-publish');
  btn.textContent = 'Đang Publish...';
  btn.disabled = true;
  showStatus('Đang đẩy lên GitHub, vui lòng đợi...', false);
  
  try {
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `docs: Cập nhật bài viết ${currentFilePath || ''}` })
    });
    
    const data = await res.json();
    if (data.success) {
      alert(data.message);
      showStatus('Publish hoàn tất!');
    } else {
      alert('Lỗi Publish: ' + data.error);
      showStatus('Lỗi Publish!', true);
    }
  } catch (err) {
    alert('Không thể kết nối đến server!');
  } finally {
    btn.textContent = 'Publish Lên Web';
    btn.disabled = false;
  }
};

