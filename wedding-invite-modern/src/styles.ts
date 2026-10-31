/**
 * Scoped stylesheet (`.elm-*`). Kept inside the package so the template renders the same
 * regardless of the host's Tailwind config. Colors/fonts come only from `--el-*` tokens.
 */
export const MODERN_CSS = `
.elm {
  --elm-line: color-mix(in srgb, var(--el-ink) 14%, transparent);
  --elm-line-strong: color-mix(in srgb, var(--el-ink) 28%, transparent);
  --elm-ease: cubic-bezier(.22,1,.36,1);
  position: relative;
  min-height: 100vh;
  background: var(--el-bg);
  color: var(--el-ink);
  font-family: var(--el-font-body);
  font-size: 15px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  font-variant-numeric: lining-nums;
  overflow-x: clip;
}
.elm *, .elm *::before, .elm *::after { box-sizing: border-box; }
.elm img { display: block; max-width: 100%; }
.elm :where(a) { color: inherit; text-decoration: none; }
.elm :where(button) { font: inherit; color: inherit; cursor: pointer; }
.elm-grain {
  position: fixed; inset: 0; z-index: 95; pointer-events: none; opacity: .07; mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.elm-container { width: min(100% - 40px, 1120px); margin-inline: auto; }
.elm-narrow { width: min(100% - 40px, 720px); margin-inline: auto; }
.elm-section { padding: clamp(88px, 14vw, 168px) 0; position: relative; }
.elm-eyebrow {
  font-family: var(--el-font-sans); font-size: 11px; font-weight: 500;
  letter-spacing: .32em; text-transform: uppercase; color: var(--el-muted);
}
.elm-display {
  font-family: var(--el-font-display); font-weight: 400; line-height: .98; letter-spacing: -.015em; margin: 0;
}
.elm-italic { font-family: var(--el-font-script); font-style: normal; font-weight: 400; color: var(--el-accent); }
/* Couple names in the calligraphy face; tall swashes need a looser line box than headings */
.elm-hero__names, .elm-doorgate__names, .elm-welcome__couple, .elm-person__name, .elm-footer__big {
  font-family: var(--el-font-script); font-weight: 400; letter-spacing: 0; line-height: 1.12;
}
.elm-h2 { font-size: clamp(44px, 8vw, 96px); }
.elm-head { display: flex; flex-direction: column; gap: 18px; margin-bottom: clamp(48px, 8vw, 88px); }
.elm-head--center { align-items: center; text-align: center; }
.elm-rule { height: 1px; background: var(--elm-line); border: 0; margin: 0; }
.elm-muted { color: var(--el-muted); }

.elm-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 14px 26px; border-radius: 999px; border: 1px solid currentColor; background: transparent;
  font-family: var(--el-font-sans); font-size: 11px; font-weight: 600; letter-spacing: .22em; text-transform: uppercase;
  transition: background .4s var(--elm-ease), color .4s var(--elm-ease), transform .4s var(--elm-ease);
}
.elm-btn:hover { transform: translateY(-2px); }
.elm-btn--solid { background: var(--el-ink); color: var(--el-bg); border-color: var(--el-ink); }
.elm-btn--solid:hover { background: var(--el-accent); border-color: var(--el-accent); color: var(--el-on-accent); }
.elm-btn--ghost:hover { background: var(--el-ink); color: var(--el-bg); }
.elm-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

/* Door gate — the background stays transparent so the invite shows through as the doors part */
.elm-doorgate {
  --elm-door: #a51e27; --elm-door-hi: #bf2a33; --elm-door-deep: #6a0d14;
  --elm-gold: #e2bb68; --elm-gold-hi: #fbe6ad; --elm-gold-deep: #9c702c;
  --elm-seal: min(46vw, 34vh, 250px);
  position: fixed; inset: 0; z-index: 80; overflow: hidden; color: var(--elm-gold-hi);
}
.elm-doorgate .elm-eyebrow { color: color-mix(in srgb, var(--elm-gold-hi) 85%, transparent); text-shadow: 0 1px 6px rgba(60,0,6,.6); }
.elm-doorgate__light {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background: radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,244,214,.95) 0%, rgba(255,214,150,.5) 30%, rgba(255,200,140,0) 70%);
}
.elm-doorgate__stage {
  position: absolute; inset: 0; z-index: 1; display: block; padding: 0; margin: 0; border: 0; background: none;
  perspective: 1700px; perspective-origin: 50% 45%; -webkit-tap-highlight-color: transparent;
}
.elm-doorgate__stage:disabled { cursor: default; }
.elm-door {
  position: absolute; top: 0; bottom: 0; width: calc(50% + 1px); overflow: hidden; display: block;
  background:
    repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 2px, transparent 2px 11px),
    linear-gradient(90deg, var(--elm-door-deep) 0%, var(--elm-door) 14%, var(--elm-door-hi) 50%, var(--elm-door) 86%, var(--elm-door-deep) 100%);
  box-shadow: inset 0 0 0 6px var(--elm-door-deep), inset 0 0 0 8px var(--elm-gold-deep), inset 0 0 90px rgba(40,0,4,.45);
}
.elm-door--left { left: 0; transform-origin: 0 50%; }
.elm-door--right { right: 0; transform-origin: 100% 50%; }
.elm-door::after { content: ''; position: absolute; top: 0; bottom: 0; width: 14px; }
.elm-door--left::after { right: 0; background: linear-gradient(90deg, transparent, rgba(30,0,3,.45)); }
.elm-door--right::after { left: 0; background: linear-gradient(270deg, transparent, rgba(30,0,3,.45)); }
.elm-door__panel {
  position: absolute; left: 13%; right: 15%; border: 1.5px solid var(--elm-gold); border-radius: 4px;
  height: calc(50% - var(--elm-seal) / 2 - 5% - 24px);
  box-shadow: inset 0 0 0 6px transparent, inset 0 0 0 7.5px color-mix(in srgb, var(--elm-gold) 55%, transparent), 0 0 0 4px color-mix(in srgb, var(--elm-door-deep) 50%, transparent);
  background:
    repeating-linear-gradient(45deg, color-mix(in srgb, var(--elm-gold) 16%, transparent) 0 1px, transparent 1px 16px),
    repeating-linear-gradient(-45deg, color-mix(in srgb, var(--elm-gold) 16%, transparent) 0 1px, transparent 1px 16px);
}
.elm-door--right .elm-door__panel { left: 15%; right: 13%; }
.elm-door__panel--top { top: 5%; }
.elm-door__panel--bottom { bottom: 5%; }
.elm-door__seal {
  position: absolute; top: 50%; width: var(--elm-seal); height: var(--elm-seal); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(circle at 38% 32%, var(--elm-gold-hi) 0%, var(--elm-gold) 48%, var(--elm-gold-deep) 100%);
  box-shadow: inset 0 0 0 4px var(--elm-gold-deep), inset 0 0 0 9px var(--elm-gold-hi), inset 0 0 0 11px var(--elm-gold-deep),
    0 10px 34px rgba(40,0,4,.5);
  animation: elm-seal-glow 2.8s ease-in-out infinite;
}
.elm-door--left .elm-door__seal { right: 0; transform: translate(50%, -50%); }
.elm-door--right .elm-door__seal { left: 0; transform: translate(-50%, -50%); }
.elm-door__hy {
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "Noto Serif CJK SC", serif; font-weight: 900;
  font-size: calc(var(--elm-seal) * .64); line-height: 1; color: #ad1a25;
  text-shadow: 0 1px 0 rgba(255,250,230,.55), 0 3px 8px rgba(106,13,20,.35);
}
@keyframes elm-seal-glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.12) drop-shadow(0 0 18px rgba(255,220,140,.55)); }
}
.elm-doorgate__dust { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
.elm-doorgate__branch { position: absolute; z-index: 3; pointer-events: none; width: min(30vw, 270px); }
.elm-doorgate__branch svg { display: block; width: 100%; height: auto; filter: drop-shadow(0 6px 10px rgba(40,0,4,.35)); }
.elm-doorgate__branch--tl { top: 0; left: 0; }
.elm-doorgate__branch--tr { top: 0; right: 0; }
.elm-doorgate__branch--bl { bottom: 0; left: 0; width: min(28vw, 240px); }
.elm-doorgate__branch--br { bottom: 0; right: 0; width: min(28vw, 240px); }
.elm-doorgate__branch--tl .elm-sway, .elm-doorgate__branch--bl .elm-sway { transform-origin: 0 0; }
.elm-doorgate__branch--tr .elm-sway, .elm-doorgate__branch--br .elm-sway { transform-origin: 100% 0; }
.elm-sway { animation: elm-sway 6s ease-in-out infinite; }
@keyframes elm-sway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(2.4deg); } }
.elm-doorgate__top {
  position: absolute; z-index: 4; top: max(30px, env(safe-area-inset-top)); left: 16px; right: 16px;
  display: grid; gap: 12px; text-align: center; pointer-events: none;
}
.elm-doorgate__names {
  /* stacked names must stay above the seal, so height caps the size too */
  font-size: clamp(34px, min(11vw, 7vh), 92px); line-height: 1.02; color: var(--elm-gold-hi); text-align: center;
  text-shadow: 0 2px 14px rgba(60,0,6,.55);
}
.elm-doorgate__amp {
  display: block; width: max-content; margin: -.1em auto -.05em; font-size: .62em; line-height: 1; font-weight: 400;
  color: var(--elm-gold);
}
@media (min-width: 560px) {
  .elm-doorgate__names { font-size: clamp(40px, min(8.5vw, 13vh), 100px); }
  .elm-doorgate__names > * { display: inline-block !important; vertical-align: baseline; }
  .elm-doorgate__amp { margin: 0 .35em !important; }
}
.elm-doorgate__foot {
  position: absolute; z-index: 4; left: 16px; right: 16px; bottom: max(34px, env(safe-area-inset-bottom));
  display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; pointer-events: none;
}
.elm-doorgate__guest {
  margin: 6px 0 0; font-family: var(--el-font-script); font-size: clamp(34px, 8vw, 52px); font-weight: 400; line-height: 1.2;
  text-shadow: 0 2px 10px rgba(60,0,6,.6);
}

/* Hearts and petals */
.elm-floaters { position: fixed; inset: 0; z-index: 85; width: 100%; height: 100%; pointer-events: none; }

/* Depth: a soft glowing backdrop, flower layers behind and in front of each section's content */
.elm > main, .elm-footer { position: relative; z-index: 1; }
.elm-footer { overflow: clip; }
.elm-ambient {
  position: fixed; inset: -10%; z-index: 0; pointer-events: none;
  background:
    radial-gradient(38% 30% at 12% 18%, color-mix(in srgb, var(--el-accent-soft) 55%, transparent), transparent 70%),
    radial-gradient(32% 28% at 88% 62%, color-mix(in srgb, #f4b8c6 38%, transparent), transparent 70%),
    radial-gradient(30% 26% at 40% 96%, color-mix(in srgb, var(--el-accent-soft) 40%, transparent), transparent 70%);
  animation: elm-ambient 28s ease-in-out infinite alternate;
}
@keyframes elm-ambient { to { transform: translate3d(3%, -4%, 0) scale(1.06); } }
.elm-section > .elm-container, .elm-section > .elm-narrow, .elm-hero > .elm-container, .elm-footer > .elm-container { position: relative; z-index: 2; }
.elm-flora { position: absolute; inset: 0; pointer-events: none; --elm-out: 0%; }
.elm-flora--back { z-index: 0; }
.elm-flora--front { z-index: 3; }
.elm-flora__spot { position: absolute; will-change: transform; }
.elm-flora__spot--left { translate: calc(var(--elm-out) * -1) 0; }
.elm-flora__spot--right { translate: var(--elm-out) 0; }
.elm-flora__art svg { display: block; width: 100%; height: auto; overflow: visible; }
.elm-flora__sway { transform-origin: 50% 85%; animation: elm-breathe 8s ease-in-out infinite; }
@keyframes elm-breathe {
  0%, 100% { transform: rotate(-1.2deg) translateY(0); }
  50% { transform: rotate(1.4deg) translateY(-6px); }
}
.elm-flora__spot--far .elm-flora__art { filter: blur(3.5px) saturate(.85); opacity: .5; }
.elm-flora__spot--mid .elm-flora__art { filter: drop-shadow(0 14px 18px rgba(70, 28, 24, .18)); }
.elm-flora__spot--near .elm-flora__art { filter: drop-shadow(0 24px 30px rgba(70, 28, 24, .32)); }
@media (max-width: 699px) {
  .elm-flora { --elm-out: 30%; }
  .elm-flora__spot--mid .elm-flora__art { opacity: .8; }
}

/* Invitation paper card floating over the flowers */
.elm-paper {
  padding: clamp(48px, 8vw, 88px) clamp(24px, 6vw, 72px); border-radius: 6px;
  background:
    radial-gradient(120% 80% at 50% 0%, color-mix(in srgb, white 55%, transparent), transparent 60%),
    linear-gradient(180deg, color-mix(in srgb, var(--el-bg) 60%, white), var(--el-bg));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.8),
    0 1px 2px rgba(60,35,20,.06),
    0 10px 22px -8px rgba(60,35,20,.14),
    0 38px 70px -24px rgba(60,35,20,.28),
    0 80px 120px -50px rgba(60,35,20,.22);
}
.elm-paper::before {
  content: ''; position: absolute; inset: 12px; border-radius: 3px; pointer-events: none;
  border: 1px solid color-mix(in srgb, var(--el-accent) 34%, transparent);
  outline: 1px solid color-mix(in srgb, var(--el-accent) 16%, transparent); outline-offset: 4px;
}
.elm-paper .elm-quote { margin-bottom: clamp(40px, 7vw, 72px); }


/* Hero */
.elm-hero { position: relative; min-height: 100svh; display: grid; padding: 28px 0 72px; }
.elm-hero__blossom { position: absolute; top: 0; right: 0; z-index: 1; width: min(40vw, 300px); pointer-events: none; }
.elm-hero__blossom .elm-sway { transform-origin: 100% 0; }
.elm-hero__blossom svg { display: block; width: 100%; height: auto; }
.elm-hero__inner { display: grid; gap: 40px; align-content: space-between; }
.elm-hero__bar { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 18px; border-bottom: 1px solid var(--elm-line); }
.elm-hero__grid { display: grid; gap: 40px; align-items: end; }
.elm-hero__names { font-size: clamp(72px, 19vw, 208px); }
.elm-hero__amp { display: block !important; width: max-content; font-size: .5em; margin: .1em 0 .05em .9em; line-height: 1; }
.elm-hero__arch {
  position: relative; aspect-ratio: 3 / 4; width: min(100%, 440px); justify-self: end;
  border-radius: 999px 999px 0 0; overflow: hidden; background: var(--el-bg-soft);
  box-shadow: 0 2px 6px rgba(50,28,18,.08), 0 30px 60px -22px rgba(50,28,18,.38), 0 70px 110px -60px rgba(50,28,18,.4);
}
.elm-hero__arch img { width: 100%; height: 115%; object-fit: cover; }
.elm-hero__meta { display: flex; flex-wrap: wrap; gap: 8px 28px; align-items: baseline; justify-content: space-between; border-top: 1px solid var(--elm-line); padding-top: 18px; }
.elm-hero__date { font-family: var(--el-font-display); font-size: clamp(28px, 5vw, 44px); font-weight: 300; letter-spacing: .04em; }
@media (min-width: 900px) {
  .elm-hero__grid { grid-template-columns: 1.4fr 1fr; }
  .elm-hero__names { font-size: clamp(88px, 9.5vw, 148px); }
}

/* Marquee */
.elm-marquee { background: var(--el-ink); color: var(--el-bg); overflow: hidden; padding: 22px 0; }
.elm-marquee__track { display: flex; width: max-content; animation: elm-marquee 38s linear infinite; }
.elm-marquee__item { display: flex; align-items: center; gap: 36px; padding-right: 36px; white-space: nowrap;
  font-family: var(--el-font-display); font-style: italic; font-weight: 300; font-size: clamp(28px, 5vw, 48px); }
.elm-marquee__item i { font-style: normal; color: var(--el-accent-soft); font-size: .5em; }
@keyframes elm-marquee { to { transform: translateX(-50%); } }

/* Invitation */
.elm-quote { font-family: var(--el-font-display); font-style: italic; font-weight: 300; font-size: clamp(26px, 4.6vw, 42px); line-height: 1.3; text-align: center; margin: 0 0 clamp(56px, 9vw, 96px); }
.elm-parents { display: grid; grid-template-columns: 1fr 1px 1fr; gap: 24px; text-align: center; margin-bottom: 56px; }
.elm-parents__col { display: flex; flex-direction: column; gap: 6px; }
.elm-parents__name { font-family: var(--el-font-display); font-size: clamp(19px, 3vw, 26px); line-height: 1.3; }
.elm-parents__addr { font-size: 13px; color: var(--el-muted); margin-top: 6px; }
.elm-parents__sep { background: var(--elm-line); }
.elm-welcome { text-align: center; display: flex; flex-direction: column; gap: 4px; font-size: 16px; }
.elm-welcome__guest { font-family: var(--el-font-script); font-size: clamp(38px, 6vw, 56px); line-height: 1.2; color: var(--el-accent); margin: 10px 0 14px; }
.elm-welcome__couple { font-size: clamp(48px, 8.5vw, 88px); margin: 28px 0; }

/* Couple */
.elm-couple { display: grid; gap: 64px; }
.elm-person { display: grid; gap: 22px; }
.elm-person__img { aspect-ratio: 4 / 5; overflow: hidden; background: var(--el-bg-soft); border-radius: 3px;
  box-shadow: 0 2px 6px rgba(50,28,18,.08), 0 30px 60px -26px rgba(50,28,18,.36); }
.elm-person__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--elm-ease); }
.elm-person:hover .elm-person__img img { transform: scale(1.04); }
.elm-person__head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; border-bottom: 1px solid var(--elm-line); padding-bottom: 14px; }
.elm-person__name { font-size: clamp(48px, 7vw, 76px); }
@media (min-width: 900px) {
  .elm-couple { grid-template-columns: 1fr 1fr; gap: 48px; }
  .elm-person:nth-child(2) { margin-top: 120px; }
}

/* Countdown */
.elm-count { background: var(--el-ink); color: var(--el-bg); overflow: hidden; }
.elm-count .elm-eyebrow { color: color-mix(in srgb, var(--el-bg) 65%, transparent); }
.elm-count__grid { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid color-mix(in srgb, var(--el-bg) 18%, transparent); }
.elm-count__cell { padding: 28px 4px 0; display: flex; flex-direction: column; gap: 10px; align-items: center; }
.elm-count__cell + .elm-count__cell { border-left: 1px solid color-mix(in srgb, var(--el-bg) 18%, transparent); }
.elm-count__num { font-family: var(--el-font-display); font-weight: 300; font-size: clamp(44px, 12vw, 136px); line-height: 1; font-variant-numeric: lining-nums tabular-nums; }
.elm-count .elm-btn { color: var(--el-bg); margin-top: 56px; }
.elm-count__num { display: inline-flex; }
.elm-roll { display: inline-block; position: relative; overflow: hidden; height: 1.05em; }
.elm-roll > span { display: inline-block; }
.elm-count .elm-btn:hover { background: var(--el-bg); color: var(--el-ink); }

/* Story */
.elm-story { display: grid; position: relative; padding-left: 34px; }
.elm-story__track, .elm-story__progress { position: absolute; left: 4px; top: 0; bottom: 0; width: 1px; }
.elm-story__track { background: var(--elm-line); }
.elm-story__progress { background: var(--el-accent); transform-origin: top; }
.elm-story__item { display: grid; gap: 18px; padding: 36px 0; border-top: 1px solid var(--elm-line); position: relative; }
.elm-story__item:last-of-type { border-bottom: 1px solid var(--elm-line); }
.elm-story__dot { position: absolute; left: -34px; top: 46px; width: 9px; height: 9px; border-radius: 50%; background: var(--el-bg); border: 1px solid var(--el-accent); }
.elm-story__date { font-family: var(--el-font-display); font-style: italic; font-weight: 300; color: var(--el-accent); font-size: clamp(30px, 5vw, 48px); line-height: 1; }
.elm-story__title { font-family: var(--el-font-display); font-size: clamp(26px, 3.4vw, 36px); font-weight: 400; line-height: 1.15; margin: 0 0 10px; }
.elm-story__img { aspect-ratio: 4 / 3; overflow: hidden; background: var(--el-bg-soft); }
.elm-story__img img { width: 100%; height: 100%; object-fit: cover; }
@media (min-width: 900px) {
  .elm-story__item { grid-template-columns: 220px 1fr 280px; gap: 48px; align-items: start; }
}

/* Events */
.elm-events { display: grid; gap: 20px; }
.elm-event { border: 1px solid var(--elm-line-strong); padding: clamp(28px, 4vw, 44px); display: flex; flex-direction: column; gap: 14px;
  background: color-mix(in srgb, var(--el-bg) 72%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.6), 0 24px 50px -28px rgba(50,28,18,.3); transition: transform .6s var(--elm-ease), box-shadow .6s var(--elm-ease); }
.elm-event:hover { transform: translateY(-6px); box-shadow: inset 0 1px 0 rgba(255,255,255,.6), 0 40px 70px -30px rgba(50,28,18,.38); }
.elm-event__time { font-family: var(--el-font-display); font-weight: 300; font-size: clamp(56px, 9vw, 88px); line-height: 1; }
.elm-event__venue { font-family: var(--el-font-display); font-size: 26px; line-height: 1.2; }
.elm-event__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: auto; padding-top: 16px; }
.elm-event__actions .elm-btn { padding: 11px 18px; }
.elm-map { margin-top: 20px; aspect-ratio: 16 / 9; width: 100%; border: 0; filter: grayscale(1) contrast(1.05); background: var(--el-bg-soft); }
@media (min-width: 760px) { .elm-events { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); } }

/* Gallery */
.elm-gallery { display: grid; grid-template-columns: repeat(2, 1fr); grid-auto-rows: 170px; grid-auto-flow: dense; gap: 8px; }
.elm-gallery__item { position: relative; overflow: hidden; padding: 0; border: 0; background: var(--el-bg-soft); border-radius: 3px;
  box-shadow: 0 18px 40px -24px rgba(50,28,18,.4); }
.elm-gallery__item img { width: 100%; height: 100%; object-fit: cover; transition: transform 1s var(--elm-ease), filter .6s; }
.elm-gallery__item:hover img { transform: scale(1.05); }
.elm-gallery__item:nth-child(6n + 1) { grid-column: span 2; grid-row: span 2; }
.elm-gallery__item:nth-child(6n + 4) { grid-row: span 2; }
@media (min-width: 900px) {
  .elm-gallery { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 280px; gap: 12px; }
  .elm-gallery__item:nth-child(6n + 4) { grid-row: auto; }
}
.elm-lightbox { position: fixed; inset: 0; z-index: 90; background: rgba(14,12,11,.95); display: flex; align-items: center; justify-content: center; padding: 56px 12px; }
.elm-lightbox img { max-height: 100%; max-width: 100%; object-fit: contain; }
.elm-lightbox__btn { position: absolute; width: 48px; height: 48px; border-radius: 999px; border: 1px solid rgba(255,255,255,.3); background: rgba(255,255,255,.06); color: #fff; display: flex; align-items: center; justify-content: center; }
.elm-lightbox__count { position: absolute; top: 22px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,.7); font-family: var(--el-font-sans); font-size: 12px; letter-spacing: .2em; }

/* Dress code */
.elm-swatches { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-top: 32px; }
.elm-swatch { width: 56px; height: 56px; border-radius: 999px; border: 1px solid var(--elm-line); box-shadow: inset 0 0 0 4px var(--el-bg); }

/* Gifts */
.elm-gifts { display: grid; gap: 16px; margin-top: 40px; }
.elm-gift { display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: center; border: 1px solid var(--elm-line-strong); padding: 20px; text-align: left;
  background: color-mix(in srgb, var(--el-bg) 80%, transparent); box-shadow: 0 24px 50px -30px rgba(50,28,18,.3); }
.elm-gift__qr { width: 112px; height: 112px; object-fit: contain; background: #fff; padding: 6px; }
.elm-gift__acc { font-family: var(--el-font-display); font-size: 26px; letter-spacing: .06em; font-variant-numeric: lining-nums tabular-nums; }
.elm-copy { border: 0; background: none; padding: 0; font-family: var(--el-font-sans); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--el-accent); text-decoration: underline; text-underline-offset: 4px; }
@media (min-width: 760px) { .elm-gifts { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); } }

/* RSVP */
.elm-rsvp { display: grid; gap: 48px; }
.elm-form { display: grid; gap: 28px; }
.elm-field { display: grid; gap: 8px; }
.elm-input {
  width: 100%; border: 0; border-bottom: 1px solid var(--elm-line-strong); background: transparent; color: var(--el-ink);
  padding: 10px 0; font-family: var(--el-font-display); font-size: 24px; outline: none; border-radius: 0; transition: border-color .3s;
}
.elm-input:focus { border-color: var(--el-ink); }
textarea.elm-input { font-family: var(--el-font-body); font-size: 15px; resize: vertical; min-height: 96px; }
.elm-seg { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--elm-line-strong); border-radius: 999px; padding: 4px; }
.elm-seg button { border: 0; background: transparent; border-radius: 999px; padding: 12px 10px; font-family: var(--el-font-sans); font-size: 12px; font-weight: 500; letter-spacing: .06em; transition: background .3s, color .3s; }
.elm-seg button[aria-pressed="true"] { background: var(--el-ink); color: var(--el-bg); }
.elm-stepper { display: flex; align-items: center; gap: 20px; }
.elm-stepper button { width: 44px; height: 44px; border-radius: 999px; border: 1px solid var(--elm-line-strong); background: transparent; font-size: 20px; line-height: 1; }
.elm-stepper output { font-family: var(--el-font-display); font-size: 36px; min-width: 2ch; text-align: center; font-variant-numeric: lining-nums tabular-nums; }
.elm-error { color: #b42318; font-size: 14px; }
.elm-hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
@media (min-width: 900px) { .elm-rsvp { grid-template-columns: 1fr 1fr; gap: 96px; } }

/* Footer */
.elm-footer { background: var(--el-bg-soft); text-align: center; padding: clamp(96px, 16vw, 180px) 0 40px; }
.elm-footer__big { font-size: clamp(72px, 20vw, 240px); }
.elm-footer__credit { margin-top: clamp(72px, 12vw, 140px); display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; border-top: 1px solid var(--elm-line); padding-top: 20px; }

/* Scroll progress */
.elm-progress { position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 75; transform-origin: 0 50%; background: var(--el-accent); }

/* Floating music */
.elm-music {
  position: fixed; right: 18px; bottom: max(18px, env(safe-area-inset-bottom)); z-index: 70;
  width: 48px; height: 48px; border-radius: 999px; border: 1px solid var(--elm-line);
  background: color-mix(in srgb, var(--el-bg) 80%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0,0,0,.12);
}
.elm-music svg { animation: elm-spin 6s linear infinite; }
.elm-music[aria-pressed="true"] svg { animation-play-state: paused; opacity: .45; }
@keyframes elm-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .elm-marquee__track, .elm-music svg, .elm-sway, .elm-door__seal, .elm-ambient, .elm-flora__sway { animation: none; }
  .elm * { transition: none !important; }
}
`;
