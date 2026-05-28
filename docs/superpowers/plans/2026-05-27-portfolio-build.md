# Portfolio Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Ronen Yakobov's portfolio site — single-page, Vite + React + TS, with a split-hero, horizontal project scroll, and clean editorial sections.

**Architecture:** Single-page app, all sections mounted in `App.tsx` in scroll order. Lenis wraps the root. GSAP ScrollTrigger is isolated to `ProjectScroll`. All other motion uses Framer Motion (`motion/react`). No routing, no state management.

**Tech Stack:** Vite, React 18, TypeScript, `motion/react`, GSAP + ScrollTrigger, `lenis/react`, Tailwind CSS v3, lucide-react (navbar icons only).

---

## File Map

| File | Responsibility |
|---|---|
| `src/styles/globals.css` | CSS variables, @font-face, resets, grain overlay |
| `src/App.tsx` | Lenis root + section mount order |
| `src/components/NavBar.tsx` | Sticky dark navbar |
| `src/components/SplitHero.tsx` | Full-viewport split hero, mouse divider, snippets |
| `src/components/ProjectScroll.tsx` | GSAP horizontal filmstrip wrapper |
| `src/components/ProjectCard.tsx` | Individual project card |
| `src/components/About.tsx` | About section |
| `src/components/Skills.tsx` | Skills tag columns |
| `src/components/Contact.tsx` | Contact + CV download |
| `src/components/Footer.tsx` | Footer links |
| `src/data/projects.ts` | Projects array (typed) |
| `src/hooks/useLenis.ts` | Lenis scroll instance hook |
| `public/fonts/` | Moderniz.otf, Barett Street.ttf, Dimension.otf |
| `public/hero/` | hero-placeholder.webp (generated) |
| `public/projects/[name]/` | Screenshot folders (empty, filled later) |
| `public/ronen-cv.pdf` | CV file |

---

## Task 1: Scaffold + Install Dependencies

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `index.html`

- [ ] **Step 1: Scaffold Vite project**

Run in `c:\Users\97254\Desktop\`:
```powershell
npm create vite@latest "ronen-landing page" -- --template react-ts
```
When prompted: select React, TypeScript.

- [ ] **Step 2: Install all dependencies**

```powershell
cd "ronen-landing page"
npm install
npm install motion gsap lenis @studio-freight/lenis lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind**

Replace `tailwind.config.ts` content:
```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
} satisfies Config
```

- [ ] **Step 4: Verify dev server starts**

```powershell
npm run dev
```
Expected: `VITE ready on http://localhost:5173`

- [ ] **Step 5: Commit**

```powershell
git init
git add .
git commit -m "feat: scaffold vite react-ts + install deps"
```

---

## Task 2: Fonts + Global CSS + CSS Variables

**Files:**
- Create: `src/styles/globals.css`
- Create: `public/fonts/` (copy font files)
- Modify: `src/main.tsx`
- Create: `public/grain.png` (tiny noise texture — use inline CSS fallback)

- [ ] **Step 1: Copy font files**

```powershell
New-Item -ItemType Directory -Force "public\fonts"
Copy-Item "C:\Users\97254\Desktop\fonts\english fonts\Moderniz.otf" "public\fonts\Moderniz.otf"
Copy-Item "C:\Users\97254\Desktop\fonts\english fonts\Barett Street.ttf" "public\fonts\Barett Street.ttf"
Copy-Item "C:\Users\97254\Desktop\fonts\english fonts\Dimension.otf" "public\fonts\Dimension.otf"
```

- [ ] **Step 2: Create globals.css**

Create `src/styles/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: 'Moderniz';
  src: url('/fonts/Moderniz.otf') format('opentype');
  font-display: swap;
}

@font-face {
  font-family: 'Barett Street';
  src: url('/fonts/Barett Street.ttf') format('truetype');
  font-display: swap;
}

@font-face {
  font-family: 'Dimension';
  src: url('/fonts/Dimension.otf') format('opentype');
  font-display: swap;
}

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

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: auto; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Grain overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px 128px;
  opacity: 0.03;
  mix-blend-mode: multiply;
}
```

