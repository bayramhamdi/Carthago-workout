// CARTHAGO : geometrie du signe de Tanit et variantes d'icones. Canvas 512x512, ember sur fond ink.
const EMBER = "#FF5A1F", INK = "#0A0908";

// Figure pleine (coordonnees 512). Tete, barre a bras releves, triangle.
const solidFigure = (c = EMBER) => `
  <circle cx="256" cy="134" r="38" fill="${c}"/>
  <path d="M112 168 V212 H400 V168" fill="none" stroke="${c}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M256 210 L384 420 H128 Z" fill="${c}" stroke="${c}" stroke-width="10" stroke-linejoin="round"/>`;

// Contour : memes volumes en traits, triangle et tete evides
const outlineFigure = (c = EMBER) => `
  <circle cx="256" cy="134" r="34" fill="none" stroke="${c}" stroke-width="14"/>
  <path d="M112 168 V222 H400 V168" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M256 210 L384 420 H128 Z" fill="none" stroke="${c}" stroke-width="14" stroke-linejoin="round"/>`;

// Croissant ouvert vers le haut, pose au-dessus de la tete
const crescent = (c = EMBER) => `
  <defs><mask id="cm"><rect width="512" height="512" fill="#fff"/><circle cx="256" cy="60" r="42" fill="#000"/></mask></defs>
  <circle cx="256" cy="94" r="52" fill="${c}" mask="url(#cm)"/>`;

const wrap = (inner, { bg = INK, size = 512, scale = 1, dy = 0 } = {}) => {
  const t = `translate(${256 - 256 * scale} ${256 - 256 * scale + dy}) scale(${scale})`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512"><rect width="512" height="512" fill="${bg}"/><g transform="${t}">${inner}</g></svg>`;
};

const glow = `<defs><filter id="g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" result="b"/><feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 0.45 0 0 0  0 0 0.1 0 0  0 0 0 0.55 0"/></filter></defs>`;

const variants = {
  1: (o) => wrap(solidFigure(), o),
  2: (o) => wrap(glow + `<g filter="url(#g)">${outlineFigure()}</g>` + outlineFigure(), o),
  3: (o) => wrap(`<g transform="translate(25.6 76.8) scale(.9)">${solidFigure()}</g>` + `<g transform="translate(25.6 6) scale(.9)">${crescent()}</g>`, o),
};

// Favicon : simplifie, traits epais, sans croissant ni detail fin (Tanit plein, 3 volumes)
const faviconInner = (c = EMBER) => `
  <circle cx="256" cy="108" r="58" fill="${c}"/>
  <path d="M88 148 V222 H424 V148" fill="none" stroke="${c}" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M256 214 L420 450 H92 Z" fill="${c}" stroke="${c}" stroke-width="20" stroke-linejoin="round"/>`;
const favicon = (o) => wrap(faviconInner(), o);

module.exports = { EMBER, INK, variants, favicon, solidFigure, faviconInner, wrap };
