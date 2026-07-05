## Task Execution
- For timed or urgent tasks, produce a minimal working script first, then iterate — avoid lengthy DOM exploration or brainstorming up front
- Never echo, log, or commit API keys; if a key is needed, ask the user to paste it into a .env file

## Workflow
- After rewriting a file, diff against the previous version to confirm no functions were accidentally removed
- Commit after each completed component unless told otherwise
- Keep CLAUDE.md concise: remove completed steps once verified

## Environment
- OS: Windows (use PowerShell syntax, not bash)
- For interactive CLI installers (npx, gh auth login), instruct the user to run them directly in their terminal

# Portfolio — Ronen Yakobov

Global rules: `C:\Users\97254\.claude\CLAUDE.md`
Design spec: `docs/superpowers/specs/2026-05-27-portfolio-design.md`
Implementation plan: `docs/superpowers/plans/2026-05-27-portfolio-build.md`
**Skills in use**: `my-design-style` → `taste-skill` (design-taste-frontend) → `frontend-design`
**Stack**: Vite + React + TypeScript + `motion/react` + Lenis + GSAP + Tailwind CSS v3 + lucide-react

## Current Build Status

**Task 1 COMPLETE** — scaffold done, all deps installed, git initialized.

**Remaining tasks (execute in order from the plan):**
- [ ] Task 2: Fonts + `src/styles/globals.css` + CSS variables + grain overlay
- [ ] Task 3: NavBar component
- [ ] Task 4: Projects data (`src/data/projects.ts`) + public folder structure
- [ ] Task 5: ProjectCard component
- [ ] Task 6: ProjectScroll (GSAP horizontal filmstrip)
- [ ] Task 7: SplitHero (mouse divider + floating snippets)
- [ ] Task 8: Hero placeholder image (nano-banana MCP)
- [ ] Task 9: About + Skills + Contact + Footer + wire up App.tsx
- [ ] Task 10: Lenis smooth scroll hook

## Key asset paths (copy these before Task 2/9)
- Fonts source: `C:\Users\97254\Desktop\fonts\english fonts\` → copy Moderniz.otf, Barett Street.ttf, Dimension.otf into `public\fonts\`
- CV source: `C:\Users\97254\Desktop\Ronen-CV 2026.pdf` → copy to `public\ronen-cv.pdf`

**Stack**: Vite + React + TypeScript + `motion/react` + Lenis + GSAP + Tailwind CSS v3 + lucide-react
---

## Design Principles

- **White background everywhere.** No dark backgrounds except the navbar.
- **Navy blue** for now may try similar options (`#1a2e4a`). No bright colors
- **Massive whitespace.** Padding-y: `clamp(80px, 12vw, 160px)` on all sections.
- No glow effects
- Icons: official SVGs only (GitHub, LinkedIn from lucide-react or official brand SVGs).

---

## Colors

```css
:root {
  --bg:          #ffffff;
  --text:        #111111;
  --muted:       #888888;
  --border:      #e8e8e8;
  --navy:        #1a2e4a;
  --navy-muted:  #4a6080;
  --nav-bg:      #111111;
  --nav-text:    #f5f5f5;
  --snippet-bg:  #f4f4f4;
  --snippet-code:#1a2e4a;
}
```

---

## Typography (from my-design-style)
first understand the vibe and use the fonts from my fonts folder start with modernized
| Role | Font | Weight | Size |
|---|---|---|---|
| Hero left keywords | IBM Plex Mono | 400 | `0.8rem–1.4rem` varied |
| Hero right keywords | IBM Plex Mono | 400 | `0.8rem–1.4rem` varied |
| Section titles | Cormorant Garamond | 400 italic | `clamp(2rem,4vw,3.5rem)` |
| Body / nav | DM Sans | 400/500 | `1rem` |
| Eyebrow labels | IBM Plex Mono | 400 | `0.72rem / ls 0.28em` uppercase |
---

## NavBar

