# Mobile Polish: SkillsCinema Composition + Hero Snippets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the mobile SkillsCinema so the frame band sits tight under the skill text and melts into the page (no "unrelated box"), and show two trimmed hero code snippets on mobile.

**Architecture:** Two independent tweaks to existing components. (1) In `SkillsCinema.tsx`, the mobile canvas draw switches from small low-anchored contain-fit to a full-bleed horizontal strip: zoomed past the viewport width, anchored right below the text zone, with the top/bottom edges alpha-feathered (`destination-out`) so the frame's off-white studio background never shows a rectangle edge. (2) In `SplitHero.tsx`, a new `md:hidden` overlay renders 2 short code blocks whose emphasis is driven by the existing mobile auto-cycle spring (`springX`) instead of the cursor spotlight (there is no cursor on touch).

**Tech Stack:** React + TypeScript, canvas 2D, motion/react MotionValues, GSAP ScrollTrigger (untouched), Playwright for verification.

## Global Constraints

- White background everywhere; navy `#1a2e4a` / `#4a6080` only. No *visible* gradients/glow/shadows (the canvas alpha feather is invisible — it exists to remove a visible edge, which serves this rule).
- Code snippet colors: `CODE_REST = '#4a6080'`, `CODE_FOCUS = '#1a2e4a'`, `COMMENT = '#a8b2c0'`; IBM Plex Mono, `white-space: pre`.
- Mobile breakpoint is `(max-width: 767px)` everywhere.
- Do not change desktop behavior in either component. Do not touch `HeroField.tsx`.
- This repo has no test framework. Verification = `npm run build` (tsc && vite build) + Playwright against `npx vite preview --port 4173` (NOT the dev server — HMR masks GSAP/React DOM crashes; this bit us twice already).
- Windows/PowerShell environment; Playwright is available via `NODE_PATH=/c/Users/97254/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules` (chromium already installed).
- Do not `git push`. Commit per task on `main` (repo convention).

---

### Task 1: SkillsCinema mobile band — tight, full-bleed, feathered

**Files:**
- Modify: `src/components/SkillsCinema.tsx` (the `drawFrame` function, currently ~lines 125–150, and two new constants near the top)

**Interfaces:**
- Consumes: existing `isMobile` state, `canvasRef`, `imagesRef`, `FRAME_COUNT` — all already in the component.
- Produces: no API change; `drawFrame(p: number)` keeps its signature.

**Why:** Today mobile draws the 16:9 frame contain-fit (219 css px tall on a 390 px screen) anchored at 66% of the leftover space — ~200 px of dead white between the tags and the band, and the frame's slightly-gray studio background shows as a hard-edged rectangle. The fix: draw the frame wider than the screen (full-bleed left/right, sides crop — the lattice is centered so nothing important is lost), anchor its top right below the text zone, and feather the top/bottom edges to transparent so the off-white tone fades into the page.

- [ ] **Step 1: Add tuning constants**

In `src/components/SkillsCinema.tsx`, directly under `const FADE = 0.06 ...` add:

```tsx
// Mobile band composition: the frame draws as a full-bleed horizontal strip.
// ZOOM > 1 crops the frame's sides (lattice is centered, safe); BAND_TOP is
// the strip's top edge as a fraction of viewport height, just under the text.
const MOBILE_ZOOM = 1.4
const MOBILE_BAND_TOP = 0.34
```

- [ ] **Step 2: Replace the mobile branch of `drawFrame`**

Replace the existing body from `const cw = canvas.width` down to the closing `}` of `drawFrame` with:

```tsx
    const cw = canvas.width
    const ch = canvas.height
    // desktop: cover-fit (fill the viewport, crop the 16:9 frame).
    // mobile portrait: full-bleed strip — zoomed past the screen width so it
    // has no left/right edges, anchored just below the skill text, with
    // top/bottom alpha-feathered so the frame's off-white studio background
    // melts into the page instead of reading as a boxed image.
    const scale = isMobile
      ? (cw / img.naturalWidth) * MOBILE_ZOOM
      : Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    const offX = (cw - dw) / 2
    const offY = isMobile ? ch * MOBILE_BAND_TOP : (ch - dh) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, offX, offY, dw, dh)
    if (isMobile) {
      const f = dh * 0.16 // feather depth
      ctx.globalCompositeOperation = 'destination-out'
      let g = ctx.createLinearGradient(0, offY, 0, offY + f)
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, offY - 1, cw, f + 1)
      g = ctx.createLinearGradient(0, offY + dh - f, 0, offY + dh)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(1, 'rgba(0,0,0,1)')
      ctx.fillStyle = g
      ctx.fillRect(0, offY + dh - f, cw, f + 1)
      ctx.globalCompositeOperation = 'source-over'
    }
  }
```

