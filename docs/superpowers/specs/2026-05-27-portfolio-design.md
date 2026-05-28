# Portfolio Design Spec — Ronen Yakobov
**Date:** 2026-05-27
**Status:** Approved

---

## Design Read
Reading this as: developer/AI portfolio for tech recruiters and hiring managers, with a minimal editorial + kinematic-code language, leaning toward custom local fonts + Motion + GSAP scroll.

## Dials
- `DESIGN_VARIANCE: 7` — asymmetric hero, varied section layouts
- `MOTION_INTENSITY: 7` — GSAP horizontal scroll, Motion entrances, spring divider
- `VISUAL_DENSITY: 3` — generous whitespace, code snippets as the visual layer

---

## Stack
- Vite + React + TypeScript
- Framer Motion (`motion/react`)
- GSAP + ScrollTrigger (ProjectScroll only)
- Lenis (`lenis/react`) — root smooth scroll
- Tailwind CSS
- No routing — single page

---

## Color System
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

## Typography
| Role | Font | Source |
|---|---|---|
| Hero labels | Moderniz.otf | /public/fonts/ |
| Section titles | Barett Street.ttf | /public/fonts/ |
| Project card titles (highlight word) | Dimension.otf | /public/fonts/ |
| Eyebrow / code snippets | IBM Plex Mono | Google Fonts |
| Body / nav | DM Sans | Google Fonts |

Font loading: `@font-face` + `font-display: swap` in globals.css. Copy .otf/.ttf files from `C:\Users\97254\Desktop\fonts\english fonts\` into `/public/fonts/`.

---

## File Structure
```
ronen-landing-page/
├── public/
│   ├── fonts/
│   │   ├── Moderniz.otf
│   │   ├── Barett Street.ttf
│   │   └── Dimension.otf
│   ├── hero/                   # generated placeholder + real photo later
│   ├── projects/
│   │   ├── seizure-detection/
│   │   ├── text-classification/
│   │   ├── social-platform/
│   │   ├── graph-server/
│   │   └── resnet-fashion/
│   └── ronen-cv.pdf
├── src/
│   ├── components/
│   │   ├── NavBar.tsx
│   │   ├── SplitHero.tsx
│   │   ├── ProjectScroll.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── projects.ts
│   ├── hooks/
│   │   └── useLenis.ts
│   ├── styles/
│   │   └── globals.css
│   └── App.tsx
├── docs/superpowers/specs/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Section Specs

