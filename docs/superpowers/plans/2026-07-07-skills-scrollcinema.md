# Skills ScrollCinema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the phone-mockup Skills section with a full-viewport pinned scroll-scrub: Higgsfield-generated navy-on-white footage drawn frame-by-frame to a canvas, with 3 skill-group overlays revealed in sync.

**Architecture:** One ~4s Higgsfield clip sliced by ffmpeg into ~64 webp frames in `public/cinema/`. A new `SkillsCinema.tsx` pins via GSAP ScrollTrigger (same pattern as `ProjectScroll.tsx`), maps scrub progress → frame index on a `<canvas>`, and crossfades 3 overlay groups from the same progress value. Reduced-motion and mobile get a static fallback.

**Tech Stack:** Vite + React + TypeScript, GSAP ScrollTrigger, motion/react, Higgsfield MCP (`generate_video`), ffmpeg (on PATH via winget).

**Spec:** `docs/superpowers/specs/2026-07-07-skills-scrollcinema-design.md` — read it first.

## Global Constraints

- White background everywhere; navy `#1a2e4a` / `#4a6080` only. No glow, no gradients, no shadows.
- Total frame payload in `public/cinema/` **must stay under 2.5 MB**.
- `EASE_BRAND = [0.77, 0, 0.175, 1]` for motion/react transitions.
- Eyebrow style: IBM Plex Mono, `0.72rem`, `letter-spacing 0.28em`, uppercase, `var(--muted)`.
- Tag pill style: IBM Plex Mono `0.62rem`, `1px solid var(--border)`, `border-radius 100px`, `padding 0.22rem 0.6rem`.
- Higgsfield: invoke the `gen-media-prompting` skill BEFORE generating; check balance first; **max 2 generation attempts total** — if both fail, stop and report, do not burn credits.
- This repo has no test framework. Verification = `npm run build` (runs `tsc && vite build`) passing + visual check in `npm run dev`. Windows/PowerShell environment.
- Never touch `SplitHero.tsx`, `HeroField.tsx` (hero is final), `.env*` files. Do not `git push`.

---

### Task 1: Generate footage and slice frames

**Files:**
- Create: `public/cinema/frame_001.webp` … `frame_NNN.webp` (~64 frames)
- Create (scratch only, not committed): `higgsfield-raw.mp4` in the session scratchpad dir

**Interfaces:**
- Produces: zero-padded frame files `public/cinema/frame_%03d.webp`, 1280px wide, and the real frame count `FRAME_COUNT` (record it — Task 2 hardcodes it).

- [ ] **Step 1: Check Higgsfield balance**

Call the `balance` MCP tool. If credits are insufficient for one video generation, STOP and report to the user.

- [ ] **Step 2: Invoke the gen-media-prompting skill, then generate the clip**

Invoke skill `gen-media-prompting`. Then call `generate_video` (use `models_explore(action:'recommend')` if unsure of model; prefer a cheap text-to-video model, ~4s, landscape 16:9). Prompt (adapt per skill guidance, keep every constraint):