(Keep everything above `const cw` — the canvas/ctx guards and the nearest-loaded-frame walk — unchanged.)

- [ ] **Step 3: Build check**

```powershell
npm run build
```

Expected: PASS (pre-existing >500 kB chunk warning only).

- [ ] **Step 4: Commit**

```powershell
git add src/components/SkillsCinema.tsx
git commit -m "fix: mobile skills band sits under the text, full-bleed + feathered"
```

---

### Task 2: Hero code snippets on mobile

**Files:**
- Modify: `src/components/SplitHero.tsx`

**Interfaces:**
- Consumes: existing `Seg` type, `CODE_REST` / `CODE_FOCUS` / `COMMENT` constants, `springX` MotionValue (0–100, auto-cycled on mobile: 0 = AI side committed, 100 = full-stack side committed), `reduced`, `introDelay`.
- Produces: `MobileHeroCode` component + `MOBILE_BLOCKS` data, rendered inside a new `md:hidden` overlay. No desktop change.

**Why:** Mobile hero currently shows only the two stacked labels over the particle field. Two short, trimmed code blocks (one per identity) restore the "code" texture without cluttering a 390 px screen. There is no cursor on touch, so instead of the spotlight, each block's emphasis follows the auto-cycling frontier: the AI block darkens/brightens when the field swings to the neural-cloud side, the full-stack block when it swings to the lattice side — the code and the 3D field breathe together.

- [ ] **Step 1: Extract the shared line renderer**

In `src/components/SplitHero.tsx`, directly after the `BLOCKS` array, add (and then replace the `b.lines.map(...)` JSX inside `HeroCodeBlock` with `<CodeLines lines={b.lines} />`):

```tsx
function CodeLines({ lines }: { lines: Seg[][] }) {
  return (
    <>
      {lines.map((segs, li) => (
        <div key={li}>
          {segs.map((seg, si) => (
            <span key={si} style={seg.dim ? { color: COMMENT } : undefined}>{seg.t}</span>
          ))}
        </div>
      ))}
    </>
  )
}
```

- [ ] **Step 2: Add the mobile block data**

Below `CodeLines`, add. Lines are re-trimmed (2-space indent, shorter comments) so nothing exceeds ~36 chars — at 0.6 rem IBM Plex Mono that fits a 390 px viewport with margins:

```tsx
type MobileBlock = { lines: Seg[][]; side: 'ai' | 'stack'; pos: React.CSSProperties }

// Two snippets only on mobile: one per identity, trimmed to 3 short lines.
// Positioned in the quiet zones between the stacked labels and the field's
// dense center; emphasis follows the auto-cycling frontier instead of a cursor.
const MOBILE_BLOCKS: MobileBlock[] = [
  {
    side: 'ai',
    pos: { top: '26%', left: '1.4rem' },
    lines: [
      [{ t: 'class SNN(nn.Module):' }],
      [{ t: '  self.fc1 = nn.Linear(64, 128)' }],
      [{ t: '  self.lif1 = snn.Leaky(beta=0.9)' }, { t: '  # EEG', dim: true }],
    ],
  },
  {
    side: 'stack',
    pos: { bottom: '25%', right: '1.4rem' },
    lines: [
      [{ t: 'const app = express()' }],
      [{ t: 'app.use(cors({ origin: ORIGINS }))' }],
      [{ t: 'app.listen(8080)' }, { t: '  // live', dim: true }],
    ],
  },
]
```

- [ ] **Step 3: Add the `MobileHeroCode` component**

Below `MOBILE_BLOCKS` (uses `useTransform` and `useSpring`, both already imported):

