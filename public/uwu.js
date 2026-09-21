(function () {
  const originalTexts = new WeakMap();
  const originalAttrs = new WeakMap();
  let originalTitle = document.title;

  function getIsUwuFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('uwu') === 'true' || (params.has('uwu') && params.get('uwu') !== 'false');
  }

  let isUwu = getIsUwuFromUrl();

  function transformNodeToUwu(node) {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const val = node.nodeValue;
      if (!val || !val.trim()) return;
      const parent = node.parentElement;
      if (!parent) return;

      // Bỏ qua script, style, SVG, và chính nút bấm toggle UwU
      const tag = parent.tagName.toLowerCase();
      if (
        tag === 'script' ||
        tag === 'style' ||
        tag === 'noscript' ||
        tag === 'svg' ||
        parent.closest('svg') ||
        parent.closest('#uwu-toggle-link')
      ) {
        return;
      }

      if (!originalTexts.has(node)) {
        originalTexts.set(node, val);
      }
      if (node.nodeValue !== 'UwU') {
        node.nodeValue = 'UwU';
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (
        tag === 'script' ||
        tag === 'style' ||
        tag === 'noscript' ||
        tag === 'svg' ||
        node.id === 'uwu-toggle-link' ||
        node.closest('#uwu-toggle-link')
      ) {
        return;
      }

      if (node.hasAttribute('alt')) {
        if (!originalAttrs.has(node)) originalAttrs.set(node, {});
        const attrs = originalAttrs.get(node);
        if (!attrs.alt) attrs.alt = node.getAttribute('alt');
        if (node.getAttribute('alt') !== 'UwU') node.setAttribute('alt', 'UwU');
      }
      if (node.hasAttribute('placeholder')) {
        if (!originalAttrs.has(node)) originalAttrs.set(node, {});
        const attrs = originalAttrs.get(node);
        if (!attrs.placeholder) attrs.placeholder = node.getAttribute('placeholder');
        if (node.getAttribute('placeholder') !== 'UwU') node.setAttribute('placeholder', 'UwU');
      }

      for (let child = node.firstChild; child; child = child.nextSibling) {
        transformNodeToUwu(child);
      }
    }
  }

  function restoreNode(node) {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      if (originalTexts.has(node)) {
        node.nodeValue = originalTexts.get(node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'noscript' || tag === 'svg') return;

      if (originalAttrs.has(node)) {
        const attrs = originalAttrs.get(node);
        if (attrs.alt !== undefined) node.setAttribute('alt', attrs.alt);
        if (attrs.placeholder !== undefined) node.setAttribute('placeholder', attrs.placeholder);
      }

      for (let child = node.firstChild; child; child = child.nextSibling) {
        restoreNode(child);
      }
    }
  }

  let observer = null;

  function applyUwu() {
    if (document.title && document.title !== 'UwU') {
      originalTitle = document.title;
    }
    if (document.body) {
      transformNodeToUwu(document.body);
    }
    document.title = 'UwU';

    if (!observer && document.body) {
      observer = new MutationObserver((mutations) => {
        if (!isUwu) return;
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => transformNodeToUwu(node));
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  function removeUwu() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (document.body) {
      restoreNode(document.body);
    }
    document.title = originalTitle || 'HyperLis Docs';
  }

  function updateToggleLink() {
    const toggleLink = document.getElementById('uwu-toggle-link');
    if (!toggleLink) return;

    const currentUrl = new URL(window.location.href);
    if (isUwu) {
      currentUrl.searchParams.delete('uwu');
      toggleLink.href = currentUrl.pathname + (currentUrl.search ? currentUrl.search : '');
      toggleLink.setAttribute('title', 'no UwU anymore');
      toggleLink.textContent = 'no UwU anymore'; // Khi bật UwU: đổi sang chữ này
    } else {
      currentUrl.searchParams.set('uwu', 'true');
      toggleLink.href = currentUrl.pathname + currentUrl.search;
      toggleLink.setAttribute('title', 'wanna UwU');
      toggleLink.textContent = 'wanna UwU'; // Khi tắt: trở về chữ này
    }
  }

  function toggleUwuState() {
    isUwu = !isUwu;
    const url = new URL(window.location.href);
    if (isUwu) {
      url.searchParams.set('uwu', 'true');
      applyUwu();
    } else {
      url.searchParams.delete('uwu');
      removeUwu();
    }
    // Cập nhật URL trên thanh địa chỉ mà KHÔNG reload trang và KHÔNG bị nhảy vị trí cuộn!
    window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
    updateToggleLink();
  }

  // Bắt sự kiện Click dạng Event Delegation: hoạt động 100% kể cả khi footer được render lại
  document.addEventListener('click', function (e) {
    const target = e.target;
    if (target && target.closest) {
      const toggleLink = target.closest('#uwu-toggle-link');
      if (toggleLink) {
        e.preventDefault();
        toggleUwuState();
      }
    }
  });

  // Hỗ trợ nút Back/Forward của trình duyệt
  window.addEventListener('popstate', function () {
    const newUwu = getIsUwuFromUrl();
    if (newUwu !== isUwu) {
      isUwu = newUwu;
      if (isUwu) {
        applyUwu();
      } else {
        removeUwu();
      }
      updateToggleLink();
    }
  });

  // Easter Egg keyboard shortcut: gõ 'uwu'
  let keyBuffer = '';
  window.addEventListener('keydown', function (e) {
    if (
      e.target &&
      (e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable)
    ) {
      return;
    }
    if (!e.key || typeof e.key !== 'string') return;
    keyBuffer += e.key.toLowerCase();
    if (keyBuffer.length > 3) keyBuffer = keyBuffer.slice(-3);
    if (keyBuffer === 'uwu') {
      keyBuffer = '';
      toggleUwuState();
    }
  });

  function init() {
    updateToggleLink();
    if (isUwu) {
      applyUwu();
      setTimeout(applyUwu, 100);
      setTimeout(applyUwu, 400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', init);
})();