- [ ] **Step 3: Import globals in main.tsx**

Replace `src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 4: Verify fonts load**

```powershell
npm run dev
```
Open browser → DevTools → Network → filter "fonts". Confirm Moderniz.otf, Barett Street.ttf, Dimension.otf return 200.

- [ ] **Step 5: Commit**

```powershell
git add .
git commit -m "feat: globals.css, css variables, local font faces"
```

---

## Task 3: NavBar

**Files:**
- Create: `src/components/NavBar.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create NavBar component**

Create `src/components/NavBar.tsx`:
```tsx
import { Github, Linkedin } from 'lucide-react'

const links = ['about', 'projects', 'skills', 'contact'] as const

export function NavBar() {
  return (
    <nav
      style={{ background: 'var(--nav-bg)', color: 'var(--nav-text)', zIndex: 100 }}
      className="fixed top-0 left-0 right-0 h-14 flex items-center px-8"
    >
      {/* Left: initials */}
      <span style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '1.1rem' }}>
        RY
      </span>

      {/* Center: nav links */}
      <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8 list-none">
        {links.map(link => (
          <li key={link}>
            <a
              href={`#${link}`}
              style={{ color: 'var(--nav-text)', fontFamily: 'DM Sans', fontSize: '1rem', textDecoration: 'none', opacity: 0.85 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* Right: icons */}
      <div className="ml-auto flex items-center gap-4">
        <a href="https://github.com/RonenYakov" target="_blank" rel="noreferrer" style={{ color: 'var(--nav-text)' }}>
          <Github size={20} />
        </a>
        <a href="https://www.linkedin.com/in/ronen-yakobov-b217211ab/" target="_blank" rel="noreferrer" style={{ color: 'var(--nav-text)' }}>
          <Linkedin size={20} />
        </a>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Mount in App.tsx**

Replace `src/App.tsx`:
```tsx
import { NavBar } from './components/NavBar'

export default function App() {
  return (
    <>
      <NavBar />
      <main style={{ paddingTop: '56px' }}>
        {/* sections mount here */}
      </main>
    </>
  )
}
```

- [ ] **Step 3: Verify**

`npm run dev` — confirm dark sticky navbar with RY, links, icons. Resize to mobile — confirm links hide.

- [ ] **Step 4: Commit**

```powershell
git add src/components/NavBar.tsx src/App.tsx
git commit -m "feat: sticky dark navbar with icons"
```

---

## Task 4: Projects Data

**Files:**
- Create: `src/data/projects.ts`
- Create: `public/projects/[name]/` folders

- [ ] **Step 1: Create projects data file**

Create `src/data/projects.ts`:
```ts
export interface Project {
  id: string
  title: string
  highlightWord: string
  category: 'ai' | 'fullstack' | 'systems'
  githubUrl: string
  image?: string
}

export const projects: Project[] = [
  {
    id: 'seizure-detection',
    title: 'Deep Learning Seizure Detection',
    highlightWord: 'Learning',
    category: 'ai',
    githubUrl: 'https://github.com/RonenYakov/seizure-detection',
  },
  {
    id: 'text-classification',
    title: 'AI vs Human Text Classifier',
    highlightWord: 'Human',
    category: 'ai',
    githubUrl: 'https://github.com/RonenYakov/text-classification',
  },
  {
    id: 'social-platform',
    title: 'Social Media Management Platform',
    highlightWord: 'Media',
    category: 'fullstack',
    githubUrl: 'https://github.com/RonenYakov/social-platform',
  },
  {
    id: 'graph-server',
    title: 'Multithreaded Graph Server',
    highlightWord: 'Graph',
    category: 'systems',
    githubUrl: 'https://github.com/RonenYakov/graph-server',
  },
  {
    id: 'resnet-fashion',
    title: 'ResNet on FashionMNIST',
    highlightWord: 'Fashion',
    category: 'ai',
    githubUrl: 'https://github.com/RonenYakov/resnet-fashion',
  },
]
```

- [ ] **Step 2: Create screenshot placeholder folders**

```powershell
$projects = @('seizure-detection','text-classification','social-platform','graph-server','resnet-fashion')
foreach ($p in $projects) { New-Item -ItemType Directory -Force "public\projects\$p" }
New-Item -ItemType Directory -Force "public\hero"
```

- [ ] **Step 3: Commit**

```powershell
git add src/data/projects.ts public/projects public/hero
git commit -m "feat: projects data + placeholder asset folders"
```

---

## Task 5: ProjectCard

**Files:**
- Create: `src/components/ProjectCard.tsx`

- [ ] **Step 1: Create ProjectCard**

Create `src/components/ProjectCard.tsx`:
```tsx
import { motion } from 'motion/react'
import type { Project } from '../data/projects'

interface Props {
  project: Project
}

function HighlightTitle({ title, word }: { title: string; word: string }) {
  const parts = title.split(word)
  return (
    <span>
      {parts[0]}
      <span style={{ color: 'var(--navy)', fontFamily: 'Dimension, DM Sans, sans-serif' }}>{word}</span>
      {parts[1]}
    </span>
  )
}

export function ProjectCard({ project }: Props) {
  const imageSrc = project.image ?? null

  return (
    <motion.a
      href={project.githubUrl}
      target="_blank"
      rel="noreferrer"
      className="block flex-shrink-0"
      style={{
        width: '360px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        background: '#fff',
        textDecoration: 'none',
        color: 'var(--text)',
        overflow: 'hidden',
      }}
      whileHover={{
        y: -2,
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
        borderColor: 'var(--navy)',
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Image area */}
      <div
        style={{
          aspectRatio: '16/10',
          background: 'var(--snippet-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {imageSrc ? (
          <img src={imageSrc} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center', padding: '1rem' }}>
            {project.title}
          </span>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '1.25rem' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.95rem', marginBottom: '0.4rem', lineHeight: 1.4 }}>
          <HighlightTitle title={project.title} word={project.highlightWord} />
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {project.category}
        </p>
      </div>
    </motion.a>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/ProjectCard.tsx
git commit -m "feat: project card component with highlight word"
```

---

## Task 6: ProjectScroll (GSAP Horizontal Filmstrip)

**Files:**
- Create: `src/components/ProjectScroll.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ProjectScroll**

Create `src/components/ProjectScroll.tsx`:
```tsx
'use client'
import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import { ProjectCard } from './ProjectCard'

gsap.registerPlugin(ScrollTrigger)

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

export function ProjectScroll() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (isMobile || !wrapRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const distance = trackRef.current!.scrollWidth - window.innerWidth

      const tween = gsap.to(trackRef.current, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      })
      return tween
    }, wrapRef)

    return () => ctx.revert()
  }, [isMobile])

  if (isMobile) {
    return (
      <section id="projects" style={{ padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '3rem' }}>
          (00) projects
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>
    )
  }

  return (
    <section id="projects" ref={wrapRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '2px',
          background: 'var(--navy)',
          width: `${progress * 100}%`,
          zIndex: 10,
          transition: 'none',
        }}
      />

      {/* Eyebrow */}
      <div style={{ position: 'absolute', top: 'clamp(80px,12vw,160px)', left: 'clamp(2rem,8vw,8rem)', zIndex: 5 }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          (00) projects
        </p>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100vh',
          paddingLeft: 'clamp(2rem,8vw,8rem)',
          paddingRight: '4rem',
          gap: '2rem',
          willChange: 'transform',
        }}
      >
        {projects.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Mount in App.tsx**

```tsx
import { NavBar } from './components/NavBar'
import { ProjectScroll } from './components/ProjectScroll'

export default function App() {
  return (
    <>
      <NavBar />
      <main style={{ paddingTop: '56px' }}>
        <ProjectScroll />
      </main>
    </>
  )
}
```

- [ ] **Step 3: Verify**

`npm run dev` — scroll down, cards should pan horizontally. Progress bar at top fills. On mobile (<768px) vertical 2-col grid shows.

- [ ] **Step 4: Commit**

```powershell
git add src/components/ProjectScroll.tsx src/App.tsx
git commit -m "feat: horizontal project scroll with GSAP + mobile grid"
```

---

## Task 7: SplitHero

**Files:**
- Create: `src/components/SplitHero.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create SplitHero**

Create `src/components/SplitHero.tsx`:
```tsx
import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

const leftSnippets = [
  { style: 'pill', top: '12%', left: '8%',   text: 'loss: 0.0423' },
  { style: 'pill', top: '35%', left: '5%',   text: 'model = SNN(input_size=64)' },
  { style: 'pill', top: '58%', left: '10%',  text: 'epoch 47/100 ████░░ 82%' },
  { style: 'pill', bottom: '20%', left: '6%', text: "torch.save(model, 'seizure_v3.pt')" },
  { style: 'plain', top: '22%', left: '20%', text: 'import torch' },
  { style: 'plain', top: '70%', left: '15%', text: 'accuracy: 94.2%' },
  { style: 'plain', top: '45%', left: '3%',  text: '@dataclass' },
  { style: 'term',  top: '80%', left: '25%', text: 'PyTorch' },
  { style: 'term',  top: '15%', left: '30%', text: 'NumPy' },
]

const rightSnippets = [
  { style: 'pill', top: '15%', right: '8%',    text: 'const [data, setData] = useState([])' },
  { style: 'pill', top: '40%', right: '5%',    text: '<motion.div whileHover={{ scale: 1.02 }}>' },
  { style: 'pill', bottom: '22%', right: '7%', text: 'npm run build ✓ 847ms' },
  { style: 'plain', top: '28%', right: '18%',  text: 'border-radius: 12px' },
  { style: 'plain', top: '62%', right: '12%',  text: 'export default App' },
  { style: 'plain', top: '50%', right: '3%',   text: 'display: flex' },
  { style: 'term',  top: '75%', right: '22%',  text: 'React' },
  { style: 'term',  top: '18%', right: '28%',  text: 'TypeScript' },
]

function Snippet({ s, visible }: { s: typeof leftSnippets[0]; visible: boolean }) {
  const pos: React.CSSProperties = {
    position: 'absolute',
    top: (s as any).top,
    left: (s as any).left,
    right: (s as any).right,
    bottom: (s as any).bottom,
    pointerEvents: 'none',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.3s',
  }

  if (s.style === 'pill') {
    return (
      <div style={{ ...pos, background: '#f0eded', borderRadius: '6px', padding: '5px 10px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', color: 'var(--snippet-code)', whiteSpace: 'nowrap' }}>
        {s.text}
      </div>
    )
  }
  if (s.style === 'plain') {
    return (
      <div style={{ ...pos, fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: 'var(--muted)' }}>
        {s.text}
      </div>
    )
  }
  // term
  return (
    <div style={{ ...pos, fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'var(--muted)', opacity: visible ? 0.5 : 0 }}>
      {s.text}
    </div>
  )
}

export function SplitHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(50) // percent
  const springX = useSpring(rawX, { stiffness: 60, damping: 18 })
  const [showScroll, setShowScroll] = useState(true)
  const [snippetsVisible, setSnippetsVisible] = useState(false)

  useEffect(() => {
    // Fade in snippets after mount
    const t = setTimeout(() => setSnippetsVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 40) setShowScroll(false) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current!.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    rawX.set(Math.max(20, Math.min(80, pct)))
  }

  const handleMouseLeave = () => rawX.set(50)

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden', background: 'var(--bg)' }}
    >
      {/* Left panel */}
      <motion.div
        style={{ position: 'absolute', inset: 0, right: 'auto', width: springX.get() + '%' }}
        className="hidden md:block"
      >
        <motion.div style={{ position: 'absolute', inset: 0, width: '100vw' }}>
          {/* Hero label */}
          <div style={{
            position: 'absolute', top: '50%', left: 'clamp(2rem,8vw,6rem)',
            transform: 'translateY(-50%)',
            fontFamily: 'Moderniz, sans-serif',
            fontSize: 'clamp(3rem,8vw,7rem)',
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1,
            userSelect: 'none',
          }}>
            deep learning
          </div>

          {/* Snippets */}
          {leftSnippets.map((s, i) => <Snippet key={i} s={s} visible={snippetsVisible} />)}
        </motion.div>
      </motion.div>

      {/* Right panel */}
      <motion.div
        style={{ position: 'absolute', inset: 0, left: 'auto', right: 0 }}
        className="hidden md:block"
      >
        <motion.div style={{ position: 'absolute', inset: 0, width: '100vw', right: 0, left: 'auto' }}>
          {/* Hero label */}
          <div style={{
            position: 'absolute', top: '50%', right: 'clamp(2rem,8vw,6rem)',
            transform: 'translateY(-50%)',
            fontFamily: 'Moderniz, sans-serif',
            fontSize: 'clamp(3rem,8vw,7rem)',
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1,
            userSelect: 'none',
            textAlign: 'right',
          }}>
            {'<full stack>'}
          </div>

          {/* Snippets */}
          {rightSnippets.map((s, i) => <Snippet key={i} s={s} visible={snippetsVisible} />)}
        </motion.div>
      </motion.div>

      {/* Center hero image */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 'clamp(280px,40vw,520px)',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        <img
          src="/hero/hero-placeholder.webp"
          alt="Ronen Yakobov"
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>

      {/* Divider */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '1px',
          background: 'var(--border)',
          zIndex: 3,
          left: springX.get() + '%',
          x: '-50%',
        }}
        className="hidden md:block"
      />

      {/* Mobile view */}
      <div className="md:hidden flex flex-col items-center justify-center min-h-[100dvh] text-center px-6">
        <div style={{ fontFamily: 'Moderniz, sans-serif', fontSize: 'clamp(2.5rem,12vw,5rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          deep learning
        </div>
        <div style={{ width: '1px', height: '3rem', background: 'var(--border)', margin: '1.5rem auto' }} />
        <div style={{ fontFamily: 'Moderniz, sans-serif', fontSize: 'clamp(2.5rem,12vw,5rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {'<full stack>'}
        </div>
      </div>

      {/* Scroll arrow */}
      {showScroll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          style={{
            position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)',
            fontFamily: 'DM Sans, sans-serif', fontSize: '1.2rem', color: 'var(--muted)',
            zIndex: 5,
          }}
        >
          ↓
        </motion.div>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Fix divider to use motion style**

The divider `left` needs to be a motion value. Replace the divider block with:
```tsx
<motion.div
  style={{
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '1px',
    background: 'var(--border)',
    zIndex: 3,
    left: springX,
    x: '-50%',
  }}
  className="hidden md:block"
/>
```

- [ ] **Step 3: Mount SplitHero above ProjectScroll in App.tsx**

```tsx
import { NavBar } from './components/NavBar'
import { SplitHero } from './components/SplitHero'
import { ProjectScroll } from './components/ProjectScroll'

export default function App() {
  return (
    <>
      <NavBar />
      <main style={{ paddingTop: '56px' }}>
        <SplitHero />
        <ProjectScroll />
      </main>
    </>
  )
}
```

- [ ] **Step 4: Verify**

`npm run dev` — hero fills viewport, labels on left/right, divider tracks mouse, snippets fade in. On mobile: stacked labels, no snippets.

- [ ] **Step 5: Commit**

```powershell
git add src/components/SplitHero.tsx src/App.tsx
git commit -m "feat: split hero with mouse-tracked divider and floating snippets"
```

---

## Task 8: Generate Hero Placeholder Image (nano-banana)

**Files:**
- Create: `public/hero/hero-placeholder.webp`

- [ ] **Step 1: Generate via nano-banana MCP**

Prompt to use:
```
Abstract split-identity concept. Left half: neural network visualization, glowing node connections, soft scientific diagram, monochrome blue-grey tones. Right half: clean code editor aesthetic, floating React components, CSS grid lines, white and grey. Center: seamless vertical divide. No human face. Editorial, minimal, portfolio-quality. White background, portrait orientation.
```
Model: `nano_banana_pro`, aspect ratio: `2:3`, resolution: `2k`.

Save output to `public/hero/hero-placeholder.webp`.

- [ ] **Step 2: Verify image loads in browser**

`npm run dev` — hero center image appears. If not visible, check browser console for 404.

- [ ] **Step 3: Commit**

```powershell
git add public/hero/hero-placeholder.webp
git commit -m "feat: add hero placeholder image"
```

---

## Task 9: About, Skills, Contact, Footer

**Files:**
- Create: `src/components/About.tsx`
- Create: `src/components/Skills.tsx`
- Create: `src/components/Contact.tsx`
- Create: `src/components/Footer.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create About**

Create `src/components/About.tsx`:
```tsx
import { motion } from 'motion/react'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

export function About() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: 0.85, ease: EASE_BRAND }}
      style={{ padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)' }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '2rem' }}>
          (01) about
        </p>
        <h2 style={{ fontFamily: 'Barett Street, serif', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.2, marginBottom: '2rem', letterSpacing: '-0.025em' }}>
          Building across the stack.
        </h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', lineHeight: 1.8, color: 'var(--text)', maxWidth: '56ch' }}>
          I'm a CS graduate who builds across the full stack and deep learning. I care about clean systems, real problems, and work that ships.
        </p>
      </div>
    </motion.section>
  )
}
```

- [ ] **Step 2: Create Skills**

Create `src/components/Skills.tsx`:
```tsx
import { motion } from 'motion/react'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

const languages = ['Python', 'TypeScript', 'JavaScript', 'C', 'SQL', 'HTML', 'CSS']
const frameworks = ['React', 'Node.js', 'PyTorch', 'scikit-learn', 'Express', 'Tailwind']
const tools = ['Git', 'Docker', 'PostgreSQL', 'Vite', 'Linux', 'REST APIs']
const ai = ['Neural Networks', 'CNNs', 'Transfer Learning', 'Data Preprocessing', 'Model Evaluation']

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        border: '1px solid var(--border)',
        borderRadius: '100px',
        padding: '0.35rem 0.85rem',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.85rem',
        color: 'var(--text)',
        cursor: 'default',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--navy)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {label}
    </span>
  )
}