```tsx
function MobileHeroCode({ b, index, springX, reduced, introDelay }: {
  b: MobileBlock
  index: number
  springX: MotionValue<number>
  reduced: boolean
  introDelay: number
}) {
  // springX: 0 = AI side committed, 100 = full-stack side committed.
  // Each block wakes when the frontier swings to its identity's side.
  const emphasis = useTransform(springX, b.side === 'ai' ? [0, 100] : [100, 0], [1, 0])
  const eased = useSpring(emphasis, { stiffness: 120, damping: 24 })
  const opacity = useTransform(eased, [0, 1], reduced ? [0.55, 0.55] : [0.35, 0.9])
  const color = useTransform(eased, [0, 1], [CODE_REST, CODE_FOCUS])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: introDelay + 1.2 + index * 0.15, duration: 0.7 }}
      style={{ position: 'absolute', ...b.pos }}
    >
      <motion.div style={{ opacity }}>
        <motion.div
          animate={reduced ? undefined : { y: [0, -5, 0] }}
          transition={reduced ? undefined : { duration: 6 + index, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.6rem',
            fontWeight: 500,
            lineHeight: 1.6,
            letterSpacing: '0.01em',
            whiteSpace: 'pre',
            color,
            textAlign: 'left',
          }}
        >
          <CodeLines lines={b.lines} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Render the mobile overlay**

In `SplitHero`'s JSX, directly after the existing desktop blocks overlay (`<div className="hidden md:block" ...>...</div>`), add:

```tsx
      {/* ── Mobile: two trimmed snippets, emphasis follows the auto-cycle ── */}
      <div
        className="md:hidden"
        aria-hidden
        style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}
      >
        {MOBILE_BLOCKS.map((b, i) => (
          <MobileHeroCode
            key={i}
            b={b}
            index={i}
            springX={springX}
            reduced={reduced}
            introDelay={introDelay}
          />
        ))}
      </div>
```

- [ ] **Step 5: Build check**

```powershell
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/components/SplitHero.tsx
git commit -m "feat: hero code snippets on mobile, driven by the auto-cycle frontier"
```

---

### Task 3: Visual verification on preview build

**Files:** none created — tuning only (edits allowed in both components' new constants/positions).

- [ ] **Step 1: Build and serve the production bundle**

```powershell
npm run build
npx vite preview --port 4173
```

(Preview in background; wait for HTTP 200 on http://localhost:4173.)

- [ ] **Step 2: Drive it with Playwright at 390×844**

Script skeleton (run with `NODE_PATH` from Global Constraints; screenshots to the session scratchpad):

```js
const { chromium } = require('playwright')
async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
  const errs = []
  page.on('pageerror', e => errs.push(e.message))
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
  await page.goto('http://localhost:4173', { waitUntil: 'load' })
  const skip = await page.$('button:has-text("SKIP")')
  if (skip) { await skip.click(); await page.waitForTimeout(500) }
  // hero: two shots ~2.5s apart to catch both ends of the auto-cycle
  await page.screenshot({ path: process.env.SHOT_DIR + '/hero_a.png' })
  await page.waitForTimeout(2500)
  await page.screenshot({ path: process.env.SHOT_DIR + '/hero_b.png' })
  // skills: pin start, mid, end
  const top = await page.evaluate(() => window.scrollY + document.querySelector('#skills').getBoundingClientRect().top)
  for (const [name, frac] of [['s0', 0], ['s1', 0.5], ['s2', 0.98]]) {
    await page.evaluate(y => window.scrollTo(0, y), top + Math.round(844 * 1.8 * frac))
    await page.waitForTimeout(350)
    await page.screenshot({ path: `${process.env.SHOT_DIR}/skills_${name}.png` })
  }
  console.log('ERRORS', JSON.stringify(errs))
  await browser.close()
}
main().catch(e => { console.error(e); process.exit(1) })
```

- [ ] **Step 3: Check every item, tune constants if needed**

Open each screenshot with the Read tool and verify:

1. **Skills band**: top edge starts just below the tag pills (small, consistent breathing gap — if it collides with the 3-row Data & Tooling tags, raise `MOBILE_BAND_TOP` to 0.36–0.38; if the gap is still large, lower it). No visible rectangle edge top or bottom (raise the feather from `0.16` toward `0.22` if any tone line remains). Band runs edge-to-edge horizontally.
2. **Hero snippets**: AI block visible under "ai native", stack block above "<full stack>"; neither collides with a label or the scroll cue; between `hero_a` and `hero_b` the two blocks visibly trade emphasis (one darker/stronger, the other faded). No line wraps (if any wraps, shorten that line in `MOBILE_BLOCKS`).
3. **No console/page errors** in the script output.
4. **Desktop regression**: rerun the same script with `viewport: { width: 1440, height: 900 }` (skip the hero-cycle double shot) — desktop hero shows the original 4 blocks, skills band still cover-fit full-viewport.

- [ ] **Step 4: Commit any tuning**

```powershell
git add src/components/SkillsCinema.tsx src/components/SplitHero.tsx
git commit -m "polish: mobile band + hero snippet tuning after visual pass"
```

(Skip if nothing changed.)