> Minimal abstract 3D animation on a pure seamless white studio background. Thousands of small matte dark-navy particles (deep navy blue, #1a2e4a, some lighter slate-blue #4a6080) begin as loose drifting organic dust scattered across the frame, then gradually and smoothly assemble into a precise, minimal 3D lattice grid structure. Macro scale, very slow elegant motion, locked-off static camera, soft even studio lighting. Matte particles only — no glow, no bloom, no shine, no text, no logos, no gradients in the background, no camera shake. Clean, architectural, premium.

Poll `job_status` until complete; download the mp4 to the scratchpad as `higgsfield-raw.mp4`. If the result has a non-white background, visible glow, or text, you may retry ONCE with a corrected prompt. Two failures → stop and report.

- [ ] **Step 3: Slice to webp frames**

```powershell
New-Item -ItemType Directory -Force "public/cinema"
ffmpeg -i "<scratchpad>/higgsfield-raw.mp4" -vf "fps=16,scale=1280:-2" -c:v libwebp -q:v 60 "public/cinema/frame_%03d.webp"
```

(4s × 16fps ≈ 64 frames. If the clip is 5s, use `fps=13` to stay near 64.)

- [ ] **Step 4: Verify payload budget**

```powershell
(Get-ChildItem public/cinema | Measure-Object Length -Sum).Sum / 1MB
(Get-ChildItem public/cinema).Count
```

Expected: total < 2.5 (MB). If over budget, re-run ffmpeg with `-q:v 50`, then `-q:v 40`, then `scale=1024:-2` until under. Record the final frame count — call it `FRAME_COUNT` for Task 2.

- [ ] **Step 5: Visual sanity check**

Open 3 frames (first, middle, last) with the Read tool. Confirm: white background, navy particles, progression from loose dust → assembled lattice, no text/glow. If the footage doesn't progress (static), treat as a failed attempt per the retry rule.

- [ ] **Step 6: Commit**

```powershell
git add public/cinema
git commit -m "assets: skills scrollcinema frames (Higgsfield + ffmpeg)"
```

---

### Task 2: `SkillsCinema.tsx` — pinned canvas scrub + overlays

**Files:**
- Create: `src/components/SkillsCinema.tsx`

**Interfaces:**
- Consumes: `public/cinema/frame_%03d.webp` from Task 1 (set `FRAME_COUNT` to the real count).
- Produces: `export function SkillsCinema(): JSX.Element` — a self-contained `<section id="skills">`. Task 4 imports it in `App.tsx`.

- [ ] **Step 1: Create the component**

Write `src/components/SkillsCinema.tsx`. **Replace `FRAME_COUNT = 64` with the real count from Task 1.** Complete file:

```tsx
import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 64 // ← set to the real count of files in public/cinema
const framePath = (i: number) => `/cinema/frame_${String(i + 1).padStart(3, '0')}.webp`

type SkillGroup = { title: string; tags: string[] }

const GROUPS: SkillGroup[] = [
  {
    title: 'AI / ML',
    tags: ['Neural Networks', 'CNNs', 'PyTorch', 'scikit-learn', 'Transfer Learning', 'Model Evaluation'],
  },
  {
    title: 'Full Stack',
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'SQL / PostgreSQL', 'Tailwind', 'REST APIs'],
  },
  {
    title: 'Data & Tooling',
    tags: ['Python', 'Data Preprocessing', 'Git', 'Docker', 'Vite'],
  },
]

const FADE = 0.06 // fraction of scrub used for each group's fade in/out

// opacity of group i at progress p; groups own equal thirds, last group holds at the end
function groupOpacity(i: number, p: number): number {
  const start = i / GROUPS.length
  const end = (i + 1) / GROUPS.length
  const fadeIn = i === 0 ? 1 : (p - start) / FADE
  const fadeOut = i === GROUPS.length - 1 ? 1 : (end - p) / FADE
  return Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)))
}

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.62rem',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        borderRadius: 100,
        padding: '0.22rem 0.6rem',
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        background: 'rgba(255,255,255,0.7)',
      }}
    >
      {label}
    </span>
  )
}

function GroupOverlay({ group, opacity }: { group: SkillGroup; opacity: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 'clamp(2rem, 8vw, 8rem)',
        opacity,
        transform: `translateY(${(1 - opacity) * 14}px)`,
        pointerEvents: 'none',
        visibility: opacity === 0 ? 'hidden' : 'visible',
      }}
    >
      <h3
        style={{
          fontFamily: "'Moderniz', sans-serif",
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 400,
          letterSpacing: '-0.025em',
          color: 'var(--text)',
          margin: '0 0 1.4rem',
          lineHeight: 1.05,
        }}
      >
        {group.title}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', maxWidth: 480 }}>
        {group.tags.map((t) => (
          <Tag key={t} label={t} />
        ))}
      </div>
    </div>
  )
}

export function SkillsCinema() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 767px)')
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsMobile(mqMobile.matches)
    setReduced(mqReduced.matches)
    const onMobile = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    const onReduced = (e: MediaQueryListEvent) => setReduced(e.matches)
    mqMobile.addEventListener('change', onMobile)
    mqReduced.addEventListener('change', onReduced)
    return () => {
      mqMobile.removeEventListener('change', onMobile)
      mqReduced.removeEventListener('change', onReduced)
    }
  }, [])

  const drawFrame = (p: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // nearest loaded frame at or below the target, so gaps never flash white
    let idx = Math.min(FRAME_COUNT - 1, Math.floor(p * FRAME_COUNT))
    while (idx > 0 && !imagesRef.current[idx]?.complete) idx--
    const img = imagesRef.current[idx]
    if (!img || !img.complete || img.naturalWidth === 0) return
    const cw = canvas.width
    const ch = canvas.height
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
  }

  // preload frames when the section approaches (1 viewport early)
  useEffect(() => {
    if (isMobile || reduced || !wrapRef.current) return
    const el = wrapRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()
        for (let i = 0; i < FRAME_COUNT; i++) {
          const img = new Image()
          img.src = framePath(i)
          img.onload = () => {
            if (i === 0 || Math.floor(progressRef.current * FRAME_COUNT) === i) {
              drawFrame(progressRef.current)
            }
          }
          imagesRef.current[i] = img
        }
      },
      { rootMargin: '100% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isMobile, reduced])

  // canvas sizing + pin/scrub
  useEffect(() => {
    if (isMobile || reduced || !wrapRef.current || !canvasRef.current) return
    const wrap = wrapRef.current
    const canvas = canvasRef.current

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = wrap.clientWidth * dpr
      canvas.height = wrap.clientHeight * dpr
      drawFrame(progressRef.current)
    }
    size()
    window.addEventListener('resize', size, { passive: true })

    let ctx: ReturnType<typeof gsap.context> | null = null
    const raf = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: wrap,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress
            drawFrame(self.progress)
            setProgress(self.progress)
          },
        })
      }, wrap)
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
      ctx?.revert()
    }
  }, [isMobile, reduced])

  if (isMobile || reduced) return <SkillsStatic />

  return (
    <section id="skills" ref={wrapRef} style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* progress line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 2,
          background: 'var(--navy)',
          width: `${progress * 100}%`,
          zIndex: 10,
          transition: 'width 0.05s linear',
        }}
      />

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden />

      {/* fixed eyebrow */}
      <p
        style={{
          position: 'absolute',
          top: 'clamp(2rem, 5vw, 4rem)',
          left: 'clamp(2rem, 8vw, 8rem)',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.72rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          margin: 0,
          zIndex: 5,
        }}
      >
        (02) skills
      </p>

      {GROUPS.map((g, i) => (
        <GroupOverlay key={g.title} group={g} opacity={groupOpacity(i, progress)} />
      ))}
    </section>
  )
}

// static fallback: mobile and prefers-reduced-motion
function SkillsStatic() {
  return (
    <section id="skills" style={{ padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)', maxWidth: 820, margin: '0 auto' }}>
      <p
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.72rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          margin: '0 0 2.5rem',
        }}
      >
        (02) skills
      </p>
      <img
        src={framePath(FRAME_COUNT - 1)}
        alt=""
        aria-hidden
        style={{ width: '100%', height: 'auto', display: 'block', marginBottom: '3rem' }}
      />
      {GROUPS.map((g) => (
        <div key={g.title} style={{ marginBottom: '2.5rem' }}>
          <h3
            style={{
              fontFamily: "'Moderniz', sans-serif",
              fontSize: 'clamp(1.7rem, 6vw, 2.4rem)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 1rem',
              lineHeight: 1.05,
            }}
          >
            {g.title}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {g.tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
```

- [ ] **Step 2: Build check**

```powershell
npm run build
```

Expected: PASS (a pre-existing ">500 kB chunk" warning is fine). Note: `SkillsCinema` is not imported anywhere yet — `tsc` still type-checks it.

- [ ] **Step 3: Commit**

```powershell
git add src/components/SkillsCinema.tsx
git commit -m "feat: SkillsCinema pinned frame-scrub section with skill overlays"
```

---

### Task 3: Wire into App, remove old Skills

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/components/Skills.tsx`

**Interfaces:**
- Consumes: `SkillsCinema` from Task 2.

- [ ] **Step 1: Edit `src/App.tsx`**

Replace the `Skills` import with `SkillsCinema`, and in JSX replace `<Skills />` with `<SkillsCinema />`. Remove the `<FieldRibbon />` that sits between `<Skills />` and `<Contact />` (the one between `<About />` and `<ProjectScroll />` STAYS). Resulting `<main>`:

```tsx
import { SkillsCinema } from './components/SkillsCinema'
// (remove: import { Skills } from './components/Skills')

      <main style={{ paddingTop: '56px' }}>
        <SplitHero />
        <About />
        <FieldRibbon />
        <ProjectScroll />
        <SkillsCinema />
        <Contact />
        {/* <FunFacts /> */}
      </main>
```

- [ ] **Step 2: Delete the old component**

```powershell
git rm src/components/Skills.tsx
```

If anything else imports `Skills` (`grep -r "components/Skills'" src`), it's only `App.tsx` — already handled.

- [ ] **Step 3: Build check**

```powershell
npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```powershell
git add src/App.tsx
git commit -m "feat: replace Skills phones with SkillsCinema, drop trailing FieldRibbon"
```

---

### Task 4: Visual verification pass

**Files:** none created — tuning only (edits allowed in `src/components/SkillsCinema.tsx`).

- [ ] **Step 1: Run the dev server and inspect**

```powershell
npm run dev
```

Scroll to Skills and verify each item:
1. Section pins for ~2.5 viewport heights; footage scrubs forward/backward smoothly with scroll.
2. Frames blend seamlessly with the white page (no visible video rectangle edges). If an off-white seam is visible, add `filter: 'contrast(1.02)'`-style fixes ONLY as a last resort — prefer re-slicing with a slight white-point lift in ffmpeg: `-vf "fps=16,scale=1280:-2,curves=all='0/0 0.94/1 1/1'"`.
3. Exactly 3 skill groups crossfade at thirds; only one visible at a time; tags legible over the footage (the `rgba(255,255,255,0.7)` pill background keeps them readable).
4. Progress line tracks the scrub.
5. Overlay text does not cover the densest part of the footage — if it does, change `GroupOverlay`'s `paddingLeft` block to right-aligned (`alignItems: 'flex-end'; paddingRight: clamp(...)`) or nudge per-group.
6. Narrow the window below 768px → static fallback renders (final frame + 3 stacked groups). Emulate reduced motion (DevTools → Rendering) → same fallback.
7. Nav link `skills` still scrolls to the section (`id="skills"` preserved).

- [ ] **Step 2: Fix and commit any tuning**

```powershell
git add -A src/components/SkillsCinema.tsx
git commit -m "polish: skills cinema tuning after visual pass"
```

(Skip the commit if nothing changed.)
