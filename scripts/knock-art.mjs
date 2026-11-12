// 몽글 노크를 설명하는 그림의 부품. 앱의 실제 색과 치수로 알약과 목록을 SVG로 그린다.
// 스크립트, 외부 글꼴, 외부 이미지를 쓰지 않는다. README에 <img>로 넣어도 움직인다.
// 이 파일은 몽글 노크 저장소(tools/)와 프로필 저장소(scripts/)에 같은 내용으로 둔다.

export const font = "'Segoe UI','Malgun Gothic',sans-serif";

// 앱의 화면 색(crates/knock-app/src/paint.rs의 Palette).
export const app = {
  light: { surface: '#fffdf8', ink: '#292722', soft: '#716b61', hairline: '#493e30', hairlineOpacity: 0.16, accent: '#b5761f', shadow: '#3c301e', shadowOpacity: 0.22 },
  dark: { surface: '#262320', ink: '#f4efe6', soft: '#b5ac9f', hairline: '#fff0d7', hairlineOpacity: 0.14, accent: '#e3a857', shadow: '#000000', shadowOpacity: 0.5 },
};

// 글자 폭을 어림한다. SVG는 글자를 재지 못한다.
export function measure(text, size) {
  let width = 0;
  for (const ch of text) {
    if (/[\u3131-\uD7A3\u4E00-\u9FFF]/.test(ch)) width += size;
    else if (ch === ' ') width += size * 0.3;
    else if (/[0-9]/.test(ch)) width += size * 0.56;
    else if (/[·.,:]/.test(ch)) width += size * 0.3;
    else width += size * 0.58;
  }
  return width;
}

const text = (x, y, s, size, fill, extra = '') => '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + fill + '" ' + extra + '>' + s + '</text>';

// 그림자. 한 그림에 한 번만 defs에 넣는다.
export function shadow(c, id = 'lift') {
  return '<filter id="' + id + '" x="-20%" y="-30%" width="140%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="' + c.shadow + '" flood-opacity="' + c.shadowOpacity + '"/></filter>';
}

// 알약의 표시: 고리와 점.
export function mark(cx, cy, c, cls = '') {
  return '<circle cx="' + cx + '" cy="' + cy + '" r="6.4" fill="none" stroke="' + c.ink + '" stroke-width="1.6" opacity=".8"/>'
    + '<circle class="' + cls + '" cx="' + cx + '" cy="' + cy + '" r="2.9" fill="' + c.accent + '"/>';
}

// 알약. right는 오른쪽 끝의 x다. count가 없으면 조용할 때의 동그라미다.
export function pill(right, y, c, { count = '', label = '', ripple = false, filter = 'lift' } = {}) {
  const quiet = !count;
  const width = quiet ? 32 : Math.round(33 + measure(count, 13) + 7 + measure(label, 12) + 13);
  const x = right - width;
  let out = '<g filter="url(#' + filter + ')"><rect x="' + x + '" y="' + y + '" width="' + width + '" height="32" rx="16" fill="' + c.surface + '" stroke="' + c.hairline + '" stroke-opacity="' + c.hairlineOpacity + '"/></g>';
  const cx = x + 16, cy = y + 16;
  if (ripple) {
    out += '<circle class="knock k1" cx="' + cx + '" cy="' + cy + '" r="7" fill="none" stroke="' + c.accent + '" stroke-width="1.4"/>'
      + '<circle class="knock k2" cx="' + cx + '" cy="' + cy + '" r="7" fill="none" stroke="' + c.accent + '" stroke-width="1.4"/>';
  }
  out += mark(cx, cy, c, ripple ? 'beat' : '');
  if (!quiet) {
    out += text(x + 33, y + 20.5, count, 13, c.ink, 'font-weight="700"');
    out += text(x + 33 + measure(count, 13) + 7, y + 20.5, label, 12, c.soft);
  }
  return { svg: out, width, x };
}

