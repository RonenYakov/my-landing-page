# SplitHero Laptop Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bare SplitHero with a split-background atmosphere + centered laptop whose screen and background both reveal AI or full-stack content as the mouse moves left/right.

**Architecture:** Single file change — `SplitHero.tsx`. Two new `useTransform` values drive both the background split and the laptop screen split from the existing `clampedX` spring. Mouse LEFT expands the dark AI side; mouse RIGHT expands the white full-stack side. Laptop is pure CSS/JSX — no image files required.

**Tech Stack:** React, TypeScript, Framer Motion (`motion/react`) — all already installed. Tailwind utility classes for responsive hiding. No new dependencies.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/SplitHero.tsx` | **Modify** | All changes live here — motion values, backgrounds, snippets, laptop |

No other files touched.

---

### Task 1: New motion values + split backgrounds

**Files:**
- Modify: `src/components/SplitHero.tsx`

- [ ] **Step 1: Add two new `useTransform` values after the existing ones**

Open `src/components/SplitHero.tsx`. After line 11 (`const dividerLeft = ...`), add:

```ts
// bgSplitPct: inverted so mouse LEFT expands AI (dark) side
const bgSplitPct = useTransform(clampedX, (v) => `${100 - v}%`)
// screenSplitLeftPct: laptop AI-half width — mouse LEFT = wider AI half
const screenSplitLeftPct = useTransform(clampedX, [20, 80], ['70%', '30%'])
```

You can remove the existing `dividerLeft` line — it is unused in the current JSX and will be replaced by `bgSplitPct`.

- [ ] **Step 2: Replace the section's inline `background` with two split divs**

The existing `<section>` has `background: 'var(--bg)'`. Change the section to have no background (it will be covered by the two divs). Add `background: 'var(--bg)'` as the default so mobile gets white. Then add the two background divs as the first children inside `<section>`:

```tsx
<section
  ref={containerRef}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  style={{
    position: 'relative',
    width: '100%',
    height: '100dvh',
    background: 'var(--bg)',   // mobile fallback
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  }}
>
  {/* ── Split backgrounds (desktop only) ── */}
  <motion.div
    className="hidden md:block"
    style={{
      position: 'absolute', left: 0, top: 0, bottom: 0,
      width: bgSplitPct,
      background: '#0d1117',
      zIndex: 0,
    }}
  />
  <motion.div
    className="hidden md:block"
    style={{
      position: 'absolute', left: bgSplitPct, top: 0, right: 0, bottom: 0,
      background: 'var(--bg)',
      zIndex: 0,
    }}
  />

  {/* ── Visual divider line ── */}
  <motion.div
    className="hidden md:block"
    style={{
      position: 'absolute', left: bgSplitPct, top: 0, bottom: 0,
      width: '1px',
      background: 'rgba(150,150,150,0.25)',
      zIndex: 6,
      pointerEvents: 'none',
    }}
  />
```

- [ ] **Step 3: Update left label colors for dark background**

The existing left label uses `color: 'var(--text)'` (#111). Change it to white, and its subtext to translucent white:

```tsx
// Left label <span>
color: '#ffffff'

// Left subtext <p>
color: 'rgba(255,255,255,0.45)'
```

Right label and subtext stay unchanged (`var(--text)` / `var(--muted)`).

- [ ] **Step 4: Run dev server and verify**

```bash
cd "C:/Users/97254/Desktop/ronen-landing page"
npm run dev
```

Open `http://localhost:5173`. You should see:
- Dark navy left half, white right half at 50/50 on load
- Moving mouse left → dark side expands
- Moving mouse right → white side shrinks the dark area
- "deep learning" label is white text on dark left
- `<full stack>` label is dark text on white right
- Mouse leaves → snaps back to 50/50

---

### Task 2: Floating code snippets

**Files:**
- Modify: `src/components/SplitHero.tsx`

- [ ] **Step 1: Add left (AI) floating snippets**

