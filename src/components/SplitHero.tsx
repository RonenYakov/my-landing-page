import { useRef, useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useSpring, useTransform, useMotionTemplate, type MotionValue } from 'motion/react'
import { HeroField } from './HeroField'

// VS Code token colors from the original hero spec
const KW = '#569cd6'
const STR = '#ce9178'
const COM = '#6a9955'

type Token = { t: string; c?: string }
type Snippet = {
  tokens: Token[]
  top: string
  edge: number
  side: 'left' | 'right'
  pill?: boolean
  depth: number // parallax factor, higher = floats closer to the viewer
}

// Real bits of code from each discipline, floating in that identity's
// territory. `edge` is % from the snippet's own screen edge; it doubles as
// the frontier threshold at which the snippet materializes or dissolves.
const SNIPPETS: Snippet[] = [
  // AI territory
  { side: 'left', top: '13%', edge: 9, pill: true, depth: 0.9, tokens: [{ t: 'loss: ' }, { t: '0.0423', c: STR }] },
  { side: 'left', top: '24%', edge: 21, depth: 0.5, tokens: [{ t: 'import ', c: KW }, { t: 'torch' }] },
  { side: 'left', top: '33%', edge: 12, pill: true, depth: 1.2, tokens: [{ t: 'model = ' }, { t: 'SNN', c: KW }, { t: '(input_size=' }, { t: '64', c: STR }, { t: ')' }] },
  { side: 'left', top: '47%', edge: 30, depth: 0.7, tokens: [{ t: '@dataclass', c: KW }] },
  { side: 'left', top: '63%', edge: 15, pill: true, depth: 1, tokens: [{ t: 'epoch 47/100 ' }, { t: '████████░░', c: KW }, { t: ' 82%' }] },
  { side: 'left', top: '74%', edge: 25, depth: 0.6, tokens: [{ t: 'accuracy: ' }, { t: '94.2%', c: STR }] },
  { side: 'left', top: '84%', edge: 10, pill: true, depth: 1.1, tokens: [{ t: 'torch.save(model, ' }, { t: "'seizure_v3.pt'", c: STR }, { t: ')' }] },
  // builder territory
  { side: 'right', top: '13%', edge: 9, pill: true, depth: 0.9, tokens: [{ t: 'const', c: KW }, { t: ' [data, setData] = ' }, { t: 'useState', c: KW }, { t: '([])' }] },
  { side: 'right', top: '24%', edge: 22, depth: 0.5, tokens: [{ t: 'display: flex' }] },
  { side: 'right', top: '33%', edge: 11, pill: true, depth: 1.2, tokens: [{ t: '<motion.div ', c: KW }, { t: 'whileHover' }, { t: '={{ scale: ' }, { t: '1.02', c: STR }, { t: ' }}>' }] },
  { side: 'right', top: '47%', edge: 30, depth: 0.7, tokens: [{ t: 'border-radius: ' }, { t: '12px', c: STR }] },
  { side: 'right', top: '63%', edge: 16, pill: true, depth: 1, tokens: [{ t: 'npm run build ' }, { t: '✓ 847ms', c: COM }] },
  { side: 'right', top: '74%', edge: 25, depth: 0.6, tokens: [{ t: 'export default', c: KW }, { t: ' App' }] },
  { side: 'right', top: '84%', edge: 11, pill: true, depth: 1.1, tokens: [{ t: 'git push origin main' }] },
]

function HeroSnippet({ s, index, springX, springY, reduced, introDelay }: {
  s: Snippet
  index: number
  springX: MotionValue<number>
  springY: MotionValue<number>
  reduced: boolean
  introDelay: number
}) {
  // Frontier position (in mouse-% space) at which this snippet's territory flips
  const T = s.side === 'left' ? 100 - s.edge : s.edge
  const range: [number, number] = [T - 8, T + 8]
  const left = s.side === 'left'
  const opacity = useTransform(springX, range, left ? [1, 0] : [0, 1])
  const scale = useTransform(springX, range, left ? [1, 0.92] : [0.92, 1])
  const lift = useTransform(springX, range, left ? [0, 12] : [12, 0])
  const blurPx = useTransform(springX, range, left ? [0, 6] : [6, 0])
  const filter = useMotionTemplate`blur(${blurPx}px)`
  // depth parallax: snippets drift against the cursor at their own rate
  const px = useTransform(springX, [0, 100], [s.depth * 14, -s.depth * 14])
  const py = useTransform(springY, [0, 100], [s.depth * 9, -s.depth * 9])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: introDelay + 1.1 + index * 0.07, duration: 0.6 }}
      style={{
        position: 'absolute',
        top: s.top,
        ...(left ? { left: `${s.edge}%` } : { right: `${s.edge}%` }),
        x: px,
        y: py,
      }}
    >
      <motion.div style={{ opacity, scale, y: lift, filter }}>
        <motion.span
          animate={reduced ? undefined : { y: [0, -6, 0] }}
          transition={reduced ? undefined : { duration: 5 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            display: 'inline-block',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: s.pill ? '0.72rem' : '0.78rem',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            color: s.pill ? 'var(--snippet-code)' : 'var(--navy-muted)',
            ...(s.pill && {
              background: 'var(--snippet-bg)',
              borderRadius: 6,
              padding: '8px 12px',
            }),
          }}
        >
          {s.tokens.map((tok, i) => (
            <span key={i} style={tok.c ? { color: tok.c } : undefined}>{tok.t}</span>
          ))}
        </motion.span>
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
  }

  const handleMouseLeave = () => {
    rawX.set(50)
    rawY.set(50)
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

      {/* ── Floating code snippets, materialize and dissolve with the frontier ── */}
      <div
        className="hidden md:block"
        aria-hidden
        style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}
      >
        {SNIPPETS.map((s, i) => (
          <HeroSnippet
            key={i}
            s={s}
            index={i}
            springX={springX}
            springY={springY}
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
