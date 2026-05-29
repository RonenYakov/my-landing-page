import { motion } from 'motion/react'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]
const ACCENT = '#c0673a'

type Axis = {
  label: string
  score: number // 0..100
  tech: string[]
}

// Ordered clockwise from top. Ronen is strongest in AI/ML and Frontend.
const axes: Axis[] = [
  { label: 'AI / ML', score: 94, tech: ['Neural Networks', 'CNNs', 'PyTorch', 'scikit-learn', 'Transfer Learning', 'Model Evaluation'] },
  { label: 'Frontend', score: 90, tech: ['React', 'TypeScript', 'Tailwind', 'HTML', 'CSS'] },
  { label: 'Languages', score: 85, tech: ['Python', 'TypeScript', 'JavaScript', 'C'] },
  { label: 'Backend', score: 76, tech: ['Node.js', 'Express', 'SQL', 'PostgreSQL', 'REST APIs'] },
  { label: 'Data', score: 80, tech: ['Data Preprocessing', 'Model Evaluation', 'SQL'] },
  { label: 'Tooling / DevOps', score: 72, tech: ['Git', 'Docker', 'Vite', 'Linux'] },
]

const overall = Math.round(axes.reduce((s, a) => s + a.score, 0) / axes.length)

// ---- radar geometry ----
const SIZE = 360
const CENTER = SIZE / 2
const R = 120 // max radius for 100% (slightly tighter so labels fit the narrow screen)
const N = axes.length

// vertex at axis index i for a given fraction (0..1), top-anchored
function vertex(i: number, frac: number): [number, number] {
  const angle = (Math.PI * 2 * i) / N - Math.PI / 2
  return [CENTER + Math.cos(angle) * R * frac, CENTER + Math.sin(angle) * R * frac]
}

function ringPath(frac: number): string {
  return (
    axes
      .map((_, i) => {
        const [x, y] = vertex(i, frac)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
      })
      .join(' ') + ' Z'
  )
}

const dataPolygon = axes
  .map((a, i) => {
    const [x, y] = vertex(i, a.score / 100)
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
  })
  .join(' ') + ' Z'

const rings = [0.25, 0.5, 0.75, 1]

function Radar() {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={`Radar chart of skill scores, overall ${overall} out of 100`}
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
    >
      {/* concentric hexagon grid rings */}
      {rings.map((f) => (
        <path key={f} d={ringPath(f)} fill="none" stroke="var(--border)" strokeWidth={1} />
      ))}

      {/* spokes */}
      {axes.map((_, i) => {
        const [x, y] = vertex(i, 1)
        return (
          <line key={i} x1={CENTER} y1={CENTER} x2={x.toFixed(2)} y2={y.toFixed(2)} stroke="var(--border)" strokeWidth={1} />
        )
      })}

      {/* data polygon */}
      <motion.path
        d={dataPolygon}
        fill={ACCENT}
        fillOpacity={0.14}
        stroke={ACCENT}
        strokeWidth={2}
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE_BRAND }}
        style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
      />

      {/* vertex dots */}
      {axes.map((a, i) => {
        const [x, y] = vertex(i, a.score / 100)
        return <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={3.5} fill={ACCENT} />
      })}

      {/* axis labels */}
      {axes.map((a, i) => {
        const [x, y] = vertex(i, 1.2)
        const anchor = x < CENTER - 4 ? 'end' : x > CENTER + 4 ? 'start' : 'middle'
        return (
          <text
            key={i}
            x={x.toFixed(2)}
            y={y.toFixed(2)}
            textAnchor={anchor}
            dominantBaseline="middle"
            style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '0.04em', fill: 'var(--text)' }}
          >
            {a.label}
          </text>
        )
      })}
    </svg>
  )
}