Add this block inside `<section>`, after the three motion divs (backgrounds + divider), before the existing left label panel. The constants at the top of the component body:

```ts
const MONO_FONT = "'IBM Plex Mono', monospace"
```

The snippets JSX (pill = dark bg with border, plain = no bg):

```tsx
{/* ── AI snippets (left) ── */}
<div
  className="hidden md:block"
  style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}
>
  {/* Pill: loss */}
  <div style={{
    position: 'absolute', top: '12%', left: '3%',
    background: 'rgba(22,27,34,0.92)', border: '1px solid #30363d',
    borderRadius: '6px', padding: '4px 10px',
    fontFamily: MONO_FONT, fontSize: '0.65rem', color: '#c9d1d9',
  }}>
    <span style={{ color: '#3fb950' }}>loss:</span> 0.0423
  </div>
  {/* Pill: model */}
  <div style={{
    position: 'absolute', top: '35%', left: '2%',
    background: 'rgba(22,27,34,0.92)', border: '1px solid #30363d',
    borderRadius: '6px', padding: '4px 10px',
    fontFamily: MONO_FONT, fontSize: '0.62rem', color: '#c9d1d9',
  }}>
    <span style={{ color: '#58a6ff' }}>model</span> = <span style={{ color: '#e3b341' }}>SNN</span>(64)
  </div>
  {/* Plain: accuracy */}
  <div style={{
    position: 'absolute', top: '55%', left: '4%',
    fontFamily: MONO_FONT, fontSize: '0.62rem', color: '#3fb950', opacity: 0.8,
  }}>
    accuracy: 94.2%
  </div>
  {/* Plain muted: stack */}
  <div style={{
    position: 'absolute', top: '72%', left: '3%',
    fontFamily: MONO_FONT, fontSize: '0.58rem', color: 'rgba(136,136,136,0.55)',
  }}>
    PyTorch · NumPy · sklearn
  </div>
  {/* Pill: epoch */}
  <div style={{
    position: 'absolute', bottom: '14%', left: '5%',
    background: 'rgba(22,27,34,0.92)', border: '1px solid #30363d',
    borderRadius: '6px', padding: '4px 10px',
    fontFamily: MONO_FONT, fontSize: '0.6rem', color: '#c9d1d9',
  }}>
    <span style={{ color: '#bc8cff' }}>epoch</span> 47/100{' '}
    <span style={{ color: '#e3b341' }}>████░░</span>
  </div>
</div>
```

- [ ] **Step 2: Add right (FS) floating snippets**

Add immediately after the AI snippets block:

```tsx
{/* ── FS snippets (right) ── */}
<div
  className="hidden md:block"
  style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}
>
  {/* Plain: useState */}
  <div style={{
    position: 'absolute', top: '14%', right: '3%',
    fontFamily: MONO_FONT, fontSize: '0.62rem', color: 'rgba(26,46,74,0.55)',
  }}>
    const [data, setData]
  </div>
  {/* Light pill: npm build */}
  <div style={{
    position: 'absolute', top: '38%', right: '2%',
    background: 'rgba(244,244,244,0.95)', border: '1px solid #e8e8e8',
    borderRadius: '6px', padding: '4px 10px',
    fontFamily: MONO_FONT, fontSize: '0.62rem', color: '#1a2e4a',
  }}>
    npm run build <span style={{ color: '#27ae60' }}>✓</span>
  </div>
  {/* Plain: border-radius */}
  <div style={{
    position: 'absolute', top: '58%', right: '4%',
    fontFamily: MONO_FONT, fontSize: '0.6rem', color: 'rgba(136,136,136,0.55)',
  }}>
    border-radius: 12px
  </div>
  {/* Plain muted: stack */}
  <div style={{
    position: 'absolute', bottom: '14%', right: '3%',
    fontFamily: MONO_FONT, fontSize: '0.58rem', color: 'rgba(136,136,136,0.45)',
  }}>
    React · TypeScript · SQL
  </div>
</div>
```

- [ ] **Step 3: Verify in browser**

