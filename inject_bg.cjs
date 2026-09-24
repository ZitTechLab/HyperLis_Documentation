const fs = require('fs');

let astroCode = fs.readFileSync('src/components/ThemeToggle.astro', 'utf8');

// 1. Inject HTML inside <starlight-theme-toggle class="theme-toggle-container">
const htmlToInject = `
  <div class="global-night-bg" id="globalNightBg">
    <div class="page-stars" id="pageStarsBg"></div>
    <div class="shooting-stars">
      <div class="shooting" style="top:14%;left:70%;animation-duration:5.5s;animation-delay:.2s;"></div>
      <div class="shooting" style="top:26%;left:40%;animation-duration:8s;animation-delay:.5s;"></div>
      <div class="shooting" style="top:8%;left:85%;animation-duration:7s;animation-delay:.8s;"></div>
    </div>
  </div>
`;
astroCode = astroCode.replace(
  /<starlight-theme-toggle class="theme-toggle-container">/,
  `<starlight-theme-toggle class="theme-toggle-container">\n${htmlToInject}`
);

// 2. Inject CSS inside <style>
const cssToInject = `
.global-night-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  opacity: 0;
  transition: opacity 1.2s ease;
  background: radial-gradient(120% 90% at 50% 30%, #0a1230 0%, #04050f 75%);
}
:global(:root[data-theme='dark'] .global-night-bg) {
  opacity: 1;
}
:global(:root[data-theme='dark']) {
  --sl-color-bg: transparent !important;
  background-color: transparent !important;
}
:global(:root[data-theme='dark'] body) {
  background-color: transparent !important;
}

.page-stars {
  position: absolute;
  inset: 0;
}
.page-stars span {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #fff;
  border-radius: 50%;
  animation: twinkleBg 3s ease-in-out infinite;
}
@keyframes twinkleBg {
  0%, 100% { opacity: .15; }
  50% { opacity: .9; }
}

.shooting-stars {
  position: absolute;
  inset: 0;
}
.shooting {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #fff;
  opacity: 0;
  transform: rotate(-32deg);
  animation: shootBg .5s linear infinite;
}
.shooting::before {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  width: 90px;
  height: 1px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.9));
}
@keyframes shootBg {
  0% { opacity: 0; transform: rotate(-32deg) translateX(0); }
  2% { opacity: 1; }
  12% { opacity: 0; transform: rotate(-32deg) translateX(-160px); }
  100% { opacity: 0; transform: rotate(-32deg) translateX(-160px); }
}
`;
astroCode = astroCode.replace(
  /<style>/,
  `<style>\n${cssToInject}`
);

// 3. Inject JS inside script
const jsToInject = `
      randomDots(this.querySelector('#pageStarsBg'), 50);
`;
astroCode = astroCode.replace(
  /randomDots\(this\.querySelector\('#trackStars'\), 14\);/,
  `randomDots(this.querySelector('#trackStars'), 14);\n${jsToInject}`
);

fs.writeFileSync('src/components/ThemeToggle.astro', astroCode);
console.log('Successfully injected global starry background!');
