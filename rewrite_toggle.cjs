const fs = require('fs');
const css = fs.readFileSync('prepared_css.css', 'utf8');

let filteredCss = css;
filteredCss = filteredCss.replace(/html,[\s\S]*?body\s*{[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/body\.night\s*{[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/body\s*{[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/\.stage\s*{[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/\.page-stars[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/\.stage\.night \.page-stars\s*{[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/\.page-stars span\s*{[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/\.shooting-stars\s*{[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/\.stage\.night \.shooting-stars\s*{[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/\.shooting\s*{[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/\.shooting::before\s*{[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/@keyframes shoot\s*{[\s\S]*?100%\s*{\s*opacity: 0;\s*transform:\s*rotate\(-32deg\)\s*translateX\(-30px\);\s*}\s*}/g, '');
filteredCss = filteredCss.replace(/\.scene\s*{[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/\.label[\s\S]*?\.label span\.visible\s*{[\s\S]*?}/g, '');
filteredCss = filteredCss.replace(/\.reflection[\s\S]*?\.reflection \.switch\s*{[\s\S]*?}/g, '');

filteredCss += `
.theme-toggle-container { display: inline-flex; align-items: center; }
.switch { width: 60px; max-width: 60px; aspect-ratio: 60 / 28; box-shadow: 0 0 0 1px rgba(255,255,255,.35) inset, 0 4px 10px rgba(0,0,0,.35); background: transparent; overflow: hidden;}
.toggle-shooting-stars { z-index: 2; overflow: hidden; border-radius: 14px; }
.stars span { position: absolute; width: 2px; height: 2px; background: #fff; border-radius: 50%; }
.sun { right: 8%; width: 14px; background: radial-gradient(circle at 35% 30%, #fff6c8, #ffe98a 60%, #f7d55c 100%); box-shadow: 0 0 6px 2px rgba(255,233,138,.8); }
.moon { left: 8%; font-size: 11px; }
.moon .moon { left: 0; }
.knob { box-shadow: 0 0 6px 2px rgba(255,255,255,.05), 0 0 8px 3px rgba(255,244,190,.55); }
.switch[data-theme='dark'] .knob { box-shadow: 0 0 6px 2px rgba(255,255,255,.9), 0 0 15px 5px rgba(160,190,255,.55); left: 70.5%; }
.cloud-track img { width: 80%; transform: scale(1); margin-left: -5%; margin-right: -5%; }
`;

const astroCode = `---
---

<starlight-theme-toggle class="theme-toggle-container">
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
</starlight-theme-toggle>

<style>
${filteredCss}
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

      randomDots(this.querySelector('#trackStars'), 10);

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
console.log('Successfully updated ThemeToggle.astro');
