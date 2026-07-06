import { useRef, useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { HeroField } from './HeroField'

// Two-shade monochrome: code in navy-muted, comments dimmer. The spotlight
// darkens code toward full navy when the cursor comes near.
const CODE_REST = '#4a6080'
const CODE_FOCUS = '#1a2e4a'
const COMMENT = '#a8b2c0'
const SPOT_RADIUS = 240 // px, cursor distance at which a block is fully awake

type Seg = { t: string; dim?: boolean }
type CodeBlock = {
  lines: Seg[][]
  top: string
  edge: number
  side: 'left' | 'right'
  depth: number // parallax factor, higher = floats closer to the viewer
}

// Multi-line fragments of real code from each discipline, cropped the way an
// IDE viewport would crop them. Indentation is literal (white-space: pre).
const BLOCKS: CodeBlock[] = [
  // AI territory
  {
    side: 'left', top: '13%', edge: 7, depth: 0.6,
    lines: [
      [{ t: 'class SNN(nn.Module):' }],
      [{ t: '    def __init__(self):' }],
      [{ t: '        super().__init__()' }],
      [{ t: '        self.fc1 = nn.Linear(64, 128)' }, { t: '   # 64-channel EEG input', dim: true }],
      [{ t: '        self.lif1 = snn.Leaky(beta=0.9)' }],
      [{ t: '        self.fc2 = nn.Linear(128, 2)' }, { t: '    # seizure / clear', dim: true }],
    ],
  },
  {
    side: 'left', top: '64%', edge: 11, depth: 1.1,
    lines: [
      [{ t: 'for epoch in range(100):' }],
      [{ t: '    spk, mem = model(x_train)' }],
      [{ t: '    loss = criterion(mem, y_train)' }],
      [{ t: '    loss.backward()' }, { t: '                 # loss: 0.0423', dim: true }],
      [{ t: '    optimizer.step()' }, { t: '                # acc: 94.2%', dim: true }],
    ],
  },
  // builder territory
  {
    side: 'right', top: '14%', edge: 7, depth: 0.9,
    lines: [
      [{ t: 'const app = express()' }],
      [{ t: 'const ALLOWED_ORIGINS = [' }],
      [{ t: "    'http://localhost:8080'," }, { t: '   // dev frontend', dim: true }],
      [{ t: "    'https://ronen.dev'," }, { t: '       // live site', dim: true }],
      [{ t: ']' }],
      [{ t: 'app.use(cors({ origin: ALLOWED_ORIGINS }))' }],
    ],
  },
  {
    side: 'right', top: '63%', edge: 10, depth: 0.7,
    lines: [
      [{ t: 'export function App() {' }],
      [{ t: '    const [projects, setProjects] = useState([])' }],
      [{ t: '    useEffect(() => {' }],
      [{ t: "        fetch('/api/projects')" }],
      [{ t: '            .then(r => r.json())' }],
      [{ t: '            .then(setProjects)' }, { t: '   // hydrate on mount', dim: true }],
    ],
  },
]

function HeroCodeBlock({ b, index, springX, springY, cursorX, cursorY, reduced, introDelay }: {
  b: CodeBlock
  index: number
  springX: MotionValue<number>
  springY: MotionValue<number>
  cursorX: MotionValue<number>
  cursorY: MotionValue<number>
  reduced: boolean
  introDelay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const centerRef = useRef({ x: -9999, y: -9999 })

  // Block center in the same container-relative px space as the cursor values.
  // Parallax drift is ≤ ~15px, small enough to ignore for the distance test.
  useEffect(() => {
    const measure = () => {
      const el = ref.current
      const parent = el?.offsetParent as HTMLElement | null
      if (!el || !parent) return
      const r = el.getBoundingClientRect()
      const p = parent.getBoundingClientRect()
      centerRef.current = { x: r.left - p.left + r.width / 2, y: r.top - p.top + r.height / 2 }
    }
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Spotlight: 0 at rest, 1 when the cursor sits on the block, smooth falloff
  const focusRaw = useTransform(() => {
    const c = centerRef.current
    const d = Math.hypot(cursorX.get() - c.x, cursorY.get() - c.y)
    const t = Math.max(0, Math.min(1, 1 - d / SPOT_RADIUS))
    return t * t * (3 - 2 * t)
  })
  const focus = useSpring(focusRaw, { stiffness: 170, damping: 26 })
  const opacity = useTransform(focus, [0, 1], reduced ? [0.7, 0.7] : [0.55, 1])
  const color = useTransform(focus, [0, 1], [CODE_REST, CODE_FOCUS])

  // depth parallax: blocks drift against the cursor at their own rate
  const px = useTransform(springX, [0, 100], [b.depth * 14, -b.depth * 14])
  const py = useTransform(springY, [0, 100], [b.depth * 9, -b.depth * 9])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: introDelay + 1.1 + index * 0.12, duration: 0.7 }}
      style={{
        position: 'absolute',
        top: b.top,
        ...(b.side === 'left' ? { left: `${b.edge}%` } : { right: `${b.edge}%` }),
        x: reduced ? 0 : px,
        y: reduced ? 0 : py,
      }}
    >
      <motion.div style={{ opacity }}>
        <motion.div
          animate={reduced ? undefined : { y: [0, -7, 0] }}
          transition={reduced ? undefined : { duration: 6 + index * 0.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.85rem',
            fontWeight: 500,
            lineHeight: 1.65,
            letterSpacing: '0.01em',
            whiteSpace: 'pre',
            color,
          }}
        >
          {b.lines.map((segs, li) => (
            <div key={li}>
              {segs.map((seg, si) => (
                <span key={si} style={seg.dim ? { color: COMMENT } : undefined}>{seg.t}</span>
              ))}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function SplitHero() {
  const BODY_FONT = "'DM Sans', sans-serif"
  const LABEL_FONT = "'Moderniz', sans-serif"

  const containerRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  )
  const [reduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  // Hold the particle assembly until the boot overlay lifts (first visit only)
  const [introDelay] = useState(() =>
    typeof window !== 'undefined' && !sessionStorage.getItem('ry-intro-seen') ? 2.2 : 0.15
  )

  // Same spring feel as the old screen wipe; now it drives the 3D frontier
  const rawX = useMotionValue(50)
  const springX = useSpring(rawX, { stiffness: 60, damping: 18 })
  const rawY = useMotionValue(50)
  const springY = useSpring(rawY, { stiffness: 60, damping: 18 })
  // container-relative cursor in px, for the code-block spotlight
  const cursorX = useMotionValue(-9999)
  const cursorY = useMotionValue(-9999)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Mobile-only: no cursor, so auto-cycle the frontier between the two identities
  useEffect(() => {
    if (!isMobile || reduced) return
    let cancelled = false
    let controls: ReturnType<typeof animate> | null = null
    const cycle = (to: number) => {
      if (cancelled) return
      controls = animate(rawX, to, {
        duration: 1.6,
        ease: [0.77, 0, 0.175, 1],
        onComplete: () => {
          if (cancelled) return
          window.setTimeout(() => cycle(to === 100 ? 0 : 100), 1400)
        },
      })
    }
    rawX.set(0)
    const start = window.setTimeout(() => cycle(100), 900)
    return () => {
      cancelled = true
      window.clearTimeout(start)
      controls?.stop()
    }
  }, [isMobile, reduced, rawX])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set(((e.clientX - rect.left) / rect.width) * 100)
    rawY.set(((e.clientY - rect.top) / rect.height) * 100)
    cursorX.set(e.clientX - rect.left)
    cursorY.set(e.clientY - rect.top)
  }

  const handleMouseLeave = () => {
    rawX.set(50)
    rawY.set(50)
    cursorX.set(-9999)
    cursorY.set(-9999)
  }

  const labelStyle = {
    fontFamily: LABEL_FONT,
    fontSize: 'clamp(2.2rem, 5.5vw, 4.6rem)',
    letterSpacing: '-0.04em',
    color: '#111',
  } as const

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* ── 3D particle field: neural cloud ⇄ engineered lattice ── */}
      <HeroField
        splitX={springX}
        tiltY={springY}
        compact={isMobile}
        reduced={reduced}
        introDelay={introDelay}
      />

      {/* ── IDE-real code blocks, awakened by the cursor spotlight ── */}
      <div
        className="hidden md:block"
        aria-hidden
        style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}
      >
        {BLOCKS.map((b, i) => (
          <HeroCodeBlock
            key={i}
            b={b}
            index={i}
            springX={springX}
            springY={springY}
            cursorX={cursorX}
            cursorY={cursorY}
            reduced={reduced}
            introDelay={introDelay}
          />
        ))}
      </div>

      {/* ── Side headers (desktop) ── */}
      <div
        className="hidden md:flex"
        aria-hidden
        style={{
          position: 'absolute', left: 'clamp(2rem, 5vw, 5rem)', top: '50%',
          transform: 'translateY(-50%)', zIndex: 6,
          flexDirection: 'column', alignItems: 'flex-start',
          lineHeight: 0.85, pointerEvents: 'none',
        }}
      >
        {['ai', 'native'].map((w) => (
          <span key={w} style={labelStyle}>{w}</span>
        ))}
      </div>
      <div
        className="hidden md:flex"
        aria-hidden
        style={{
          position: 'absolute', right: 'clamp(2rem, 5vw, 5rem)', top: '50%',
          transform: 'translateY(-50%)', zIndex: 6,
          flexDirection: 'column', alignItems: 'flex-end',
          lineHeight: 0.85, textAlign: 'right', pointerEvents: 'none',
        }}
      >
        {['<full', 'stack>'].map((w) => (
          <span key={w} style={labelStyle}>{w}</span>
        ))}
      </div>

      {/* ── Mobile: labels above and below the field ── */}
      <div
        className="flex md:hidden"
        style={{
          position: 'absolute', inset: 0, zIndex: 6,
          flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
          padding: '18vh 1.25rem 16vh', pointerEvents: 'none', textAlign: 'center',
        }}
      >
        <span style={{
          fontFamily: LABEL_FONT, fontSize: 'clamp(1.8rem, 9vw, 2.8rem)',
          letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1,
        }}>
          ai native
        </span>
        <span style={{
          fontFamily: LABEL_FONT, fontSize: 'clamp(1.8rem, 9vw, 2.8rem)',
          letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1,
        }}>
          {'<full stack>'}
        </span>
      </div>

      {/* ── Scroll cue ── */}
      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          zIndex: 6,
          fontFamily: BODY_FONT,
          fontSize: '0.85rem',
          color: 'var(--muted)',
          letterSpacing: '0.05em',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        ↓
      </motion.div>
    </section>
  )
}
