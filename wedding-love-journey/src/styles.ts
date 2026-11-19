/** Scoped under `.lj`; every color and font goes through the `--el-*` theme variables. */
export const JOURNEY_CSS = `
.lj {
  --lj-col: 480px;
  --lj-edge: max(0px, calc(50vw - var(--lj-col) / 2));
  --lj-line: color-mix(in srgb, var(--el-accent) 55%, transparent);
  min-height: 100vh;
  color: var(--el-ink);
  font-family: var(--el-font-body);
  background:
    radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--el-accent-soft) 70%, transparent), transparent 42%),
    radial-gradient(circle at 88% 82%, color-mix(in srgb, var(--el-accent-soft) 60%, transparent), transparent 40%),
    var(--el-bg-soft);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.lj *, .lj *::before, .lj *::after { box-sizing: border-box; }
.lj img { display: block; max-width: 100%; }
.lj :where(button) { font: inherit; color: inherit; cursor: pointer; }
.lj p { margin: 0; }

.lj-column {
  position: relative;
  max-width: var(--lj-col);
  margin: 0 auto;
  min-height: 100vh;
  background: var(--el-bg);
  box-shadow: 0 0 80px rgba(60, 80, 50, 0.12);
  overflow: clip;
}

/* ---------- motifs ---------- */
.lj-butterfly__wing { transform-box: fill-box; animation: lj-flap 0.32s ease-in-out infinite alternate; }
.lj-butterfly__wing--l { transform-origin: 100% 40%; }
.lj-butterfly__wing--r { transform-origin: 0% 40%; }
@keyframes lj-flap { to { transform: scaleX(0.3); } }

.lj-sway { transform-origin: 100% 0; animation: lj-sway 7s ease-in-out infinite alternate; }
@keyframes lj-sway { from { transform: rotate(-1.6deg); } to { transform: rotate(1.4deg); } }

.lj-rule { display: flex; align-items: center; justify-content: center; gap: 12px; color: var(--el-accent); margin-bottom: 18px; }
.lj-rule span { height: 1px; width: 64px; background: var(--lj-line); }

.lj-frame {
  display: block;
  width: 100%;
  padding: 4px;
  border: 1px solid var(--lj-line);
  background: var(--el-bg);
  overflow: hidden;
}
.lj-frame img, .lj-frame iframe { width: 100%; height: 100%; object-fit: cover; border: 0; display: block; }

.lj-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 30px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-family: var(--el-font-sans);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}
.lj-pill:active { transform: scale(0.97); }
.lj-pill--cta { background: var(--el-cta); color: var(--el-on-accent) !important; box-shadow: 0 10px 24px -12px var(--el-cta); }
.lj-pill--cta:hover { box-shadow: 0 14px 28px -12px var(--el-cta); }
.lj-pill--cta:disabled { opacity: 0.6; }
.lj-pill--outline { border-color: var(--el-accent); color: var(--el-accent); background: transparent; }
.lj-pill--outline:hover { background: var(--el-accent); color: var(--el-on-accent); }

/* ---------- section scaffolding ---------- */
.lj-section { position: relative; padding: 60px 22px 20px; text-align: center; }
.lj-title { display: flex; flex-direction: column; align-items: center; margin-bottom: 26px; color: var(--el-accent); }
.lj-title__icon { display: inline-flex; margin-bottom: 8px; }
.lj-title__text {
  margin: 0;
  font-family: var(--el-font-sans);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.lj-title__sub { margin-top: 6px; font-family: var(--el-font-body); font-size: 16px; color: var(--el-muted); }

.lj-panel {
  position: relative;
  margin: 44px 0 0;
  padding: 40px 28px 52px;
  background: var(--el-accent-soft);
  text-align: center;
  overflow: hidden;
}

/* ---------- hero ---------- */
.lj-hero { position: relative; padding: 64px 0 20px; }
.lj-hero__spray {
  position: absolute;
  top: -8px;
  right: -26px;
  width: 66%;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0 6px 10px rgba(70, 90, 50, 0.12));
}
.lj-hero__butterfly {
  position: absolute;
  top: 176px;
  right: 40px;
  width: 38px;
  z-index: 2;
  animation: lj-hover 5s ease-in-out infinite alternate;
}
@keyframes lj-hover { from { transform: translate(0, 0) rotate(-8deg); } to { transform: translate(-14px, -10px) rotate(6deg); } }

.lj-hero__names {
  position: relative;
  z-index: 2;
  margin: 0 0 0 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: var(--el-font-display);
  font-weight: 400;
  font-size: clamp(26px, 7.6vw, 32px);
  line-height: 1.25;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--el-ink);
}
.lj-hero__amp {
  margin: 2px 0 2px 1.6em;
  font-style: italic;
  font-size: 1.2em;
  letter-spacing: 0;
  text-transform: none;
  color: var(--el-accent);
}
.lj-hero__arch {
  position: relative;
  margin: 28px 26px 0;
  aspect-ratio: 3 / 4.15;
  border-radius: 240px 240px 6px 6px;
  overflow: hidden;
  background: var(--el-accent-soft);
  outline: 1px solid var(--lj-line);
  outline-offset: 6px;
  box-shadow: 0 30px 50px -30px rgba(40, 60, 40, 0.45);
}
.lj-hero__arch img { width: 100%; height: 100%; object-fit: cover; }
.lj-hero__placeholder { width: 100%; height: 100%; background: linear-gradient(160deg, var(--el-accent-soft), var(--el-bg-soft)); }
.lj-hero__caption {
  position: absolute;
  inset: auto 0 0 0;
  padding: 90px 18px 26px;
  text-align: center;
  color: #fff;
  background: linear-gradient(to top, rgba(20, 28, 20, 0.62), rgba(20, 28, 20, 0));
}
.lj-hero__date { font-family: var(--el-font-round); font-size: 14px; letter-spacing: 0.02em; }
.lj-hero__venue {
  margin-top: 8px;
  font-family: var(--el-font-display);
  font-size: 15px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.lj-hero__sprig { position: absolute; left: 4px; bottom: -6px; width: 120px; z-index: 2; transform: rotate(-8deg); }

/* ---------- dear ---------- */
.lj-dear__greeting { font-family: var(--el-font-script); font-size: 46px; line-height: 1; color: var(--el-accent); margin-bottom: 18px; }
.lj-dear__guest { font-family: var(--el-font-body); font-size: 17px; margin-bottom: 14px; }
.lj-dear__guest strong { font-weight: 600; color: var(--el-accent); }
.lj-dear__text { font-family: var(--el-font-script); font-size: 22px; line-height: 1.5; color: var(--el-ink); }
.lj-dear__sprig, .lj-rsvp__sprig { position: absolute; right: -8px; bottom: 6px; width: 110px; opacity: 0.85; }
.lj-rsvp__sprig { left: -8px; right: auto; transform: scaleX(-1); }

/* ---------- couple ---------- */
.lj-couple__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.lj-person__photo { aspect-ratio: 3 / 4; border-radius: 120px 120px 4px 4px; }
.lj-person__photo img { border-radius: 116px 116px 2px 2px; }
.lj-person__line { display: block; width: 1px; height: 34px; margin: 14px auto 10px; background: var(--el-accent); }
.lj-person__role { font-family: var(--el-font-sans); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--el-muted); }
.lj-person__name { margin-top: 2px; font-family: var(--el-font-script); font-size: 28px; line-height: 1.25; color: var(--el-accent); }
.lj-couple__intro { margin-top: 26px; font-family: var(--el-font-script); font-size: 20px; line-height: 1.55; color: var(--el-accent); }

/* ---------- album ---------- */
.lj-album { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); grid-auto-rows: 64px; gap: 8px; }
.lj-album__item--n { grid-column: span 2; grid-row: span 3; }
.lj-album__item--w { grid-column: span 4; grid-row: span 3; }
.lj-album__item--t { grid-column: span 2; grid-row: span 2; }
.lj-album__item--full { grid-column: span 6; grid-row: span 5; }
.lj-album__item .lj-frame { height: 100%; transition: transform 0.35s ease, box-shadow 0.35s ease; }
.lj-album__item .lj-frame:hover { transform: translateY(-2px); box-shadow: 0 14px 24px -16px rgba(40, 60, 40, 0.5); }
.lj-album__item img { transition: transform 0.8s ease; }
.lj-album__item .lj-frame:hover img { transform: scale(1.04); }

.lj-lightbox {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 22, 16, 0.92);
}
.lj-lightbox__img { max-width: 92vw; max-height: 80vh; object-fit: contain; border: 4px solid #fff; touch-action: pan-y; }
.lj-lightbox__count { position: absolute; bottom: 24px; color: #e8efe0; font-family: var(--el-font-sans); font-size: 13px; letter-spacing: 0.2em; }
.lj-lightbox__nav, .lj-lightbox__close {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
  color: #fff !important;
  font-size: 26px;
  line-height: 1;
}
.lj-lightbox__nav--prev { left: 14px; }
.lj-lightbox__nav--next { right: 14px; }
.lj-lightbox__close { top: 16px; right: 16px; }

/* ---------- movie / location ---------- */
.lj-movie { aspect-ratio: 16 / 9; }
.lj-location__venue {
  font-family: var(--el-font-display);
  font-size: 19px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--el-ink);
}
.lj-location__address { margin: 8px auto 0; max-width: 340px; font-size: 15px; line-height: 1.5; color: var(--el-muted); }
.lj-location__when { margin-top: 10px; font-family: var(--el-font-sans); font-size: 13px; letter-spacing: 0.06em; color: var(--el-accent); }
.lj-location__map { margin: 22px 0 24px; aspect-ratio: 4 / 3; }

/* ---------- gift ---------- */
.lj-gift__box { display: block; width: 210px; margin: 0 auto; padding: 0; border: 0; background: none; }
.lj svg.lj-envelope { width: 100%; overflow: visible; }
.lj-envelope__flap { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(-1); transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.lj-envelope.is-open .lj-envelope__flap { transform: scaleY(1); }
.lj-envelope__hearts { transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.lj-envelope__heart { transform-box: fill-box; transform-origin: center; animation: lj-bob 2.6s ease-in-out infinite alternate; }
.lj-envelope__heart.h2 { animation-delay: -0.8s; }
.lj-envelope__heart.h3 { animation-delay: -1.6s; }
.lj-gift__box:hover .lj-envelope__hearts { transform: translateY(-8px); }
.lj-envelope.is-open .lj-envelope__hearts { transform: translateY(-46px); }
@keyframes lj-bob { from { transform: translateY(0) scale(1); } to { transform: translateY(-5px) scale(1.06); } }
.lj-gift__hint { margin-top: 6px; font-family: var(--el-font-script); font-size: 19px; color: var(--el-accent); }
.lj-gift__list { display: grid; gap: 14px; margin-top: 18px; }
.lj-gift__card { padding: 18px; border: 1px solid var(--lj-line); text-align: center; }
.lj-gift__qr { width: 160px; height: 160px; object-fit: contain; margin: 0 auto 12px; }
.lj-gift__bank { font-family: var(--el-font-sans); font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--el-muted); }
.lj-gift__account { margin-top: 6px; font-family: var(--el-font-display); font-size: 22px; letter-spacing: 0.08em; }
.lj-gift__owner { margin-top: 4px; font-family: var(--el-font-sans); font-size: 13px; letter-spacing: 0.06em; color: var(--el-accent); }
.lj-copy {
  margin-top: 12px;
  padding: 7px 18px;
  border: 1px solid var(--el-accent);
  border-radius: 999px;
  background: transparent;
  color: var(--el-accent) !important;
  font-family: var(--el-font-sans) !important;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ---------- rsvp / forms ---------- */
.lj-rsvp { margin-top: 64px; }
.lj-rsvp__title { margin: 0; font-family: var(--el-font-sans); font-size: 24px; font-weight: 500; color: var(--el-accent); }
.lj-rsvp__deadline { margin-top: 6px; font-size: 15px; color: var(--el-muted); }
.lj-rsvp__done { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 24px; color: var(--el-accent); font-size: 17px; }
.lj-rsvp__done small { color: var(--el-muted); font-size: 13px; }
.lj-form { margin-top: 18px; text-align: left; }
.lj-form__label {
  display: block;
  margin: 18px 0 8px;
  font-family: var(--el-font-sans);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--el-ink);
}
.lj-input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--lj-line);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.85);
  color: var(--el-ink);
  font-family: var(--el-font-body);
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.lj-input:focus { border-color: var(--el-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--el-accent) 18%, transparent); }
.lj-input--area { resize: vertical; min-height: 110px; line-height: 1.5; }
.lj-radios { display: grid; gap: 10px; }
.lj-radio { position: relative; display: flex; align-items: center; gap: 12px; font-size: 16px; line-height: 1.35; cursor: pointer; }
.lj-radio input { position: absolute; opacity: 0; pointer-events: none; }
.lj-radio__dot {
  flex: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid var(--el-accent);
  background: #fff;
  box-shadow: inset 0 0 0 4px #fff;
  transition: background 0.2s ease;
}
.lj-radio.is-on .lj-radio__dot { background: var(--el-accent); }
.lj-radio input:focus-visible + .lj-radio__dot { outline: 2px solid var(--el-accent); outline-offset: 2px; }
.lj-form__error { margin-top: 12px; color: #b3261e; font-size: 14px; }
.lj-form__submit { display: flex; margin: 28px auto 0; }

/* ---------- footer ---------- */
.lj-footer { position: relative; padding: 170px 24px 130px; text-align: center; overflow: hidden; }
.lj-footer > div { position: relative; z-index: 1; }
.lj-footer__spray { position: absolute; top: -10px; left: -30px; width: 46%; opacity: 0.9; pointer-events: none; }
.lj-footer__thanks { font-family: var(--el-font-script); font-size: 54px; line-height: 1.1; color: var(--el-accent); }
.lj-footer__message { margin: 14px auto 0; max-width: 340px; font-style: italic; font-size: 16px; line-height: 1.6; color: var(--el-muted); }
.lj-footer__names { margin-top: 24px; font-family: var(--el-font-display); font-size: 16px; letter-spacing: 0.16em; text-transform: uppercase; }
.lj-footer__names em { color: var(--el-accent); text-transform: none; }
.lj-footer__date { margin-top: 6px; font-family: var(--el-font-sans); font-size: 13px; letter-spacing: 0.3em; color: var(--el-accent); }

/* ---------- cover ---------- */
.lj-cover {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 40%, #fff 0%, transparent 60%),
    var(--el-accent-soft);
}
.lj-cover__spray { position: absolute; top: -14px; right: -30px; width: min(72vw, 360px); pointer-events: none; }
.lj-cover__spray--low { top: auto; right: auto; bottom: -14px; left: -30px; transform: rotate(180deg); }
.lj-cover__body { position: relative; display: flex; flex-direction: column; align-items: center; gap: 26px; padding: 24px; text-align: center; }
.lj-cover__guest { font-size: 17px; color: var(--el-muted); }
.lj-cover__guest strong { color: var(--el-accent); font-weight: 600; }
.lj-cover__envelope {
  position: relative;
  width: min(78vw, 320px);
  aspect-ratio: 1.45;
  padding: 0;
  border: 0;
  background: none;
  perspective: 900px;
  filter: drop-shadow(0 22px 26px rgba(60, 80, 50, 0.22));
}
.lj-cover__envelope > span { position: absolute; display: block; }
.lj-cover__back { inset: 0; border-radius: 8px; background: #e9dcc4; }
.lj-cover__card {
  left: 6%;
  right: 6%;
  top: 7%;
  bottom: 6%;
  z-index: 1;
  display: flex !important;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--lj-line);
  outline: 1px solid var(--lj-line);
  outline-offset: -6px;
  background: #fff;
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.45s;
}
.lj-cover__names { display: flex; flex-direction: column; font-family: var(--el-font-script); font-size: 26px; line-height: 1.15; color: var(--el-accent); }
.lj-cover__names em { font-family: var(--el-font-display); font-size: 0.7em; color: var(--el-ink); }
.lj-cover__front {
  inset: 0;
  z-index: 2;
  border-radius: 8px;
  background: linear-gradient(180deg, #f6eee0, #efe3cd);
  clip-path: polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%);
}
.lj-cover__flap {
  left: 0;
  right: 0;
  top: 0;
  height: 60%;
  z-index: 3;
  background: linear-gradient(180deg, #efe2cc, #e6d5b8);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: 50% 0;
  transition: transform 0.6s cubic-bezier(0.55, 0, 0.3, 1), z-index 0s linear 0.3s;
}
.lj-cover__seal {
  left: 50%;
  top: 60%;
  z-index: 4;
  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 54px;
  height: 54px;
  margin: -27px 0 0 -27px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #a3405a, var(--el-cta));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--el-cta) 25%, transparent), 0 6px 12px rgba(80, 20, 30, 0.35);
  color: #f7dfe4;
  font-family: var(--el-font-display);
  font-size: 16px;
  letter-spacing: 0.04em;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.lj-cover__seal i { font-style: normal; opacity: 0.7; }
.lj-cover__envelope.is-opening .lj-cover__seal { opacity: 0; transform: scale(0.6); }
.lj-cover__envelope.is-opening .lj-cover__flap { transform: rotateX(180deg); z-index: 0; }
.lj-cover__envelope.is-opening .lj-cover__card { transform: translateY(-58%); }
.lj-cover__sprig { width: 120px; opacity: 0.85; }

/* ---------- ambient layer ---------- */
.lj-falling { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 30; pointer-events: none; }
.lj-flyer { position: fixed; z-index: 31; width: 28px; pointer-events: none; opacity: 0.9; }
.lj-flyer--a { left: 0; top: 0; animation: lj-fly-a 34s linear infinite; }
.lj-flyer--b { left: 0; top: 0; width: 22px; animation: lj-fly-b 41s linear infinite; animation-delay: -12s; }
@keyframes lj-fly-a {
  0% { transform: translate(-40px, 70vh) rotate(18deg); }
  25% { transform: translate(28vw, 48vh) rotate(-6deg); }
  50% { transform: translate(55vw, 62vh) rotate(12deg); }
  75% { transform: translate(78vw, 30vh) rotate(-10deg); }
  100% { transform: translate(110vw, 18vh) rotate(8deg); }
}
@keyframes lj-fly-b {
  0% { transform: translate(105vw, 40vh) rotate(-14deg) scaleX(-1); }
  30% { transform: translate(70vw, 22vh) rotate(4deg) scaleX(-1); }
  60% { transform: translate(36vw, 36vh) rotate(-8deg) scaleX(-1); }
  100% { transform: translate(-40px, 12vh) rotate(6deg) scaleX(-1); }
}

/* ---------- floating UI ---------- */
.lj-ticker {
  position: fixed;
  top: 44px;
  left: calc(var(--lj-edge) + 12px);
  z-index: 40;
  max-width: min(310px, calc(100vw - 24px));
  pointer-events: none;
}
.lj-ticker__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 22px -12px rgba(40, 60, 40, 0.4);
  font-family: var(--el-font-sans);
  font-size: 13px;
  line-height: 1.35;
}
.lj-ticker__avatar {
  flex: none;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--el-accent);
  color: var(--el-on-accent);
  font-weight: 500;
}
.lj-ticker__text { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.lj-ticker__text strong { color: var(--el-accent); font-weight: 500; }

.lj-rsvp-pill {
  position: fixed;
  right: calc(var(--lj-edge) + 12px);
  bottom: 80px;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 15px;
  border: 1px solid var(--el-accent);
  border-radius: 999px;
  background: #fff;
  color: var(--el-accent) !important;
  font-family: var(--el-font-sans) !important;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  box-shadow: 0 10px 22px -14px rgba(40, 60, 40, 0.55);
}

.lj-dock {
  position: fixed;
  left: calc(var(--lj-edge) + 12px);
  right: calc(var(--lj-edge) + 12px);
  bottom: calc(12px + env(safe-area-inset-bottom));
  z-index: 40;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
}
.lj-dock__sound {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid var(--lj-line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--el-accent) !important;
  font-family: var(--el-font-sans) !important;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  box-shadow: 0 8px 20px -14px rgba(40, 60, 40, 0.6);
}
.lj-eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 12px; }
.lj-eq i { width: 2px; height: 4px; background: currentColor; border-radius: 1px; }
.lj-dock__sound.is-on .lj-eq i { animation: lj-eq 0.9s ease-in-out infinite alternate; }
.lj-dock__sound.is-on .lj-eq i:nth-child(2) { animation-delay: -0.3s; }
.lj-dock__sound.is-on .lj-eq i:nth-child(3) { animation-delay: -0.6s; }
@keyframes lj-eq { from { height: 3px; } to { height: 12px; } }
.lj-dock__menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 50%;
  background: var(--el-accent);
  box-shadow: 0 10px 22px -12px var(--el-accent);
}
.lj-dock__menu span { width: 18px; height: 1.5px; background: var(--el-on-accent); border-radius: 1px; }
.lj-dock__wish {
  justify-self: end;
  padding: 10px 16px;
  border: 0;
  border-radius: 999px;
  background: var(--el-cta);
  color: var(--el-on-accent) !important;
  font-family: var(--el-font-sans) !important;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  box-shadow: 0 10px 22px -12px var(--el-cta);
}

.lj-sheet {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(20, 30, 20, 0.45);
}
.lj-sheet__panel {
  position: relative;
  width: min(100%, var(--lj-col));
  max-height: 86vh;
  overflow-y: auto;
  padding: 30px 24px calc(30px + env(safe-area-inset-bottom));
  border-radius: 22px 22px 0 0;
  background: var(--el-bg);
}
.lj-sheet__close {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: var(--el-accent-soft);
  color: var(--el-accent) !important;
  font-size: 22px;
  line-height: 1;
}
.lj-sheet__title {
  margin: 0 36px 4px;
  text-align: center;
  font-family: var(--el-font-sans);
  font-size: 18px;
  font-weight: 500;
  color: var(--el-accent);
}
.lj-sheet__lead { margin-top: 8px; text-align: center; font-size: 16px; line-height: 1.55; color: var(--el-muted); }
.lj-menu { list-style: none; margin: 14px 0 0; padding: 0; }
.lj-menu button {
  width: 100%;
  padding: 14px 4px;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--el-accent) 20%, transparent);
  background: none;
  text-align: center;
  font-family: var(--el-font-display) !important;
  font-size: 17px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.lj-menu li:last-child button { border-bottom: 0; }

@media (prefers-reduced-motion: reduce) {
  .lj-sway, .lj-hero__butterfly, .lj-butterfly__wing, .lj-envelope__heart, .lj-flyer, .lj-eq i { animation: none !important; }
}
`;
