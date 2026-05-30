import { motion } from 'motion/react'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

const ACCENT = '#1a2e4a'

type Category = {
  label: string
  strength: number // 0..1 — radar reach, no number is shown
  tech: string[]
}

const categories: Category[] = [
  { label: 'AI / ML', strength: 0.94, tech: ['Neural Networks', 'CNNs', 'PyTorch', 'scikit-learn', 'Transfer Learning', 'Model Evaluation'] },
  { label: 'Frontend', strength: 0.90, tech: ['React', 'TypeScript', 'Tailwind', 'HTML', 'CSS'] },
  { label: 'Languages', strength: 0.85, tech: ['Python', 'TypeScript', 'JavaScript', 'C'] },
  { label: 'Backend', strength: 0.76, tech: ['Node.js', 'Express', 'SQL', 'PostgreSQL', 'REST APIs'] },
  { label: 'Data', strength: 0.80, tech: ['Data Preprocessing', 'Model Evaluation', 'SQL'] },
  { label: 'Tooling / DevOps', strength: 0.72, tech: ['Git', 'Docker', 'Vite'] },
]

// ---- Radar wheel (no score) ----
const RADAR_SIZE = 260
const RADAR_R = 92
const RADAR_C = RADAR_SIZE / 2

function vertex(i: number, frac: number): [number, number] {
  const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2
  return [RADAR_C + Math.cos(angle) * RADAR_R * frac, RADAR_C + Math.sin(angle) * RADAR_R * frac]
}

function ringPath(frac: number): string {
  return (
    categories
      .map((_, i) => {
        const [x, y] = vertex(i, frac)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
      })
      .join(' ') + ' Z'
  )
}

const dataPolygon =
  categories
    .map((c, i) => {
      const [x, y] = vertex(i, c.strength)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ') + ' Z'

function Radar() {
  const rings = [0.25, 0.5, 0.75, 1]
  return (
    <svg
      viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
      role="img"
      aria-label="Radar chart showing relative strengths across skill categories"
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
    >
      {rings.map((f) => (
        <path key={f} d={ringPath(f)} fill="none" stroke="var(--border)" strokeWidth={1} />
      ))}
      {categories.map((_, i) => {
        const [x, y] = vertex(i, 1)
        return <line key={i} x1={RADAR_C} y1={RADAR_C} x2={x.toFixed(2)} y2={y.toFixed(2)} stroke="var(--border)" strokeWidth={1} />
      })}
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
        style={{ transformOrigin: `${RADAR_C}px ${RADAR_C}px` }}
      />
      {categories.map((c, i) => {
        const [x, y] = vertex(i, c.strength)
        return <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={3} fill={ACCENT} />
      })}
      {categories.map((c, i) => {
        const [x, y] = vertex(i, 1.22)
        const anchor = x < RADAR_C - 4 ? 'end' : x > RADAR_C + 4 ? 'start' : 'middle'
        return (
          <text
            key={i}
            x={x.toFixed(2)}
            y={y.toFixed(2)}
            textAnchor={anchor}
            dominantBaseline="middle"
            style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, letterSpacing: '0.04em', fill: 'var(--text)' }}
          >
            {c.label}
          </text>
        )
      })}
    </svg>
  )
}

function CategoryBlock({ cat }: { cat: Category }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          fontSize: '0.95rem',
          color: 'var(--navy)',
          margin: '0 0 0.65rem',
          letterSpacing: '-0.005em',
        }}
      >
        {cat.label}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {cat.tech.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.62rem',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: 100,
              padding: '0.22rem 0.6rem',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function Phone({
  children,
  delay = 0,
  offsetY = 0,
  eyebrow,
}: {
  children: React.ReactNode
  delay?: number
  offsetY?: number
  eyebrow: string
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
        boxShadow: '0 30px 60px -20px hsl(217 50% 12% / 0.45), 0 8px 20px -8px hsl(217 50% 12% / 0.3)',
        marginTop: offsetY,
      }}
    >
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflowY: 'auto',
            padding: '52px 20px 28px',
          }}
        >
          <p
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              margin: '0 0 1.25rem',
              textAlign: 'left',
            }}
          >
            {eyebrow}
          </p>
          <div style={{ textAlign: 'left' }}>{children}</div>
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
          fontFamily: "'Moderniz', sans-serif",
          fontSize: 'clamp(2rem,4vw,3.5rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          letterSpacing: '-0.025em',
          color: 'var(--text)',
          margin: '0 0 0.6rem',
          lineHeight: 1.05,
        }}
      >
        What I know, for now.
      </h2>
      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.95rem',
          color: 'var(--muted)',
          margin: '0 0 4rem',
        }}
      >
        A stack wise breakdown, screen by screen.
      </p>

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
        <Phone delay={0} eyebrow="Skill radar">
          <div style={{ marginBottom: '1rem' }}>
            <Radar />
          </div>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.72rem',
              color: 'var(--muted)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Relative strength across the categories I work in.
          </p>
        </Phone>

        <Phone delay={0.15} offsetY={56} eyebrow="Skill-wise breakdown">
          {categories.map((c) => (
            <CategoryBlock key={c.label} cat={c} />
          ))}
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
