// Existing hero.svg palette and grid, extended into native SVG UI components.
import { writeFileSync } from 'node:fs';
const out = new URL('../assets/', import.meta.url);
const font = "'Segoe UI','Malgun Gothic',sans-serif";
function save(name, body) { writeFileSync(new URL(name, out), body); }
const sections = [
  ['mongle', '01', 'Mongle', ['작업 중엔 타닥타닥.', '끝나면 폴짝.'], '#f2bc76', '#715127'],
  ['terminal', '02', 'Mongle Terminal', ['흩어진 창은 모으고,', '하던 일은 이어서.'], '#7ddcc8', '#236754'],
  ['lab', '03', '작업 노트', ['직접 쓰고, 고치고,', '다시 만들어 봅니다.'], '#c4a4ff', '#64469b'],
];
for (const [slug, n, label, lines, accent, lightAccent] of sections) {
  for (const theme of ['dark', 'light']) {
    for (const mobile of [false, true]) {
      const w = mobile ? 600 : 960, h = mobile ? 222 : 164;
      const dark = theme === 'dark', bg = dark ? '#0d1424' : '#f5f4fc';
      const fg = dark ? '#f0f2fc' : '#171c32', c = dark ? accent : lightAccent;
      save(`${slug}-${theme}${mobile ? '-mobile' : ''}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title">
<title id="title">${n} · ${label} — ${lines.join(' ')}</title>
<defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="${c}" stroke-opacity=".065"/></pattern>
<linearGradient id="trail"><stop stop-color="${c}" stop-opacity="0"/><stop offset="1" stop-color="${c}"/></linearGradient>
<clipPath id="rail"><rect x="32" y="${h-30}" width="${w-64}" height="6" rx="3"/></clipPath>
<style>.trail{animation:travel 7s ease-in-out infinite}.dot{animation:breathe 3s ease-in-out infinite}@keyframes travel{0%{transform:translateX(-140px)}100%{transform:translateX(${w}px)}}@keyframes breathe{50%{opacity:.35}}@media(prefers-reduced-motion:reduce){*{animation:none!important}.trail{display:none}}</style></defs>
<rect width="${w}" height="${h}" rx="18" fill="${bg}"/>
<rect width="${w}" height="${h}" rx="18" fill="url(#grid)"/>
<path d="M30 1H${w-30}" stroke="${c}" stroke-opacity=".55"/>
<text x="32" y="${mobile?48:49}" fill="${c}" font-family="${font}" font-size="${mobile?25:20}" letter-spacing="2">${n} / ${label}</text>
<circle class="dot" cx="${w-40}" cy="${mobile?40:42}" r="5" fill="${c}"/>
<text x="32" y="${mobile?106:109}" fill="${fg}" font-family="${font}" font-size="${mobile?36:34}" font-weight="700">${mobile?`${lines[0]}<tspan x="32" dy="48">${lines[1]}</tspan>`:lines.join(' ')}</text>
<path d="M32 ${h-27}H${w-32}" stroke="${c}" stroke-opacity=".18"/>
<path d="M32 ${h-27}H108" stroke="${c}" stroke-width="3"/>
<g clip-path="url(#rail)"><rect class="trail" x="32" y="${h-29}" width="140" height="4" fill="url(#trail)"/></g>
</svg>`);
    }
  }
}
const buttons = [
 ['nav-mongle','몽글',118,'#243040','#f2bc76'],
 ['nav-terminal','몽글 터미널',148,'#243040','#7ddcc8'],
 ['nav-lab','개발 기록',128,'#243040','#c4a4ff'],
 ['download-mongle','몽글 다운로드',206,'#f2bc76','#15202d'],
 ['download-terminal','Windows 다운로드',226,'#7ddcc8','#15202d'],
 ['read-guide','사용법 살펴보기',202,'#283348','#f2f4fc'],
];
for(const [slug,label,w,bg,fg] of buttons) save(`${slug}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="48" viewBox="0 0 ${w} 48" role="img" aria-labelledby="t"><title id="t">${label}</title><rect x=".5" y=".5" width="${w-1}" height="47" rx="12" fill="${bg}"/><text x="${w/2}" y="30" text-anchor="middle" fill="${fg}" font-family="${font}" font-size="17" font-weight="650">${label}</text></svg>`);
