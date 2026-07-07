# Skills Redesign — ScrollCinema (frame-by-frame scrub)

Date: 2026-07-07
Status: approved

## Problem

The current Skills section is two iPhone mockups (radar chart + tag lists). The owner wants
a redesign: a cinematic frame-by-frame scroll showpiece that IS the skills section, with all
skills revealed in at most 3 moments.

## Decision summary (from brainstorming)

1. **One fused showpiece.** The scroll-scrub video replaces the Skills section entirely.
2. **Footage: abstract navy build-up.** Matte navy particles/geometry on pure white
   assembling from scattered dust into a finished crisp structure. Same visual language as
   the hero field. Generated with Higgsfield (NOT 21st.dev — it makes components, not footage).
3. **Skills overlay directly on the footage** in exactly 3 groups, one on screen at a time.
4. Old radar chart, phone mockups, and the FieldRibbon after Skills are removed.

## 1. Footage pipeline

- Generate ONE ~4s clip via Higgsfield `generate_video`:
  - Pure white background (#ffffff, must blend seamlessly with the page).
  - Matte navy particles (#1a2e4a with #4a6080 tones) drifting as loose organic dust,
    assembling left-to-right / progressively into a minimal precise 3D lattice structure.
  - Macro feel, slow, NO glow, NO text, NO gradients on background, no camera shake.
  - Invoke `gen-media-prompting` before generating. Check Higgsfield balance first.
    Max 2 generation attempts.
- Slice with ffmpeg (installed via winget, `ffmpeg` on PATH) to ~60–70 webp frames,
  ~1280px wide, quality tuned so total stays **under 2.5 MB** → `public/cinema/frame_XXX.webp`
  (zero-padded, e.g. `frame_001.webp`).

## 2. Component: `SkillsCinema.tsx` (replaces `Skills.tsx`)

- Full-viewport (`100vh`) section, `id="skills"`, pinned via GSAP ScrollTrigger
  (same pattern as ProjectScroll): pin duration ~2.5–3× viewport heights, `scrub: true`.
- A `<canvas>` fills the section; scroll progress maps linearly to frame index,
  frames drawn with `drawImage` (cover-fit, centered).
- **Preload:** IntersectionObserver ~1 viewport before the section; fetch all frames into
  `HTMLImageElement`s. Until loaded, canvas stays white — text never blocks on frames.
- **Progress indicator:** 2px line at top of the pinned section, `var(--navy)`,
  width = scrub %. Same as ProjectScroll.

## 3. Skill overlays — exactly 3 groups

Each group owns ~1/3 of the scrub and crossfades (opacity + slight y) at the boundaries.
Only one group visible at a time. Positioned in whitespace the footage leaves free
(safe default: left-aligned block, vertically centered, `max-width ~480px`; adjust after
seeing real frames).

| # | Scrub range | Title | Tags |
|---|---|---|---|
| 1 | 0–33% (footage loose/organic) | AI / ML | Neural Networks, CNNs, PyTorch, scikit-learn, Transfer Learning, Model Evaluation |
| 2 | 33–66% (structure forming) | Full Stack | React, TypeScript, Node.js, Express, SQL / PostgreSQL, Tailwind, REST APIs |
| 3 | 66–100% (lattice locked) | Data & Tooling | Python, Data Preprocessing, Git, Docker, Vite |

- Eyebrow `(02) skills` (IBM Plex Mono, 0.72rem, ls 0.28em, uppercase, `var(--muted)`)
  stays fixed for the whole pin, above the group title.
- Group title: Moderniz, same scale as section titles (`clamp(2rem,4vw,3.5rem)`),
  `var(--text)`.
- Tags: existing pill style — IBM Plex Mono 0.62rem, `1px solid var(--border)`,
  radius 100px, wrap.
- Group transitions driven by the same scrub progress (motion values or GSAP timeline),
  EASE_BRAND `[0.77,0,0.175,1]`.

## 4. Fallbacks

- **Reduced motion:** no pin, no scrub. Static final frame as `<img>` + all 3 groups
  listed statically below each other.
- **Mobile (<768px):** same scrub if frame weight allows; otherwise the static fallback.
  Decide at implementation by measuring; do not ship >2.5 MB to mobile.
- **Frames missing/failed:** white background, overlays still render and cycle — the
  section degrades to text-only and never breaks.

## 5. Removals / wiring

- Delete `src/components/Skills.tsx` (radar, CategoryBlock, Phone all go).
- In `App.tsx`: replace `<Skills />` with `<SkillsCinema />` and remove the `<FieldRibbon />`
  between Skills and Contact (the cinema is a stronger divider). The FieldRibbon between
  About and ProjectScroll stays.

## Out of scope

- Hero, About, Projects, Contact, Footer — unchanged.
- No live-action footage, no 21st.dev components, no new fonts or colors.