// 펼친 목록. rows는 { title, sub, cls }의 배열이다. 맨 위 줄 앞에만 점을 찍는다.
export function panel(x, y, c, rows, { head = '기다리는 대화 ' + rows.length, filter = 'lift' } = {}) {
  const rowHeight = 50.75;
  const height = Math.round(30.2 + rows.length * rowHeight + 10);
  let out = '<g filter="url(#' + filter + ')"><rect x="' + x + '" y="' + y + '" width="340" height="' + height + '" rx="12" fill="' + c.surface + '" stroke="' + c.hairline + '" stroke-opacity="' + c.hairlineOpacity + '"/></g>';
  out += text(x + 16, y + 22, head, 12, c.soft, 'font-weight="700"');
  rows.forEach((row, index) => {
    const top = y + 30.2 + index * rowHeight;
    out += '<g class="' + (row.cls || '') + '">';
    if (index === 0) out += '<circle cx="' + (x + 17) + '" cy="' + (top + 19) + '" r="3" fill="' + c.accent + '"/>';
    out += text(x + 32, top + 23.5, row.title, 13, c.ink, 'font-weight="700"');
    out += text(x + 32, top + 41.5, row.sub, 12, c.soft);
    out += text(x + 322, top + 32, '확인함', 12, c.soft, 'text-anchor="end"');
    out += '</g>';
  });
  return { svg: out, height };
}

// Windows 알림 모양의 카드.
export function toast(x, y, c, { title, body, width = 250, filter = 'lift' }) {
  let out = '<g filter="url(#' + filter + ')"><rect x="' + x + '" y="' + y + '" width="' + width + '" height="64" rx="10" fill="' + c.surface + '" stroke="' + c.hairline + '" stroke-opacity="' + c.hairlineOpacity + '"/></g>';
  out += mark(x + 22, y + 22, c);
  out += text(x + 40, y + 26.5, title, 13, c.ink, 'font-weight="700"');
  out += text(x + 40, y + 46, body, 12, c.soft);
  return out;
}

// 움직임. 알약의 "똑똑"과 줄이 차례로 나타나는 것.
export const motion = ''
  + '.knock{transform-box:fill-box;transform-origin:center;opacity:0;animation:knock 4.8s ease-out infinite}.k2{animation-delay:.42s}'
  + '.beat{transform-box:fill-box;transform-origin:center;animation:beat 4.8s ease-in-out infinite}'
  + '.r1,.r2,.r3{animation:rowin 9.6s ease-out infinite}.r2{animation-delay:.3s}.r3{animation-delay:.6s}'
  + '.wire{animation:wire 4s linear infinite}'
  + '.pulse{animation:pulse 3.6s ease-in-out infinite}.delay{animation-delay:1.2s}.later{animation-delay:2.4s}'
  + '@keyframes knock{0%{opacity:.7;transform:scale(1)}22%{opacity:0;transform:scale(3.1)}100%{opacity:0;transform:scale(3.1)}}'
  + '@keyframes beat{0%,9%,100%{transform:scale(1)}4%{transform:scale(1.35)}13%{transform:scale(1.35)}18%{transform:scale(1)}}'
  + '@keyframes rowin{0%{opacity:0;transform:translateY(5px)}7%,93%{opacity:1;transform:none}100%{opacity:0;transform:none}}'
  + '@keyframes wire{to{stroke-dashoffset:-80}}'
  + '@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}'
  + '@media(prefers-reduced-motion:reduce){*{animation:none!important}.knock{display:none}}';