export function Skills() {
  return (
    <motion.section
      id="skills"
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: 0.85, ease: EASE_BRAND }}
      style={{ padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)' }}
    >
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '3rem' }}>
        (02) skills
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', maxWidth: '900px' }}>
        <div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            Languages & Frameworks
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[...languages, ...frameworks].map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
        <div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            Tools & AI Workflow
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[...tools, ...ai].map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
```

- [ ] **Step 3: Create Contact**

Copy CV file first:
```powershell
Copy-Item "C:\Users\97254\Desktop\Ronen-CV 2026.pdf" "public\ronen-cv.pdf"
```

Create `src/components/Contact.tsx`:
```tsx
import { motion } from 'motion/react'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

export function Contact() {
  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: 0.85, ease: EASE_BRAND }}
      style={{ padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}
    >
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '2rem' }}>
        (03) contact
      </p>
      <h2 style={{ fontFamily: 'Barett Street, serif', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 400, fontStyle: 'italic', marginBottom: '3rem', letterSpacing: '-0.025em' }}>
        Let's build something.
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <a
          href="mailto:ronen0902@gmail.com"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.1rem', color: 'var(--navy)', textDecoration: 'none', borderBottom: '1px solid var(--border)', paddingBottom: '2px' }}
        >
          ronen0902@gmail.com
        </a>
        <a
          href="/ronen-cv.pdf"
          download
          style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
            border: '1px solid var(--navy)', borderRadius: '100px',
            padding: '0.6rem 1.6rem', color: 'var(--navy)', textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--navy)' }}
        >
          Download CV
        </a>
      </div>
    </motion.section>
  )
}
```

- [ ] **Step 4: Create Footer**

Create `src/components/Footer.tsx`:
```tsx
export function Footer() {
  return (
    <footer style={{ padding: '2.5rem clamp(1.5rem,5vw,4rem)', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'var(--muted)' }}>
        <a href="mailto:ronen0902@gmail.com" style={{ color: 'var(--muted)', textDecoration: 'none' }}>ronen0902@gmail.com</a>
        <a href="https://github.com/RonenYakov" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none' }}>github</a>
        <a href="https://www.linkedin.com/in/ronen-yakobov-b217211ab/" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none' }}>linkedin</a>
        <span>+972 054-266-4674</span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Mount all in App.tsx**

```tsx
import { NavBar } from './components/NavBar'
import { SplitHero } from './components/SplitHero'
import { ProjectScroll } from './components/ProjectScroll'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <NavBar />
      <main style={{ paddingTop: '56px' }}>
        <SplitHero />
        <ProjectScroll />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 6: Verify full page**

`npm run dev` — scroll through all sections. Check: About fades in, Skills tags show, Contact has email + CV button, Footer renders.

- [ ] **Step 7: Commit**

```powershell
git add src/components/About.tsx src/components/Skills.tsx src/components/Contact.tsx src/components/Footer.tsx src/App.tsx public/ronen-cv.pdf
git commit -m "feat: about, skills, contact, footer sections"
```

---

## Task 10: Lenis Smooth Scroll

**Files:**
- Create: `src/hooks/useLenis.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create useLenis hook**

Create `src/hooks/useLenis.ts`:
```ts
import { useEffect } from 'react'
import Lenis from 'lenis'

let lenis: Lenis | null = null

export function useLenis() {
  useEffect(() => {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true })

    function raf(time: number) {
      lenis!.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis?.destroy()
      lenis = null
    }
  }, [])
}
```

- [ ] **Step 2: Use hook in App.tsx**

Add `useLenis()` call at the top of App:
```tsx
import { useLenis } from './hooks/useLenis'

export default function App() {
  useLenis()
  // ... rest unchanged
}
```

- [ ] **Step 3: Verify**

`npm run dev` — scrolling should feel smooth/eased. GSAP ProjectScroll should still work correctly (Lenis + GSAP ScrollTrigger are compatible).

- [ ] **Step 4: Commit**

```powershell
git add src/hooks/useLenis.ts src/App.tsx
git commit -m "feat: lenis smooth scroll"
```

---

## Task 11: Update project CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update skills in use**

Add to the Skills in use line in CLAUDE.md:
```
**Skills in use**: `my-design-style` → `taste-skill` (design-taste-frontend) → `frontend-design`
```

- [ ] **Step 2: Note Higgsfield + nano-banana + 21st.dev**

Add section:
```markdown
## Asset Generation
- Hero image: nano-banana MCP (`/public/hero/hero-placeholder.webp`)
- Components: 21st.dev magic component builder available
- Stitch: available for design system components
- Real hero photo: drop in `/public/hero/` and update SplitHero img src
```

- [ ] **Step 3: Commit**

```powershell
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with skills and asset generation notes"
```

---

## Self-Review

**Spec coverage check:**
- NavBar: Task 3
- SplitHero + divider + snippets: Task 7
- Hero image generation: Task 8
- ProjectScroll GSAP: Task 6
- ProjectCard with highlight: Task 5
- Projects data: Task 4
- About: Task 9
- Skills: Task 9
- Contact + CV: Task 9
- Footer: Task 9
- Lenis: Task 10
- Font loading: Task 2
- CSS variables + grain: Task 2
- Mobile responsive: Task 6 (projects grid) + Task 7 (hero mobile)
- Placeholder folders: Task 4

**Gaps found and resolved:**
- Scroll arrow fade on scroll: included in Task 7
- CV copy step: included in Task 9
- CLAUDE.md update: Task 11

**Type consistency:**
- `Project` interface defined in Task 4, used in Tasks 5 and 6 — consistent
- `projects` array exported from `src/data/projects.ts` — imported correctly in Tasks 5/6
- `EASE_BRAND` defined locally in each component that needs it — consistent