function ScoreBadge() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: 84,
        height: 84,
        borderRadius: '50%',
        border: `2px solid ${ACCENT}`,
        flexShrink: 0,
      }}
      aria-label={`Overall score ${overall} out of 100, Excellent`}
    >
      <span style={{ fontFamily: 'Moderniz, sans-serif', fontSize: '1.7rem', lineHeight: 1, color: 'var(--navy)' }}>
        {overall}
      </span>
      <span
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.55rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: ACCENT,
          marginTop: '0.3rem',
        }}
      >
        Excellent
      </span>
    </div>
  )
}

function Breakdown() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {axes.map((a, i) => (
        <motion.div
          key={a.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, ease: EASE_BRAND, delay: i * 0.05 }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text)' }}>
              {a.label}
            </span>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', color: 'var(--muted)' }}>
              {a.score}%
            </span>
          </div>

          {/* score bar */}
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 100, overflow: 'hidden', marginBottom: '0.6rem' }}>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: a.score / 100 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EASE_BRAND, delay: i * 0.05 + 0.1 }}
              style={{ height: '100%', background: ACCENT, transformOrigin: 'left', borderRadius: 100 }}
            />
          </div>

          {/* tech tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {a.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '0.62rem',
                  letterSpacing: '0.02em',
                  color: 'var(--muted)',
                  border: '1px solid var(--border)',
                  borderRadius: 100,
                  padding: '0.18rem 0.55rem',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ---- iPhone-style device frame ----
function Phone({
  children,
  delay = 0,
  offsetY = 0,
}: {
  children: React.ReactNode
  delay?: number
  offsetY?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE_BRAND, delay }}
      className="skills-phone"
      style={{
        width: 320,
        maxWidth: '88vw',
        flexShrink: 0,
        background: '#1c1c1e',
        borderRadius: 44,
        padding: 9,
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.45), 0 8px 20px -8px rgba(0,0,0,0.3)',
        marginTop: offsetY,
      }}
    >
      {/* screen */}
      <div
        style={{
          position: 'relative',
          background: 'var(--bg)',
          borderRadius: 38,
          overflow: 'hidden',
          aspectRatio: '9 / 19.5',
        }}
      >
        {/* dynamic island */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 92,
            height: 26,
            background: '#1c1c1e',
            borderRadius: 100,
            zIndex: 2,
          }}
        />
        {/* scrollable screen content */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflowY: 'auto',
            padding: '52px 20px 28px',
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
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
      style={{
        padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.72rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: '1.5rem',
        }}
      >
        (02) skills
      </p>

      <h2
        style={{
          fontFamily: 'Moderniz, sans-serif',
          fontSize: 'clamp(1.8rem,4vw,2.6rem)',
          lineHeight: 1.05,
          color: 'var(--text)',
          margin: '0 0 0.6rem',
        }}
      >
        Skill Score
      </h2>
      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.95rem',
          color: 'var(--muted)',
          margin: '0 0 4rem',
        }}
      >
        A skill-wise breakdown, screen by screen.
      </p>

      {/* two staggered phones */}
      <div
        className="skills-phones"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 'clamp(1.5rem,4vw,3.5rem)',
          flexWrap: 'wrap',
        }}
      >
        {/* Phone 1 — Skill Score radar */}
        <Phone delay={0}>
          <p
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              margin: '0 0 0.4rem',
            }}
          >
            Skill Score
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.4rem' }}>
            <ScoreBadge />
          </div>
          <Radar />
        </Phone>

        {/* Phone 2 — Skill-wise breakdown */}
        <Phone delay={0.15} offsetY={56}>
          <p
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              margin: '0 0 1.4rem',
              textAlign: 'left',
            }}
          >
            Skill-wise breakdown
          </p>
          <div style={{ textAlign: 'left' }}>
            <Breakdown />
          </div>
        </Phone>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .skills-phones { flex-direction: column; align-items: center; }
          .skills-phone { margin-top: 0 !important; }
        }
      `}</style>
    </motion.section>
  )
}
