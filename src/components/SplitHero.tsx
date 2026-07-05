import { useRef, useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { HeroField } from './HeroField'

type Term = { text: string; top: string; edge: number; side: 'left' | 'right' }

// Skill terms floating in each identity's territory. `edge` is % from the
// term's own screen edge; it doubles as the frontier threshold that dims
// the term once the other identity takes its spot.
const TERMS: Term[] = [
  { text: 'PyTorch', top: '16%', edge: 12, side: 'left' },
  { text: 'CNNs / SNNs', top: '27%', edge: 24, side: 'left' },
  { text: 'Python', top: '50%', edge: 31, side: 'left' },
  { text: 'loss: 0.042', top: '71%', edge: 22, side: 'left' },
  { text: 'NumPy', top: '82%', edge: 12, side: 'left' },
  { text: 'React', top: '15%', edge: 13, side: 'right' },
  { text: 'TypeScript', top: '28%', edge: 23, side: 'right' },
  { text: 'Node.js', top: '50%', edge: 31, side: 'right' },
  { text: 'SQL / REST', top: '70%', edge: 22, side: 'right' },
  { text: 'npm run build ✓', top: '82%', edge: 12, side: 'right' },
]

function HeroTerm({ term, index, springX, reduced, introDelay }: {
  term: Term
  index: number
  springX: MotionValue<number>
  reduced: boolean
  introDelay: number
}) {
  // Frontier position (in mouse-% space) at which this term's territory flips
  const T = term.side === 'left' ? 100 - term.edge : term.edge
  const opacity = useTransform(
    springX,
    [T - 10, T + 10],
    term.side === 'left' ? [0.95, 0.15] : [0.15, 0.95]
  )
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: introDelay + 1.1 + index * 0.08, duration: 0.6 }}
      style={{
        position: 'absolute',
        top: term.top,
        ...(term.side === 'left' ? { left: `${term.edge}%` } : { right: `${term.edge}%` }),
      }}
    >
      <motion.span
        animate={reduced ? undefined : { y: [0, -7, 0] }}
        transition={reduced ? undefined : { duration: 5.5 + index * 0.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          display: 'inline-block',
          opacity,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.75rem',
          letterSpacing: '0.02em',
          color: term.side === 'left' ? '#4a6080' : '#1a2e4a',
          whiteSpace: 'nowrap',
        }}
      >
        {term.text}
      </motion.span>
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

      {/* ── Floating skill terms, dimmed when their territory is taken ── */}
      <div
        className="hidden md:block"
        aria-hidden
        style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}
      >
        {TERMS.map((term, i) => (
          <HeroTerm
            key={term.text}
            term={term}
            index={i}
            springX={springX}
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