Dev server is already running at `http://localhost:5173`. Refresh. You should see:
- `loss: 0.0423`, `model = SNN(64)`, `accuracy: 94.2%` floating on the dark left side
- `const [data, setData]`, `npm run build ✓`, `border-radius: 12px` on the white right side
- Both sets are invisible on mobile (< 768px)

---

### Task 3: Laptop outer shell

**Files:**
- Modify: `src/components/SplitHero.tsx`

- [ ] **Step 1: Add font constant and laptop wrapper**

Add at the top of the component body alongside `MONO_FONT`:

```ts
const BODY_FONT = "'DM Sans', sans-serif"
const LABEL_FONT = "'Moderniz', sans-serif"
```

Add the laptop wrapper after the FS snippets block and before the existing left label panel. This step adds only the outer shell (screen lid + keyboard base) — no screen content yet:

```tsx
{/* ── Laptop ── */}
<div
  className="hidden md:block"
  style={{
    position: 'absolute', left: '50%', top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 7,
    width: 'clamp(260px, 28vw, 380px)',
  }}
>
  {/* Screen lid */}
  <div style={{
    background: '#1c1c1e',
    borderRadius: '10px 10px 3px 3px',
    padding: '8px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
  }}>
    {/* Notch */}
    <div style={{
      width: '10px', height: '10px',
      background: '#2a2a2e', borderRadius: '50%',
      margin: '0 auto 6px',
    }} />

    {/* Screen area — content added in Task 4 */}
    <div style={{
      display: 'flex',
      height: 'clamp(150px, 16vw, 210px)',
      borderRadius: '5px',
      overflow: 'hidden',
      position: 'relative',
      background: '#0d1117',
    }} />
  </div>

  {/* Keyboard base */}
  <div style={{
    background: '#222',
    height: '12px',
    borderRadius: '0 0 8px 8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginTop: '1px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
  }}>
    <div style={{ width: '50px', height: '7px', background: '#1a1a1a', borderRadius: '3px' }} />
  </div>
</div>
```

- [ ] **Step 2: Verify shell in browser**

Refresh `http://localhost:5173`. You should see:
- A dark laptop frame centered over the split background
- Thin screen lid, keyboard base with trackpad indent
- No screen content yet (all black)
- Laptop is hidden on mobile

---

### Task 4: Laptop screen — AI half

**Files:**
- Modify: `src/components/SplitHero.tsx`

- [ ] **Step 1: Replace the placeholder screen div with the split screen**

Find the `<div style={{ ... background: '#0d1117' }} />` placeholder from Task 3. Replace it with the full split screen structure. The AI half uses `motion.div` with `screenSplitLeftPct`:

```tsx
{/* Screen */}
<div style={{
  display: 'flex',
  height: 'clamp(150px, 16vw, 210px)',
  borderRadius: '5px',
  overflow: 'hidden',
  position: 'relative',
}}>

  {/* ── AI half ── */}
  <motion.div style={{
    width: screenSplitLeftPct,
    background: '#0d1117',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    overflow: 'hidden',
    flexShrink: 0,
  }}>
    {/* Confusion matrix label */}
    <div style={{
      fontFamily: MONO_FONT, fontSize: '5.5px',
      color: '#3fb950', paddingBottom: '2px',
    }}>
      ● Confusion Matrix — FashionMNIST
    </div>

    {/* 5×5 grid: diagonal = bright navy, off-diagonal = dark, accents = brighter */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '1.5px',
      flex: 1.2,
    }}>
      {[
        '#1e4a8a','#0a1830','#1a3a70','#0a1830','#2060a0',
        '#0a1830','#1e4a8a','#0a1830','#2868b0','#0a1830',
        '#2060a0','#0a1830','#1e4a8a','#0a1830','#0a1830',
        '#0a1830','#2060a0','#0a1830','#1e4a8a','#2060a0',
        '#0a1830','#0a1830','#2868b0','#0a1830','#1e4a8a',
      ].map((bg, i) => (
        <div key={i} style={{ background: bg, borderRadius: '1px' }} />
      ))}
    </div>

    {/* Classification report block */}
    <div style={{
      background: '#161b22',
      borderRadius: '3px',
      padding: '4px 5px',
    }}>
      <div style={{
        fontFamily: MONO_FONT, fontSize: '5px',
        color: '#888', marginBottom: '2px',
      }}>
        Classification Report
      </div>
      {([
        ['precision', '0.88'],
        ['recall',    '0.87'],
        ['f1-score',  '0.87'],
      ] as const).map(([label, val]) => (
        <div key={label} style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: MONO_FONT, fontSize: '5px',
        }}>
          <span style={{ color: '#58a6ff' }}>{label}</span>
          <span style={{ color: '#3fb950' }}>{val}</span>
        </div>
      ))}
    </div>
  </motion.div>

  {/* ── Internal screen divider (placeholder for Task 5) ── */}

  {/* ── FS half placeholder ── */}
  <div style={{ flex: 1, background: '#fff' }} />
</div>
```

