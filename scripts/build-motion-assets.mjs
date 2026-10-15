// Self-contained SVG illustrations: no script, remote fonts, trackers or external images.
// Diagram values are illustrative. Product screenshots remain separate in README.md.
import { writeFileSync } from 'node:fs';
const output = new URL('../assets/', import.meta.url);
const font = "'Segoe UI','Malgun Gothic',sans-serif";
const palettes = {
  dark: { bg:'#101728', panel:'#19243a', fg:'#f2f1fa', muted:'#afb9ce', line:'#34435e', mint:'#7ddcc8', gold:'#f2bc76', lilac:'#c4a4ff', track:'#2b3a52' },
  light: { bg:'#f5f4fc', panel:'#ffffff', fg:'#21263b', muted:'#59657a', line:'#d9deeb', mint:'#236d5e', gold:'#865b23', lilac:'#7050a2', track:'#e6e8f1' },
};
const txt = (x,y,s,size,color,extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${s}</text>`;
const common = `
 .pulse{animation:pulse 3.6s ease-in-out infinite}
 .delay{animation-delay:1.2s}.later{animation-delay:2.4s}
 .wire{animation:wire 4s linear infinite}
 .spin{transform-box:fill-box;transform-origin:center;animation:spin 4s linear infinite}
 .caret{animation:caret 1.4s steps(2,end) infinite}
 .line-a{animation:code 6s ease-in-out infinite}.line-b{animation:code 6s 1s ease-in-out infinite}.line-c{animation:code 6s 2s ease-in-out infinite}
 @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
 @keyframes wire{to{stroke-dashoffset:-80}}
 @keyframes spin{to{transform:rotate(360deg)}}
 @keyframes caret{50%{opacity:.15}}
 @keyframes code{0%,100%{opacity:.35}30%,65%{opacity:1}}
 @media(prefers-reduced-motion:reduce){*{animation:none!important}.particle,.glint{display:none}}
`;
function svg(w,h,title,p,body,css='') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title">
<title id="title">${title}</title>
<defs><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="${p.line}" stroke-opacity=".3"/></pattern>
<radialGradient id="bloom"><stop stop-color="${p.lilac}" stop-opacity=".12"/><stop offset="1" stop-color="${p.lilac}" stop-opacity="0"/></radialGradient>
<style>text{font-family:${font}}${common}${css}</style></defs>
<rect width="${w}" height="${h}" rx="20" fill="${p.bg}"/>
<rect width="${w}" height="${h}" rx="20" fill="url(#grid)"/>
<ellipse cx="${w*.8}" cy="${h*.2}" rx="${w*.5}" ry="${h}" fill="url(#bloom)"/>
${body}
</svg>\n`;
}
function signal(p,m) {
  const w=m?600:960,h=m?116:90,y=m?38:45;
  const nodes=m?[84,280,468]:[68,382,700];
  let body=`<path d="M${nodes[0]} ${y}H${w-54}" fill="none" stroke="${p.line}" stroke-width="2"/>
  <path class="wire" d="M${nodes[0]} ${y}H${w-54}" fill="none" stroke="${p.mint}" stroke-opacity=".65" stroke-width="2" stroke-dasharray="8 32"/>`;
  ['아이디어','만들기','써 보고 고치기'].forEach((s,i)=>{
    const x=nodes[i];
    body+=`<rect x="${x-16}" y="${y-16}" width="32" height="32" rx="10" fill="${p.panel}" stroke="${p.line}"/>
    <circle class="pulse ${i===1?'delay':i===2?'later':''}" cx="${x}" cy="${y}" r="6" fill="${[p.gold,p.mint,p.lilac][i]}"/>`;
    if(m) body+=txt(x,89,s,26,p.fg,'text-anchor="middle"');
    else body+=`<rect x="${x+26}" y="24" width="${i===2?190:105}" height="40" rx="6" fill="${p.bg}"/>`+txt(x+36,53,s,24,p.fg);
  });
  return svg(w,h,'아이디어 → 만들기 → 써 보고 고치기',p,body);
}
function quota(p,m) {
  const w=m?600:960,h=m?552:338,cw=m?536:432;
  let body=txt(32,m?52:48,'남은 한도, 한눈에.',m?34:32,p.fg,'font-weight="700"');
  if(!m)body+=txt(928,48,'Codex · Claude',20,p.muted,'text-anchor="end"');
  const providers=[['Codex',62,28,p.mint],['Claude',74,41,p.gold]];
  for(let i=0;i<2;i++){
    const [name,a,b,c]=providers[i],x=m?32:32+i*464,y=m?84+i*196:78;
    const barx=m?135:114,barw=m?236:180;
    body+=`<g transform="translate(${x} ${y})"><rect width="${cw}" height="180" rx="16" fill="${p.panel}" stroke="${p.line}"/>`;
    body+=txt(22,40,name,28,p.fg,'font-weight="700"');
    body+=`<circle class="pulse ${i?'delay':''}" cx="${cw-28}" cy="30" r="5" fill="${c}"/>`;
    for(let j=0;j<2;j++){
      const v=j?b:a,yy=82+j*54;
      body+=txt(22,yy+3,j?'주간':'5시간',m?28:24,p.muted);
      body+=`<rect x="${barx}" y="${yy-15}" width="${barw}" height="18" rx="9" fill="${p.track}"/>
      <rect x="${barx}" y="${yy-15}" width="${barw*v/100}" height="18" rx="9" fill="${c}"/>
      <clipPath id="bar-${i}-${j}"><rect x="${barx}" y="${yy-15}" width="${barw*v/100}" height="18" rx="9"/></clipPath>
      <g clip-path="url(#bar-${i}-${j})"><rect class="glint" x="${barx-48}" y="${yy-15}" width="48" height="18" fill="#fff" opacity=".32" style="animation-delay:${i*.7+j*.35}s"/></g>`;
      body+=txt(cw-20,yy+3,`${v}% 남음`,m?27:23,p.fg,'text-anchor="end"');
    }
    body+='</g>';
  }
  const cy=m?494:289;
  body+=`<circle cx="46" cy="${cy-6}" r="13" fill="none" stroke="${p.lilac}" stroke-width="2.5"/>
  <path d="M46 ${cy-15}v9l6 4" fill="none" stroke="${p.lilac}" stroke-width="2.5" stroke-linecap="round"/>
  <circle class="pulse" cx="46" cy="${cy-6}" r="21" fill="none" stroke="${p.lilac}" stroke-opacity=".25"/>`;
  body+=txt(76,cy+3,'초기화 시각 확인 · 초기화 알림',m?27:23,p.fg);
  body+=txt(m?32:928,m?532:320,'설명용 예시 · 실제 계정 수치가 아닙니다',m?23:19,p.muted,m?'':'text-anchor="end"');
  return svg(w,h,'Codex와 Claude의 5시간·주간 잔여 한도 예시. 실제 계정 수치가 아닙니다.',p,body,
    '@keyframes shimmer{0%,18%{transform:translateX(0)}65%,100%{transform:translateX(300px)}}.glint{animation:shimmer 8s ease-in-out infinite}');
}
function bridge(p,m) {
  const w=m?600:960,h=m?200:158;
  let body=txt(32,m?55:57,'동료는 생겼고,',m?30:29,p.muted);
  body+=txt(32,m?103:106,'이제 작업대를 넓힐 차례.',m?32:38,p.fg,'font-weight="700"');
  const x=m?32:718,y=m?150:57,len=m?536:210;
  body+=`<path d="M${x} ${y}h${len}" stroke="${p.line}" stroke-width="2"/>
  <path class="wire" d="M${x} ${y}h${len}" stroke="${p.mint}" stroke-width="3" stroke-dasharray="8 32"/>`;
  for(let i=0;i<3;i++){
    const xx=x+i*len/2;
    body+=`<rect class="float-${i}" x="${xx-8}" y="${y-8}" width="16" height="16" rx="5" fill="${[p.gold,p.lilac,p.mint][i]}"/>`;
  }
  if(!m)body+=txt(823,110,'다음 작업실 →',21,p.muted,'text-anchor="middle"');
  return svg(w,h,'동료는 생겼고, 이제 작업대를 넓힐 차례.',p,body,
    '@keyframes bob{50%{transform:translateY(-6px)}}.float-0,.float-1,.float-2{animation:bob 4s ease-in-out infinite}.float-1{animation-delay:.45s}.float-2{animation-delay:.9s}');
}
function terminal(p,m) {
  const w=m?600:960,h=m?778:432;
  const pc={x:32,y:m?132:94,w:m?536:520,h:224};
  const phone={x:m?205:728,y:m?414:86,w:190,h:260};
  let body=m?txt(32,50,'작업은 PC에서.',34,p.fg,'font-weight="700"')+txt(32,96,'확인은 내 손에서.',34,p.fg,'font-weight="700"'):txt(32,50,'작업은 PC에서. 확인은 내 손에서.',32,p.fg,'font-weight="700"');
  body+=`<g transform="translate(${pc.x} ${pc.y})"><rect width="${pc.w}" height="${pc.h}" rx="16" fill="${p.panel}" stroke="${p.line}" stroke-width="2"/>
  <path d="M0 44h${pc.w}" stroke="${p.line}"/>
  <circle cx="22" cy="22" r="4" fill="${p.gold}"/><circle cx="38" cy="22" r="4" fill="${p.lilac}"/><circle cx="54" cy="22" r="4" fill="${p.mint}"/>`;
  body+=txt(76,30,'작업 PC',24,p.fg);
  body+=txt(pc.w-20,30,'실행 중',22,p.mint,'text-anchor="end"');
  body+=`<path d="M${pc.w/2} 44v180" stroke="${p.line}"/>`;
  for(let i=0;i<2;i++){
    const xx=i*pc.w/2+18;
    body+=txt(xx,82,i?'Codex':'Claude',m?29:27,p.fg,'font-weight="700"');
    body+=txt(xx,116,i?'확인 요청':'작업 중',m?27:24,i?p.gold:p.mint);
    if(i)body+=`<circle class="pulse" cx="${xx+160}" cy="106" r="12" fill="${p.gold}" fill-opacity=".15"/>`+txt(xx+160,114,'?',22,p.gold,'text-anchor="middle" font-weight="700"');
    else body+=`<circle class="spin" cx="${xx+130}" cy="106" r="11" fill="none" stroke="${p.mint}" stroke-width="3" stroke-dasharray="40 30"/>`;
    for(let j=0;j<3;j++)body+=`<rect class="line-${['a','b','c'][j]}" x="${xx}" y="${143+j*20}" width="${[158,202,126][j]}" height="7" rx="3.5" fill="${j===1?p.lilac:p.muted}" opacity=".55"/>`;
  }
  body+='</g>';
  const wire=m?'M300 366v36':'M570 208H710';
  body+=`<path d="${wire}" fill="none" stroke="${p.line}" stroke-width="3"/><path class="wire" d="${wire}" fill="none" stroke="${p.mint}" stroke-width="3" stroke-dasharray="8 12"/>`;
  if(!m)body+=txt(640,185,'Tailscale',21,p.muted,'text-anchor="middle"');
  else body+=txt(326,392,'Tailscale',25,p.muted);
  body+=`<g transform="translate(${phone.x} ${phone.y})"><rect width="${phone.w}" height="${phone.h}" rx="26" fill="${p.panel}" stroke="${p.muted}" stroke-width="2"/>
  <rect x="63" y="12" width="64" height="5" rx="2.5" fill="${p.line}"/>`;
  body+=txt(20,57,'같은 터미널',26,p.fg,'font-weight="700"');
  body+=txt(20,92,'출력 확인',24,p.muted);
  for(let j=0;j<3;j++)body+=`<rect class="line-${['a','b','c'][j]}" x="20" y="${112+j*19}" width="${[116,148,94][j]}" height="6" rx="3" fill="${j===1?p.lilac:p.muted}" opacity=".55"/>`;
  body+=`<rect x="16" y="177" width="158" height="52" rx="10" fill="${p.bg}" stroke="${p.line}"/>`;
  body+=txt(27,211,'입력',25,p.mint)+`<rect class="caret" x="91" y="212" width="16" height="3" fill="${p.mint}"/>`;
  body+='</g>';
  body+=txt(m?300:480,m?718:382,'Tailscale 연결 · 작업 PC는 켜 둔 채로',m?28:25,p.fg,'text-anchor="middle"');
  body+=txt(m?300:480,m?753:413,'연결 흐름을 그린 개념 애니메이션',m?24:20,p.muted,'text-anchor="middle"');
  return svg(w,h,'작업 PC에서 실행 중인 터미널을 Tailscale로 연결한 휴대폰에서 확인하고 입력하는 개념도',p,body);
}
for(const [theme,p] of Object.entries(palettes))for(const m of [false,true]){
  for(const [name,build] of Object.entries({'workshop-signal':signal,'quota-story':quota,'workbench-bridge':bridge,'terminal-flow':terminal})){
    writeFileSync(new URL(`${name}-${theme}${m?'-mobile':''}.svg`,output),build(p,m));
  }
}