// "바로 울리지 않습니다": 0분, 4분, 15분에 생기는 일.
// p는 바탕의 색({ fg, muted, line, panel, accent }), c는 앱의 색, mobile이면 세로로 쌓는다.
export function flow(p, c, mobile) {
  const w = mobile ? 600 : 960;
  const steps = [
    { time: '0분', what: 'AI가 끝내거나 물어봄', draw: (cx, y) => pill(cx + 16, y + 16, c).svg },
    { time: '4분', what: '알약에 올라옵니다', draw: (cx, y) => { const made = pill(0, 0, c, { count: '1건', label: '가장 오래 4분' }); return pill(cx + made.width / 2, y + 16, c, { count: '1건', label: '가장 오래 4분' }).svg; } },
    { time: '15분', what: 'Windows 알림으로 다시', draw: (cx, y) => toast(cx - 115, y, c, { title: '결제 오류 수정', body: '15분째 기다리는 중 · 대화 열기', width: 230 }) },
  ];
  let body = '';
  let h;
  if (!mobile) {
    h = 350;
    body += text(32, 50, '바로 울리지 않습니다.', 32, p.fg, 'font-weight="700"');
    body += text(928, 48, '승인은 1분 · 질문과 완료는 4분 뒤', 20, p.muted, 'text-anchor="end"');
    const xs = [150, 470, 780];
    const lineY = 134;
    body += '<path d="M' + xs[0] + ' ' + lineY + 'H' + xs[2] + '" stroke="' + p.line + '" stroke-width="2"/>';
    body += '<path class="wire" d="M' + xs[0] + ' ' + lineY + 'H' + xs[2] + '" stroke="' + p.accent + '" stroke-opacity=".7" stroke-width="2" stroke-dasharray="8 32"/>';
    steps.forEach((step, i) => {
      const cx = xs[i];
      body += '<rect x="' + (cx - 15) + '" y="' + (lineY - 15) + '" width="30" height="30" rx="10" fill="' + p.panel + '" stroke="' + p.line + '"/>';
      body += '<circle class="pulse ' + ['', 'delay', 'later'][i] + '" cx="' + cx + '" cy="' + lineY + '" r="5.5" fill="' + p.accent + '"/>';
      body += text(cx, lineY - 28, step.time, 22, p.accent, 'text-anchor="middle" font-weight="700"');
      // 그림은 가운데를 맞추고, 높이가 달라도 아래 설명은 같은 줄에 둔다.
      const top = i === 2 ? 170 : 190;
      body += '<g transform="translate(' + cx + ' ' + top + ') scale(1.25) translate(' + (-cx) + ' 0)">' + step.draw(cx, 0) + '</g>';
      body += text(cx, 286, step.what, 22, p.fg, 'text-anchor="middle"');
    });
    body += text(480, 326, '그 사이에 처리하면 조용히 내려갑니다 · 설명용 그림', 19, p.muted, 'text-anchor="middle"');
  } else {
    h = 678;
    body += text(32, 52, '바로 울리지 않습니다.', 34, p.fg, 'font-weight="700"');
    body += text(32, 92, '승인은 1분 · 질문과 완료는 4분 뒤', 24, p.muted);
    const ys = [160, 320, 480];
    const lineX = 62;
    body += '<path d="M' + lineX + ' ' + ys[0] + 'V' + ys[2] + '" stroke="' + p.line + '" stroke-width="2"/>';
    body += '<path class="wire" d="M' + lineX + ' ' + ys[0] + 'V' + ys[2] + '" stroke="' + p.accent + '" stroke-opacity=".7" stroke-width="2" stroke-dasharray="8 32"/>';
    steps.forEach((step, i) => {
      const cy = ys[i];
      body += '<rect x="' + (lineX - 15) + '" y="' + (cy - 15) + '" width="30" height="30" rx="10" fill="' + p.panel + '" stroke="' + p.line + '"/>';
      body += '<circle class="pulse ' + ['', 'delay', 'later'][i] + '" cx="' + lineX + '" cy="' + cy + '" r="5.5" fill="' + p.accent + '"/>';
      body += text(104, cy - 12, step.time, 26, p.accent, 'font-weight="700"');
      body += text(104, cy + 22, step.what, 26, p.fg);
      // 그림의 왼쪽 끝을 글과 맞춘다. draw는 가운데 x를 받는다.
      const half = i === 2 ? 115 : i === 1 ? pill(0, 0, c, { count: '1건', label: '가장 오래 4분' }).width / 2 : 16;
      body += '<g transform="translate(104 ' + (cy + 42) + ') scale(1.3) translate(-104 0)">' + step.draw(104 + half, 0) + '</g>';
    });
    body += text(32, 648, '그 사이에 처리하면 조용히 내려갑니다', 22, p.muted);
  }
  return { w, h, body };
}
