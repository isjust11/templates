# @eventlab/template-wedding-invite-modern

An editorial-style wedding invitation: ivory, black and mocha tones, a large Cormorant Garamond serif paired with Manrope. It is a template **package** (not a Next app). The `templates/wedding-invite` host imports it into `TEMPLATE_REGISTRY` under the key `wedding-invite-modern`.

## Sections (top to bottom)

| Section | Slots used | Hidden when |
|---|---|---|
| Cover with a wax-sealed envelope (seal breaks → flap opens → card rises → cover slides away) | `coverImage`, names, `eventDate` | `theme.effectEnvelope = false` |
| Hero: names rise letter by letter, ink-stroke ampersand, arch photo uncovered from below, parallax | `groomName`, `brideName`, `coverImage`, `city`, `venue` | — |
| Scrolling marquee | names, date, `venue` | — |
| Invitation: quote, both families, invitation text | `quote`, `groomFather/Mother/Address`, `brideFather/Mother/Address`, `welcomeLines`, `hosts` | each part is hidden when empty |
| The couple | `groomPhoto`, `bridePhoto`, `groomBio`, `brideBio` | no photo and no bio |
| Countdown + add to Google Calendar | `eventDate` | `eventDate` is invalid |
| Our story (timeline) | `story[]` | empty |
| Schedule + map (Google Maps embed, no API key) | `events[]`, or falls back to `venue`/`address`/`mapsUrl` | — |
| Bento album + lightbox (keyboard, swipe) | `album[]` | empty |
| Dress code (colour swatches) | `dressCodeNote`, `dressCodeColors[]` | empty |
| Wedding gifts: collapsed by default, copy account number | `gifts[]` (`owner`, `bank`, `accountNumber`, `qrImage`) | empty |
| RSVP | `rsvpDeadline` | — |
| Footer | `footerMessage`, `footerCredit` | — |

The full contract is in [`slots.schema.json`](./slots.schema.json). Sample data is in [`sample.json`](./sample.json); paste it into an event's `eventData` to preview quickly.

## Behaviour

- **Personalised link:** `/invite/:slug?to=Anh%20Tuấn` shows "Trân trọng kính mời Anh Tuấn" on the gate and in the invitation, and prefills the RSVP name.
- **Effects** (`@eventlab/effects`, read from `theme`):
  - `effectEnvelope` → the envelope cover.
  - `effectConfetti` → confetti once the envelope has opened.
  - `musicEnabled` / `musicUrl` → background music (started inside the tap on the seal, as browsers require) and the floating play button.
  - `autoScroll` / `autoScrollSpeed` → automatic scrolling.
  - `effectPetals` → soft light motes (canvas) on the cover and the countdown, instead of petals, to keep the minimal look.
- **Built-in motion:**
  - Rolling countdown digits.
  - A story timeline that draws itself as you scroll.
  - Album tiles uncovered one after another.
  - Photos that fade in from a soft blur.
  - An ink-stroke "Cảm ơn".
  - A scroll-progress bar.
- **Low-power mode:** with `prefers-reduced-motion`, Data Saver, or a weak device (≤ 2 cores or ≤ 2 GB RAM), particles, confetti and parallax are turned off.
  - Particles also pause when off-screen or when the tab is hidden.
- **Theme:** `theme.accent`, `ink`, `bg`, `bgSoft`, `fontDisplay`… map to `--el-*`. `theme.css` is appended last.
  - The default fonts load themselves from Google Fonts. If you change the font through `theme`, the host must load the new font.
- **Locale:** `locale` starting with `en` switches to English labels; anything else uses Vietnamese.
- **RSVP:** `POST /api/rsvp` on the host with `{ slug, name, attending, guests, message }`.
  - With no `eventSlug` (admin preview), the form shows success but saves nothing.
- **`isEditing`:** skips the gate so the admin can see the content immediately.
- **Styling:** CSS is scoped to `.elm-*` and bundled inside the package, so it does not depend on the host's Tailwind. `prefers-reduced-motion` is respected.

## Attach to the host

Already wired up in this monorepo:

```text
templates/package.json              → workspaces += "wedding-invite-modern"
wedding-invite/package.json         → "@eventlab/template-wedding-invite-modern": "file:../wedding-invite-modern"
wedding-invite/next.config.ts       → transpilePackages
wedding-invite/components/base/template-registry.tsx → 'wedding-invite-modern': WeddingModern
```

On the Nest side, create a published template with `slug = wedding-invite-modern` and import `slots.schema.json` in the admin "Schema" step.
