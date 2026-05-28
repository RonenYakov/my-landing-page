import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface SnippetA {
  style: 'A'
  text: string
  pos: React.CSSProperties
}

interface SnippetB {
  style: 'B'
  text: string
  pos: React.CSSProperties
}

type Snippet = SnippetA | SnippetB

// ─── Data ────────────────────────────────────────────────────────────────────

const LEFT_SNIPPETS: Snippet[] = [
  { style: 'A', text: 'loss: 0.0423',                    pos: { top: '12%', left: '8%' } },
  { style: 'A', text: 'model = SNN(input_size=64)',       pos: { top: '35%', left: '5%' } },
  { style: 'A', text: 'epoch 47/100 ████░░ 82%',         pos: { top: '58%', left: '10%' } },
  { style: 'A', text: "torch.save(model, 'seizure_v3.pt')", pos: { bottom: '20%', left: '6%' } },
  { style: 'B', text: 'import torch',                    pos: { top: '22%', left: '20%' } },
  { style: 'B', text: 'accuracy: 94.2%',                 pos: { top: '70%', left: '15%' } },
  { style: 'B', text: '@dataclass',                      pos: { top: '45%', left: '3%' } },
]

const RIGHT_SNIPPETS: Snippet[] = [
  { style: 'A', text: 'const [data, setData] = useState([])', pos: { top: '15%', right: '8%' } },
  { style: 'A', text: '<motion.div whileHover={{ scale: 1.02 }}>', pos: { top: '40%', right: '5%' } },
  { style: 'A', text: 'npm run build ✓ 847ms',           pos: { bottom: '22%', right: '7%' } },
  { style: 'B', text: 'border-radius: 12px',             pos: { top: '28%', right: '18%' } },
  { style: 'B', text: 'export default App',              pos: { top: '62%', right: '12%' } },
  { style: 'B', text: 'display: flex',                   pos: { top: '50%', right: '3%' } },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function SnippetPill({ text, style, pos, visible }: { text: string; style: 'A' | 'B'; pos: React.CSSProperties; visible: boolean }) {
  const base: React.CSSProperties = {
    position: 'absolute',
    fontFamily: "'IBM Plex Mono', monospace",
    whiteSpace: 'nowrap',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.6s ease',
    pointerEvents: 'none',
    userSelect: 'none',
    ...pos,
  }

  if (style === 'A') {
    return (
      <span
        style={{
          ...base,
          background: '#f0eded',
          borderRadius: '6px',
          padding: '5px 10px',
          fontSize: '0.68rem',
          color: 'var(--snippet-code)',
        }}
      >
        {text}
      </span>
    )
  }

  return (
    <span
      style={{
        ...base,
        fontSize: '0.72rem',
        color: 'var(--muted)',
        background: 'transparent',
      }}
    >
      {text}
    </span>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function SplitHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [snippetsVisible, setSnippetsVisible] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Motion value: cursor X as percentage (0–100)
  const rawX = useMotionValue(50)
  const springX = useSpring(rawX, { stiffness: 60, damping: 18 })

  // Clamp to 20–80 range
  const clampedX = useTransform(springX, (v) => Math.max(20, Math.min(80, v)))

  // Convert percentage → CSS "left" string for the divider
  const dividerLeft = useTransform(clampedX, (v) => `${v}%`)

  // Snippets fade in after 400ms
  useEffect(() => {
    const t = setTimeout(() => setSnippetsVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  // Scroll arrow fade
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mouse tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    rawX.set(pct)
  }

  const handleMouseLeave = () => {
    rawX.set(50)
  }

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
      {/* ── Desktop layout ── */}

      {/* Left panel — full width absolute, text positioned left */}
      <div
        className="hidden md:block"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* "deep learning" label */}
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: 'clamp(2rem, 8vw, 6rem)',
            transform: 'translateY(-50%)',
            fontFamily: "'Moderniz', sans-serif",
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          deep learning
        </span>

        {/* Left snippets */}
        {LEFT_SNIPPETS.map((s, i) => (
          <SnippetPill key={i} text={s.text} style={s.style} pos={s.pos} visible={snippetsVisible} />
        ))}
      </div>

      {/* Right panel — full width absolute, text positioned right */}
      <div
        className="hidden md:block"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* "<full stack>" label */}
        <span
          style={{
            position: 'absolute',
            top: '50%',
            right: 'clamp(2rem, 8vw, 6rem)',
            transform: 'translateY(-50%)',
            fontFamily: "'Moderniz', sans-serif",
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1,
            textAlign: 'right',
            userSelect: 'none',
          }}
        >
          {'<full stack>'}
        </span>

        {/* Right snippets */}
        {RIGHT_SNIPPETS.map((s, i) => (
          <SnippetPill key={i} text={s.text} style={s.style} pos={s.pos} visible={snippetsVisible} />
        ))}
      </div>

      {/* Divider — desktop only */}
      <motion.div
        className="hidden md:block"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '1px',
          background: 'var(--border)',
          zIndex: 3,
          left: dividerLeft,
        }}
      />

      {/* ── Hero image (center) ── */}
      {!imgError && (
        <img
          src="/hero/hero-placeholder.webp"
          alt=""
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(280px, 40vw, 520px)',
            zIndex: 2,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      )}

      {/* ── Mobile layout ── */}
      <div
        className="md:hidden"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Moderniz', sans-serif",
            fontSize: 'clamp(2rem, 12vw, 4rem)',
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1.1,
          }}
        >
          deep learning
        </span>

        {/* Thin horizontal divider on mobile */}
        <div
          style={{
            width: '1px',
            height: '3rem',
            background: 'var(--border)',
            margin: '1.25rem 0',
          }}
        />

        <span
          style={{
            fontFamily: "'Moderniz', sans-serif",
            fontSize: 'clamp(2rem, 12vw, 4rem)',
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1.1,
          }}
        >
          {'<full stack>'}
        </span>
      </div>

      {/* ── Scroll arrow ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
          fontFamily: "'DM Sans', sans-serif",
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
