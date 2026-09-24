const fs = require('fs');

let css = fs.readFileSync('original_filtered.css', 'utf8');

// Append wrapper CSS
css += `
.theme-toggle-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 28px;
}
.scaler {
  transform: scale(0.2);
  transform-origin: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.switch {
  width: 300px !important;
  height: 96px !important;
  margin: 0 !important;
}
`;

const astroCode = `---
---

<starlight-theme-toggle class="theme-toggle-container">
  <div class="scaler">
    <button 
      type="button" 
      id="theme-toggle-btn"
      class="switch"
      data-theme="light"
      aria-label="Toggle day and night mode"
      title="Toggle day and night mode"
    >
      <div class="track">
        <div class="stars" id="trackStars"></div>
        <div class="toggle-shooting-stars">
          <span class="toggle-shooting s1"></span>
          <span class="toggle-shooting s2"></span>
          <span class="toggle-shooting s3"></span>
        </div>
        <div class="moon">
          <div class="moon">🌙</div>
        </div>
        <div class="sun"></div>
        <div class="birds">
          <svg class="bird b1" viewBox="0 0 14 8" aria-hidden="true"><path class="wing" d="M0 6 Q7 -2 14 6 Q7 3 0 6Z" fill="#eef6ff"/></svg>
          <svg class="bird b2" viewBox="0 0 14 8" aria-hidden="true"><path class="wing" d="M0 6 Q7 -2 14 6 Q7 3 0 6Z" fill="#eef6ff"/></svg>
          <svg class="bird b3" viewBox="0 0 14 8" aria-hidden="true"><path class="wing" d="M0 6 Q7 -2 14 6 Q7 3 0 6Z" fill="#eef6ff"/></svg>
        </div>
        <div class="clouds">
          <div class="cloud-track">
            <img src="/images/cloud2.png" alt="" aria-hidden="true" draggable="false">
            <img src="/images/cloud2.png" alt="" aria-hidden="true" draggable="false">
            <img src="/images/cloud2.png" alt="" aria-hidden="true" draggable="false">
            <img src="/images/cloud2.png" alt="" aria-hidden="true" draggable="false">
          </div>
        </div>
      </div>
      <div class="knob"></div>
    </button>
  </div>
</starlight-theme-toggle>

<style>
${css}
</style>

<script>
  type Theme = 'dark' | 'light';
  const storageKey = 'starlight-theme';

  const getPreferredColorScheme = (): Theme =>
    window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

  const parseTheme = (theme: unknown): Theme =>
    theme === 'dark' || theme === 'light' ? theme : getPreferredColorScheme();

  const loadTheme = (): Theme =>
    parseTheme(typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : getPreferredColorScheme());

  function storeTheme(theme: Theme): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, theme);
    }
  }

  function updateTooltipAndIcon(theme: Theme): void {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;

    btn.setAttribute('data-theme', theme);

    // Tooltip hints at the NEXT action upon clicking
    const tooltips: Record<Theme, string> = {
      light: 'Nhấn để chuyển sang giao diện tối',
      dark: 'Nhấn để chuyển sang giao diện sáng'
    };

    const nextTooltip = tooltips[theme];
    btn.setAttribute('title', nextTooltip);
    btn.setAttribute('aria-label', nextTooltip);
  }

  function applyTheme(theme: Theme): void {
    document.documentElement.dataset.themePreference = theme;
    document.documentElement.dataset.theme = theme;
    storeTheme(theme);
    updateTooltipAndIcon(theme);
  }

  function randomDots(container, count) {
    if (!container) return;
    let html = '';
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = (Math.random() * 3).toFixed(2);
      html += '<span style="left:'+x+'%;top:'+y+'%;animation-delay:'+delay+'s;"></span>';
    }
    container.innerHTML = html;
  }

  class StarlightThemeToggle extends HTMLElement {
    constructor() {
      super();
      const currentTheme = loadTheme();
      applyTheme(currentTheme);

      randomDots(this.querySelector('#trackStars'), 14);

      const btn = this.querySelector('button');
      btn?.addEventListener('click', () => {
        const activeTheme = loadTheme();
        const nextTheme: Theme = activeTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
      });
    }
  }

  if (!customElements.get('starlight-theme-toggle')) {
    customElements.define('starlight-theme-toggle', StarlightThemeToggle);
  }

  // Sync state on initial execution
  applyTheme(loadTheme());
</script>
`;

fs.writeFileSync('src/components/ThemeToggle.astro', astroCode);
console.log('Successfully updated ThemeToggle.astro with scaled original design');
