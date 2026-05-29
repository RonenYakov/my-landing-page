# SplitHero — Laptop Central Object
**Date:** 2026-05-28
**Status:** Approved

Extends the existing `SplitHero.tsx` by adding a split-background atmosphere and a centered laptop whose internal screen also reveals each side based on mouse X position.

---

## What Already Exists (keep unchanged)

- `rawX` / `springX` / `clampedX` motion values — mouse tracking + spring
- `dividerLeft` transform — drives the split position
- Left label: `deep learning` (Moderniz, clamp font)
- Right label: `<full stack>` (Moderniz, clamp font)
- Subtext paragraphs under each label
- Scroll cue `↓`
- `handleMouseMove` / `handleMouseLeave` (snaps to 50% on leave)
- Mobile hidden class (`hidden md:flex`) on side panels

---

## New: Motion Values (add to existing)

```ts
// Inverted position — so hovering LEFT expands the AI (dark) side
const bgSplitPct = useTransform(clampedX, (v) => `${100 - v}%`)
// Screen laptop split
const screenSplitLeftPct = useTransform(clampedX, [20, 80], ['70%', '30%'])
```

`bgSplitPct` drives both the background width and the visual divider line.
`screenSplitLeftPct` drives the laptop screen's internal split.

---

## New: Split Background

Two absolutely-positioned divs fill the section behind everything.

| Property | Left (AI) | Right (Full-stack) |
|---|---|---|
| Background | `#0d1117` | `#f9f9f9` |
| Width | `bgSplitPct` (inverted spring) | `100% - bgSplitPct` |
| z-index | 0 | 0 |

Behavior: mouse LEFT (X→20) → bgSplitPct→80% → dark AI bg fills 80% of screen.
Mouse RIGHT (X→80) → bgSplitPct→20% → white FS bg fills 80% of screen.

The visual divider line also uses `bgSplitPct` for its `left` position.

---

## New: Floating Code Snippets

Added to the section, `position: absolute`, `z-index: 2`, `pointer-events: none`. Hidden on mobile.

**Left panel (AI):**

| Style | Position | Content |
|---|---|---|
| Pill (dark bg, border) | top 12%, left 3% | `loss: 0.0423` |
| Pill | top 35%, left 2% | `model = SNN(64)` |
| Plain muted | top 55%, left 4% | `accuracy: 94.2%` |
| Plain muted 60% | top 72%, left 3% | `PyTorch · NumPy · sklearn` |
| Pill | bottom 14%, left 5% | `epoch 47/100 ████░░` |

**Right panel (Full-stack):**

| Style | Position | Content |
|---|---|---|
| Plain muted | top 14%, right 3% | `const [data, setData]` |
| Pill (light bg) | top 38%, right 2% | `npm run build ✓` |
| Plain muted | top 58%, right 4% | `border-radius: 12px` |
| Plain muted 60% | bottom 14%, right 3% | `React · TypeScript · SQL` |

Pill style: `background: rgba(22,27,34,0.92)`, `border: 1px solid #30363d`, `border-radius: 6px`, IBM Plex Mono 0.65rem.
Light pill (right side): `background: rgba(244,244,244,0.95)`, `border: 1px solid #e8e8e8`, `color: #1a2e4a`.

---

## New: Laptop Component

Centered absolutely at `left: 50%, top: 50%, transform: translate(-50%, -50%)`, `z-index: 7`.

### Outer shell
- Width: `clamp(260px, 28vw, 380px)`
- Screen lid background: `#1c1c1e`, `border-radius: 10px 10px 3px 3px`, padding `8px`
- Box shadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)`
- Notch: `10px × 10px` circle, `#2a2a2e`, centered above screen
- Keyboard base: `#222`, height `12px`, `border-radius: 0 0 8px 8px`
- Trackpad: `50px × 7px`, `#1a1a1a`, centered in base

### Screen (inside lid)
Height: `clamp(150px, 16vw, 210px)`. `overflow: hidden`, `border-radius: 5px`. `display: flex`.