- [ ] **Step 2: Verify in browser**

Refresh. Moving the mouse left should widen the AI (dark) half of the laptop screen. You should see:
- Confusion matrix label in green
- 5×5 navy grid with brighter diagonal
- Classification report rows (precision / recall / f1)
- Right half of screen is plain white for now

---

### Task 5: Laptop screen — FS half + internal divider

**Files:**
- Modify: `src/components/SplitHero.tsx`

- [ ] **Step 1: Replace the white FS placeholder with the full FS half**

Find `{/* ── FS half placeholder ── */}` and replace the white div:

```tsx
{/* ── FS half ── */}
<div style={{
  flex: 1,
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}}>
  {/* Mini nav */}
  <div style={{
    background: '#111',
    padding: '3px 7px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexShrink: 0,
  }}>
    <span style={{ fontFamily: BODY_FONT, fontSize: '5px', color: '#fff', fontWeight: 700 }}>RY</span>
    <div style={{ display: 'flex', gap: '5px' }}>
      {['about', 'projects', 'skills'].map((l) => (
        <span key={l} style={{ fontFamily: BODY_FONT, fontSize: '4px', color: '#888' }}>{l}</span>
      ))}
    </div>
  </div>

  {/* Social platform hero area */}
  <div style={{
    flex: 1,
    background: 'linear-gradient(135deg, #f5f0eb 0%, #ece6df 100%)',
    padding: '10px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    gap: '3px',
    overflow: 'hidden',
  }}>
    <div style={{ fontFamily: MONO_FONT, fontSize: '4.5px', color: '#c07a50', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      EVENTS · SOCIAL · MEDIA
    </div>
    <div style={{ fontFamily: BODY_FONT, fontSize: '14px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.1 }}>
      Creating<br />presence.
    </div>
    <div style={{ fontFamily: BODY_FONT, fontSize: '5px', color: '#888' }}>
      Social media management
    </div>
    <div style={{
      background: '#c07a50', color: '#fff',
      borderRadius: '10px', padding: '2px 6px',
      fontSize: '4px', fontFamily: BODY_FONT,
      width: 'fit-content', marginTop: '3px',
    }}>
      Let's create buzz →
    </div>
  </div>
</div>
```

- [ ] **Step 2: Add the internal screen divider**

Find the comment `{/* ── Internal screen divider (placeholder for Task 5) ── */}` and replace it:

```tsx
{/* ── Internal screen divider ── */}
<motion.div style={{
  position: 'absolute',
  left: screenSplitLeftPct,
  top: 0, bottom: 0,
  width: '1px',
  background: 'rgba(100,100,100,0.4)',
  zIndex: 2,
  pointerEvents: 'none',
}} />
```

- [ ] **Step 3: Verify in browser**

Refresh. The full laptop should now show:
- Moving mouse LEFT: AI side (dark, confusion matrix) expands; FS side (editorial warm gradient) shrinks
- Moving mouse RIGHT: FS side expands showing "Creating presence." hero; AI side shrinks
- Center (50/50): equal split, internal divider line visible
- Thin internal divider tracks with the split

