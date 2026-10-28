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
  font-family: var(--el-font-display); font-weight: 300; line-height: .92; letter-spacing: -.02em; margin: 0;
}
.elm-italic { font-family: var(--el-font-script); font-style: italic; font-weight: 300; color: var(--el-accent); }
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

/* Gate */
.elm-gate {
  position: fixed; inset: 0; z-index: 80; display: flex; flex-direction: column; justify-content: space-between;
  padding: max(28px, env(safe-area-inset-top)) 24px max(36px, env(safe-area-inset-bottom));
  color: #fff; background: var(--el-ink); overflow: hidden;
}
.elm-gate > * { position: relative; }
.elm-gate .elm-gate__bg { position: absolute; inset: -4%; background-size: cover; background-position: center; }
.elm-gate .elm-gate__shade {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(10,9,8,.55) 0%, rgba(10,9,8,.15) 38%, rgba(10,9,8,.2) 60%, rgba(10,9,8,.78) 100%);
}
.elm-gate .elm-eyebrow { color: rgba(255,255,255,.78); }
.elm-gate__top { text-align: center; display: grid; gap: 14px; }
.elm-gate__names { font-size: clamp(46px, 12.5vw, 128px); color: #fff; text-align: center; }
.elm-gate__amp { display: block; width: max-content; margin: .02em auto .08em; font-size: .62em; line-height: 1; font-weight: 400;
  color: color-mix(in srgb, var(--el-accent-soft) 60%, #fff); }
.elm-gate__foot { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; min-height: 64px; }
.elm-gate__guest { font-family: var(--el-font-display); font-size: clamp(26px, 6vw, 40px); font-style: italic; font-weight: 300; }

/* Envelope */
.elm-env {
  position: relative; display: block; width: min(76vw, 360px); aspect-ratio: 1.5; margin: 0 auto; padding: 0; border: 0;
  background: none; perspective: 1400px; -webkit-tap-highlight-color: transparent;
}
.elm-env > span { position: absolute; }
.elm-env__back { inset: 0; border-radius: 6px; background: var(--el-bg); box-shadow: 0 30px 70px rgba(0,0,0,.45), 0 4px 14px rgba(0,0,0,.25); }
.elm-env__letter {
  left: 7%; right: 7%; top: 7%; bottom: 7%; border-radius: 3px; background: #fffdf8; color: var(--el-ink);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 12px; text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,.12);
}
.elm-env__letter-names { font-family: var(--el-font-display); font-size: clamp(18px, 5vw, 24px); line-height: 1.15; }
.elm-env__pocket {
  inset: 0; z-index: 3; border-radius: 6px;
  clip-path: polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%);
  background: linear-gradient(165deg, var(--el-bg-soft) 0%, color-mix(in srgb, var(--el-bg-soft) 88%, #000) 100%);
}
.elm-env__flap {
  left: 0; right: 0; top: 0; height: 58%; transform-origin: top center;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  background: linear-gradient(180deg, color-mix(in srgb, var(--el-bg) 94%, #000), var(--el-bg));
}
.elm-env__seal { left: calc(50% - 34px); top: calc(58% - 34px); width: 68px; height: 68px; z-index: 5; }
.elm-env__seal-half {
  position: absolute; inset: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-family: var(--el-font-display); font-style: italic; font-size: 24px; letter-spacing: .02em; color: var(--el-on-accent);
  background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--el-accent) 65%, #fff) 0%, var(--el-accent) 45%, color-mix(in srgb, var(--el-accent) 62%, #000) 100%);
  box-shadow: inset 0 0 0 5px color-mix(in srgb, var(--el-accent) 80%, #000), inset 0 0 0 7px color-mix(in srgb, var(--el-accent) 70%, #fff), 0 6px 16px rgba(0,0,0,.35);
}
.elm-env__seal-half--left { clip-path: inset(0 50% 0 0); }
.elm-env__seal-half--right { clip-path: inset(0 0 0 50%); }


/* Hero */
.elm-hero { min-height: 100svh; display: grid; padding: 28px 0 72px; }
.elm-hero__inner { display: grid; gap: 40px; align-content: space-between; }
.elm-hero__bar { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 18px; border-bottom: 1px solid var(--elm-line); }
.elm-hero__grid { display: grid; gap: 40px; align-items: end; }
.elm-hero__names { font-size: clamp(72px, 19vw, 208px); }
.elm-hero__amp { display: block; width: max-content; font-size: .5em; margin-left: .6em; line-height: 1.2; }
.elm-hero__arch {
  position: relative; aspect-ratio: 3 / 4; width: min(100%, 440px); justify-self: end;
  border-radius: 999px 999px 0 0; overflow: hidden; background: var(--el-bg-soft);
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
.elm-welcome__guest { font-family: var(--el-font-display); font-style: italic; font-size: clamp(30px, 5vw, 44px); color: var(--el-accent); margin: 10px 0 14px; }
.elm-welcome__couple { font-family: var(--el-font-display); font-size: clamp(40px, 7vw, 72px); font-weight: 300; line-height: 1; margin: 28px 0; }

/* Couple */
.elm-couple { display: grid; gap: 64px; }
.elm-person { display: grid; gap: 22px; }
.elm-person__img { aspect-ratio: 4 / 5; overflow: hidden; background: var(--el-bg-soft); }
.elm-person__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--elm-ease); }
.elm-person:hover .elm-person__img img { transform: scale(1.04); }
.elm-person__head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; border-bottom: 1px solid var(--elm-line); padding-bottom: 14px; }
.elm-person__name { font-size: clamp(40px, 6vw, 64px); }
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
.elm-event { border: 1px solid var(--elm-line-strong); padding: clamp(28px, 4vw, 44px); display: flex; flex-direction: column; gap: 14px; background: color-mix(in srgb, var(--el-bg-soft) 45%, transparent); }
.elm-event__time { font-family: var(--el-font-display); font-weight: 300; font-size: clamp(56px, 9vw, 88px); line-height: 1; }
.elm-event__venue { font-family: var(--el-font-display); font-size: 26px; line-height: 1.2; }
.elm-event__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: auto; padding-top: 16px; }
.elm-event__actions .elm-btn { padding: 11px 18px; }
.elm-map { margin-top: 20px; aspect-ratio: 16 / 9; width: 100%; border: 0; filter: grayscale(1) contrast(1.05); background: var(--el-bg-soft); }
@media (min-width: 760px) { .elm-events { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); } }

/* Gallery */
.elm-gallery { display: grid; grid-template-columns: repeat(2, 1fr); grid-auto-rows: 170px; grid-auto-flow: dense; gap: 8px; }
.elm-gallery__item { position: relative; overflow: hidden; padding: 0; border: 0; background: var(--el-bg-soft); }
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
.elm-gift { display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: center; border: 1px solid var(--elm-line-strong); padding: 20px; text-align: left; }
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
  .elm-marquee__track, .elm-music svg { animation: none; }
  .elm * { transition: none !important; }
}
`;