**AI half** — width driven by `screenSplitLeft` (see Interaction below):
- Background: `#0d1117`
- Padding: `8px`
- Contents (stacked):
  1. Label: `● Confusion Matrix — FashionMNIST` — IBM Plex Mono 5.5px, `#3fb950`
  2. Confusion matrix grid: 5×5 CSS grid, cells colored with navy blues (`#1e4a8a` diagonal, `#0a1830` off-diagonal, accent `#2868b0` for high-error cells)
  3. Classification report block: `background: #161b22`, border-radius 3px. Shows precision / recall / f1 values from the real report (0.88 / 0.87 / 0.87)

**Internal screen divider:** `1px`, `rgba(100,100,100,0.4)`, absolute, `left: screenSplitLeft`, `top/bottom: 0`, `z-index: 2`.

**Full-stack half** — fills remaining width:
- Mini navbar strip: `background: #111`, height 20px. `RY` left, `about projects skills` right (all 4–5px text)
- Hero area: `background: linear-gradient(135deg, #f5f0eb, #ece6df)`, fills remaining height
  - Eyebrow: `EVENTS · SOCIAL · MEDIA` — 4.5px, `#c07a50`, uppercase
  - Title: `Creating presence.` — 14px bold, `#1a1a1a`
  - Sub: `Social media management` — 5px, `#888`
  - CTA pill: `Let's create buzz →` — `#c07a50` bg, white text, border-radius 10px

### Interaction: screen internal split

`screenSplitLeftPct` (defined in Motion Values section) maps `clampedX` → AI screen width:
- Mouse LEFT (X=20) → AI width = 70% (AI content expands)
- Mouse RIGHT (X=80) → AI width = 30% (FS content expands)

Consistent with background: both use the same direction — move LEFT to see more AI, move RIGHT to see more FS.

The `<motion.div>` for the AI half uses `style={{ width: screenSplitLeftPct }}`.
The internal screen divider `<motion.div>` uses `style={{ left: screenSplitLeftPct }}`.

---

## Screenshots

Copy these files to `/public/hero/`:

| Source file | Destination |
|---|---|
| `C:\Users\97254\Desktop\New folder\{311C6793-1064-4669-98EB-F2FFFD8D3F8B}.png` | `public/hero/ai-confusion-matrix.png` |
| `C:\Users\97254\Desktop\New folder\{08A7DD7F-AF14-4F96-B512-959740DE3F9F}.png` | `public/hero/ai-classification-report.png` |
| `C:\Users\97254\Desktop\New folder\{13E00A28-E5A6-4CB1-B8E3-95371255CCFD}.png` | `public/hero/fs-social-platform.png` |
| `C:\Users\97254\Desktop\New folder\{BFE24300-2592-4FD4-B3C1-FA267164784C}.png` | `public/hero/fs-wedding-countdown.png` |

The laptop screen mock is built in CSS/JSX (grid + colors) — screenshots are available as `<img>` fallbacks if desired, but the CSS version is sharper at small sizes and has no loading flash.

---

## Mobile (< 768px)

- Laptop hidden (`display: none`)
- Floating snippets hidden
- Split background still present (50/50 static, no mouse tracking)
- Labels + subtext visible, centered
- Scroll cue visible

---

## File Changes

Only `SplitHero.tsx` is modified. No new files. No new dependencies.

New motion values added inside the component:
- `screenSplitLeftPct` (derived from existing `clampedX`)

New JSX added inside `<section>`:
1. `<div>` bg-left (absolute, z-index 0)
2. `<div>` bg-right (absolute, z-index 0)
3. Floating snippet divs (absolute, z-index 2, hidden on mobile)
4. Laptop wrapper + screen structure (absolute, z-index 7)

Existing JSX (labels, scroll cue, mouse handlers) unchanged.

---

## Non-Goals

- No image carousel / auto-rotation (keep it static, clean)
- No GSAP (Framer Motion spring already handles the animation)
- No new screenshot images rendered via `<img>` — CSS grid is sufficient for the laptop screen at this size