---

### Task 6: Mobile layout + final cleanup

**Files:**
- Modify: `src/components/SplitHero.tsx`

- [ ] **Step 1: Add mobile center labels**

The existing left/right label panels are `hidden md:flex`. On mobile the section just shows the white `var(--bg)` background with nothing in the center. Add a mobile-only stacked label block. Place it after the FS snippets block and before the laptop wrapper:

```tsx
{/* ── Mobile: stacked labels ── */}
<div
  className="flex md:hidden"
  style={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '0 2rem',
    zIndex: 2,
    textAlign: 'center',
    gap: '1.5rem',
  }}
>
  <span style={{
    fontFamily: LABEL_FONT,
    fontSize: 'clamp(2rem, 8vw, 3rem)',
    letterSpacing: '-0.03em',
    color: 'var(--text)',
    lineHeight: 1,
  }}>
    deep learning
  </span>
  <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
  <span style={{
    fontFamily: LABEL_FONT,
    fontSize: 'clamp(2rem, 8vw, 3rem)',
    letterSpacing: '-0.03em',
    color: 'var(--text)',
    lineHeight: 1,
  }}>
    {'<full stack>'}
  </span>
</div>
```

- [ ] **Step 2: Verify on mobile viewport**

In browser DevTools, switch to a mobile viewport (e.g. iPhone 12, 390px). You should see:
- White background (no split — motion divs are `hidden md:block`)
- "deep learning" and "\<full stack\>" stacked with a thin divider between them
- No laptop, no snippets
- Scroll cue ↓ visible

Switch back to desktop. Confirm the split + laptop still work.

- [ ] **Step 3: Remove unused `dividerLeft` if still present**

Search for `dividerLeft` in `SplitHero.tsx`. If still defined (line ~11 in the original), delete it — it is now replaced by `bgSplitPct`.

```ts
// DELETE this line if present:
const dividerLeft = useTransform(clampedX, (v) => `${v}%`)
```

TypeScript will warn on unused variables so this is easy to catch.

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/97254/Desktop/ronen-landing page"
git add src/components/SplitHero.tsx
git commit -m "feat: SplitHero — split background + laptop with AI/FS screen"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Mouse LEFT → AI dark bg expands, laptop AI half widens — Task 1 + Task 5
- [x] Mouse RIGHT → FS white bg expands, FS content fills laptop — Task 1 + Task 5
- [x] bgSplitPct = 100 - clampedX — Task 1
- [x] screenSplitLeftPct = clampedX mapped [20,80]→['70%','30%'] — Task 1
- [x] Floating AI snippets (5 items, correct positions) — Task 2
- [x] Floating FS snippets (4 items, correct positions) — Task 2
- [x] Laptop: notch, screen lid shadow, keyboard base + trackpad — Task 3
- [x] Confusion matrix 5×5 grid with navy color scheme — Task 4
- [x] Classification report rows — Task 4
- [x] FS mini nav (RY + links) — Task 5
- [x] FS social platform hero (gradient, title, CTA) — Task 5
- [x] Internal screen divider (motion, tracks split) — Task 5
- [x] Mobile: background split hidden, stacked labels shown — Task 6
- [x] MONO_FONT / BODY_FONT / LABEL_FONT constants — Task 2+3
- [x] Unused `dividerLeft` removed — Task 6

**Placeholder scan:** None found.

**Type consistency:** `screenSplitLeftPct` defined in Task 1 as `useTransform(clampedX, [20, 80], ['70%', '30%'])` and used as `style={{ width: screenSplitLeftPct }}` in Task 4 and `style={{ left: screenSplitLeftPct }}` in Task 5 — consistent. `bgSplitPct` defined in Task 1 and used in Tasks 1 across three motion divs — consistent. Font constants defined in Task 2 and Task 3 — all used before first reference.