- Background: `var(--nav-bg)` (#111111). Text: `var(--nav-text)`.
- Left: initials `RY` — DM Sans 500, `1.1rem`, white.
- Center: links — `about` `projects` `skills` `contact` — DM Sans 400, spaced `2rem` apart.
- Right: GitHub icon + LinkedIn icon — official SVGs, white, `20px`, link to real profiles.
  - GitHub: `https://github.com/RonenYakov`
  - LinkedIn: `https://www.linkedin.com/in/ronen-yakobov-b217211ab/`
- Sticky top, `z-index: 100`. Height: `56px`. No border, no shadow.

---

## SplitHero (3D redesign, 2026-07)

Full viewport (`100dvh`), white background. Centerpiece is `HeroField.tsx`: a react-three-fiber
particle field (~2600 points desktop / ~860 mobile) where the left side drifts as an organic
neural cloud (`--navy-muted`, AI identity) and the right side snaps into a precise 3D lattice
(`--navy`, fullstack identity). A springed frontier (`stiffness: 60, damping: 18`) morphs
particles between the two forms and is driven by mouse X (mouse left = AI takes over, same
semantics as the old laptop wipe). Mouse Y gives a subtle parallax tilt.

- Entrance: particles assemble from a scatter sphere over 1.9s; held ~2.2s on first visit until the boot overlay lifts.
- Hairline frontier divider rendered in-scene (thin plane, `#8fa0b8`, opacity 0.3), hidden when fully committed to one side.
- Side labels unchanged: `ai native` left / `<full stack>` right, Moderniz.
- Mobile: labels stacked top/bottom, frontier auto-cycles 0↔100 (no cursor).
- Reduced motion: static balanced field, frontier locked at center, `frameloop="demand"`.
- No glow, no gradients on particles; round disc sprites; `dpr` capped at 1.75.

**Bottom center**: `↓` — DM Sans 400, `var(--muted)`, fades on scroll start.

---

## ProjectScroll

**Reference**: `/docs/projects-scroll-reference.png` and `/docs/projects-cards-reference.png`

Horizontal filmstrip. Vertical scroll → horizontal translation via GSAP ScrollTrigger.
Pin the section. Scrub `x` from `0` to `-(track.scrollWidth - window.innerWidth)`, `ease: none`.
Progress indicator: `2px` line at top of section, `var(--navy)` color, width = scroll %.

**ProjectCard** (clean, no shadows):
- Width: `360px` fixed. `border: 1px solid var(--border)`. `border-radius: 10px`.
- Top: poster image `aspect-ratio: 16/10`. **Placeholder**: `bg: var(--snippet-bg)`,
  centered text with project title in `var(--muted)`. Real screenshots added later.
- Bottom padding `1.25rem`: title DM Sans 500 + category DM Sans 400 `var(--muted)` below.
- On hover: `border-color: var(--navy)` transition `0.2s`. Nothing else.

---

## Projects Data (`/src/data/projects.ts`)

| id | title | year | category |
|---|---|---|---|
| `seizure-detection` | Deep Learning Seizure Detection | 2025 | ai |
| `text-classification` | AI vs Human Text Classifier | 2024 | ai |
| `social-platform` | Social Media Management Platform | 2024 | fullstack |
| `graph-server` | Multithreaded Graph Server | 2024 | systems |
| `resnet-fashion` | ResNet on FashionMNIST | 2023 | ai |
there are more use my git hub for all the projects


---

## About
White bg, max-width `640px` centered. Eyebrow: `(01) about` — IBM Plex Mono.
Body placeholder: *"I'm a CS graduate who builds across the full stack and deep learning. I care about clean systems, real problems, and work that ships."* — **Ronen rewrites this.**

---

## Skills
No bars, no percentages. Two plain columns: **Languages & Frameworks** | **Tools & AI Workflow**.
Tags: `border: 1px solid var(--border)`, `border-radius: 100px`, hover: `border-color: var(--navy)`.

---

## Contact
Eyebrow `(04) contact`. Two centered items:
- Email: `ronen0902@gmail.com`
- CV: `<a href="/ronen-cv.pdf" download>` — **placeholder, Ronen drops `ronen-cv.pdf` in `/public/` when ready.**

---

## Footer
`ronen0902@gmail.com · github · linkedin · +972 054-266-4674` — DM Sans 400, `var(--muted)`, plain `<a>` tags.

---

## Global Rules

- White bg everywhere except navbar
- No shadows (except `0 0 0 1px` focus rings)
- No gradients
- No icon libraries except lucide-react for GitHub/LinkedIn in navbar only
- Grain overlay: `opacity: 0.03`, `mix-blend-mode: multiply`, fixed, `z-index: 9999`
- Lenis root: `lerp: 0.09, smoothWheel: true`
- Section entrances: `EASE_BRAND [0.77,0,0.175,1]`, `duration: 0.85`
- Mobile < 768px: hero snippets hidden, show only divider + scroll cue; ProjectScroll → vertical grid
- `scroll` listeners: always `{ passive: true }`

---

## Build Order

1. Scaffold + install + globals.css + NavBar
2. SplitHero with hardcoded snippets + mouse divider
3. ProjectScroll + ProjectCard (placeholders)
4. About + Skills + Contact + Footer
5. Lenis + grain + entrances + mobile + Vercel