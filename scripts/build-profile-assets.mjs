// Existing hero.svg palette and grid, extended into native SVG UI components.
import { writeFileSync } from 'node:fs';
const out = new URL('../assets/', import.meta.url);
const font = "'Segoe UI','Malgun Gothic',sans-serif";
function save(name, body) { writeFileSync(new URL(name, out), body); }
const sections = [
  ['mongle', '01', 'MONGLE', '일할 때도, 쉴 때도 함께.', '#f2bc76', '#715127'],
  ['terminal', '02', 'MONGLE TERMINAL', '작업은 그대로. 어디서든, 이어서.', '#7ddcc8', '#236754'],
  ['lab', '03', 'DEVELOPER LAB', '직접 쓰고, 고치고, 나눕니다.', '#c4a4ff', '#64469b'],
];
for (const [slug, n, label, line, accent, lightAccent] of sections) {
  for (const theme of ['dark', 'light']) {
    for (const mobile of [false, true]) {
      const w = mobile ? 600 : 960, h = mobile ? 210 : 164;
      const dark = theme === 'dark', bg = dark ? '#0d1424' : '#f5f4fc';
      const fg = dark ? '#f0f2fc' : '#171c32', c = dark ? accent : lightAccent;
      save(`${slug}-${theme}${mobile ? '-mobile' : ''}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title">
<title id="title">${n} · ${label} — ${line}</title>
<defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="${c}" stroke-opacity=".065"/></pattern></defs>
<rect width="${w}" height="${h}" rx="18" fill="${bg}"/>
<rect width="${w}" height="${h}" rx="18" fill="url(#grid)"/>
<path d="M30 1H${w-30}" stroke="${c}" stroke-opacity=".55"/>
<text x="32" y="${mobile?55:49}" fill="${c}" font-family="monospace" font-size="${mobile?22:18}" letter-spacing="3">${n} / ${label}</text>
<text x="32" y="${mobile?130:109}" fill="${fg}" font-family="${font}" font-size="${mobile?29:34}" font-weight="700">${line}</text>
<path d="M32 ${h-27}H${w-32}" stroke="${c}" stroke-opacity=".18"/>
<path d="M32 ${h-27}H108" stroke="${c}" stroke-width="3"/>
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