### NavBar
- Background: `var(--nav-bg)` (#111111). Height: 56px. Sticky, z-index: 100.
- Left: `RY` — DM Sans 500, 1.1rem, white.
- Center: `about` `projects` `skills` `contact` — DM Sans 400, spaced 2rem.
- Right: GitHub + LinkedIn SVGs (official), white, 20px.
  - GitHub: https://github.com/RonenYakov
  - LinkedIn: https://www.linkedin.com/in/ronen-yakobov-b217211ab/
- No border, no shadow.
- Mobile: hide center links, show RY + icons only.

### SplitHero
- Full `min-h-[100dvh]`, white background.
- Left panel label: `deep learning` — Moderniz.otf, large (~clamp(3rem,8vw,7rem)), `var(--text)`, letter-spacing -0.03em.
- Right panel label: `<full stack>` — same treatment.
- Center: vertical divider `1px var(--border)`, position absolute, tracks mouse X via Framer Motion `useSpring({ stiffness: 60, damping: 18 })`.
- Center image: AI-generated placeholder image (nano-banana) spanning both panels, centered. Folder: `/public/hero/` — real photo dropped here later.
- Divider overlays the image.
- Floating snippets — left panel (AI identity):
  - Style A (VS Code pill): `background: #f0eded`, `border-radius: 6px`, IBM Plex Mono 0.72rem, token colors
    - top:12% left:8% → `loss: 0.0423`
    - top:35% left:5% → `model = SNN(input_size=64)`
    - top:58% left:10% → `epoch 47/100 ████████░░ 82%`
    - bottom:20% left:6% → `torch.save(model, 'seizure_v3.pt')`
  - Style B (plain muted): IBM Plex Mono, `var(--muted)`
    - top:22% left:20% → `import torch`
    - top:70% left:15% → `accuracy: 94.2%`
    - top:45% left:3% → `@dataclass`
  - Plain terms (smallest, `var(--muted)` 60% opacity): `PyTorch` `NumPy` `scikit-learn`
- Floating snippets — right panel (Fullstack identity):
  - Style A:
    - top:15% right:8% → `const [data, setData] = useState([])`
    - top:40% right:5% → `<motion.div whileHover={{ scale: 1.02 }}>`
    - bottom:22% right:7% → `npm run build ✓ 847ms`
  - Style B:
    - top:28% right:18% → `border-radius: 12px`
    - top:62% right:12% → `export default App`
    - top:50% right:3% → `display: flex`
  - Plain terms: `React` `TypeScript` `SQL`
- Bottom center: `scroll ↓` — DM Sans 400, `var(--muted)`, fades on scroll start. NO scroll cue text per taste-skill — use a simple `↓` arrow icon only, subtle.
- Mobile < 768px: snippets hidden, show labels + divider + image only.

### ProjectScroll
- GSAP ScrollTrigger horizontal filmstrip. Pinned section.
- Progress bar: 2px, `var(--navy)`, width = scroll %.
- Cards in flex row, gap: 2rem, left padding clamp(2rem, 8vw, 8rem).
- `start: "top top"`, `pin: true`, `scrub: 1`, `invalidateOnRefresh: true`.
- Mobile < 768px: vertical 2-column grid, no GSAP.

### ProjectCard
- White bg, `border-radius: 12px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`, `border: 1px solid var(--border)`.
- Top ~60%: screenshot image, `object-fit: cover`. Placeholder: `var(--snippet-bg)` + project name in `var(--muted)`.
- Bottom: title in DM Sans 500 (Dimension.otf for highlighted keyword in `var(--navy)`), category in `var(--muted)` below.
- Hover: `translateY(-2px)`, shadow deepens. No other effects.
- Click: opens GitHub repo in new tab.
- Width: 360px fixed.

### Projects Data
| id | title | highlight word | category | GitHub |
|---|---|---|---|---|
| seizure-detection | Deep Learning Seizure Detection | Learning | ai | /seizure-detection |
| text-classification | AI vs Human Text Classifier | Human | ai | /text-classification |
| social-platform | Social Media Management Platform | Media | fullstack | /social-platform |
| graph-server | Multithreaded Graph Server | Graph | systems | /graph-server |
| resnet-fashion | ResNet on FashionMNIST | Fashion | ai | /resnet-fashion |

GitHub base: `https://github.com/RonenYakov`

### About
- White bg, max-width 640px, centered.
- Eyebrow: `(01) about` — IBM Plex Mono, 0.72rem, letter-spacing 0.28em, uppercase, `var(--muted)`.
- Section title: Barett Street.ttf, italic style.
- Body: "I'm a CS graduate who builds across the full stack and deep learning. I care about clean systems, real problems, and work that ships." — Ronen rewrites this.
- Section entrance: `EASE_BRAND [0.77,0,0.175,1]`, duration 0.85.

### Skills
- No bars, no percentages. Two plain columns.
- Eyebrow: `(02) skills`
- Left column: Languages & Frameworks
- Right column: Tools & AI Workflow
- Tags: `border: 1px solid var(--border)`, `border-radius: 100px`. Hover: `border-color: var(--navy)`.
- Content: basic stack relevant to deep learning + fullstack (Python, PyTorch, React, TypeScript, Node.js, SQL, Git, etc.)

### Contact
- Eyebrow: `(03) contact`
- Two centered items:
  - Email: `ronen0902@gmail.com`
  - CV: `<a href="/ronen-cv.pdf" download>Download CV</a>`
- Source CV: `C:\Users\97254\Desktop\Ronen-CV 2026.pdf` → copy to `/public/ronen-cv.pdf` during build.

### Footer
`ronen0902@gmail.com · github · linkedin · +972 054-266-4674` — DM Sans 400, `var(--muted)`, plain `<a>` tags.

---

## Global Rules
- White bg everywhere except navbar
- No shadows except `0 1px 3px rgba(0,0,0,0.08)` on cards and `0 0 0 1px` focus rings
- No gradients
- No glow effects
- No em-dashes anywhere
- Icons: lucide-react for GitHub/LinkedIn in navbar only
- Grain overlay: `opacity: 0.03`, `mix-blend-mode: multiply`, fixed, `z-index: 9999`, `pointer-events: none`
- Lenis root: `lerp: 0.09, smoothWheel: true`
- Section entrances: `EASE_BRAND [0.77,0,0.175,1]`, `duration: 0.85`, `whileInView`, `once: false`
- Scroll listeners: always `{ passive: true }`
- `min-h-[100dvh]` never `h-screen`
- `useEffect` animations always have cleanup

---

## Hero Image Generation
Use nano-banana to generate a placeholder image for the hero center:
- Style: split portrait, left half stylized/illustrated (like paint strokes or neural network overlay), right half photorealistic — referencing the split-identity concept
- No real face — abstract human silhouette or symbolic representation
- Saved to `/public/hero/hero-placeholder.webp`
- Real photo folder: `/public/hero/` — Ronen drops real photo here later

---

## Build Order
1. Scaffold Vite + install deps + copy fonts + globals.css + CSS vars
2. NavBar
3. SplitHero — divider + snippets + mouse spring + generated hero image
4. ProjectScroll + ProjectCard (placeholders)
5. About + Skills + Contact + Footer
6. Lenis root + grain overlay + section entrances
7. Mobile responsive a must!
8. Copy CV to /public/
9. Vercel deploy (later)
