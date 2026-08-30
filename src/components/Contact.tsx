import { motion, useReducedMotion } from 'motion/react'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

const CV_FACTS: { label: string; value: string }[] = [
  { label: 'front-end', value: 'React, TypeScript' },
  { label: 'back-end', value: 'Node.js, Express, PostgreSQL' },
  { label: 'tooling', value: 'Docker, AWS, Vercel' },
]

export function Contact() {
  const reduce = useReducedMotion()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: reduce ? 0 : 0.05 } },
  }
  const item = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_BRAND } },
      }

  return (
    <motion.section
      id="contact"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      style={{ padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}
    >
      <motion.p
        variants={item}
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.72rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: '2rem',
        }}
      >
        (03) contact
      </motion.p>

      <motion.h2
        variants={item}
        style={{
          fontFamily: "'Moderniz', sans-serif",
          fontSize: 'clamp(2rem,4vw,3.5rem)',
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: 'var(--text)',
          margin: '0 0 clamp(2.5rem,5vw,4rem)',
        }}
      >
        Let's build something.
      </motion.h2>

      {/* CV — real page-one thumbnail beside the credentials it contains */}
      <motion.div
        variants={item}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(2rem,5vw,4.5rem)',
        }}
      >
        {/* Left — the actual document, clickable */}
        <a
          href="/ronen-cv.pdf"
          download
          aria-label="Download CV as PDF"
          style={{ display: 'block', flexShrink: 0, textDecoration: 'none' }}
        >
          <motion.img
            src="/cv-preview.png"
            alt="First page of Ronen Yakobov's CV"
            width={508}
            height={656}
            whileHover={reduce ? undefined : { y: -6, rotate: -2, scale: 1.015 }}
            transition={{ duration: 0.45, ease: EASE_BRAND }}
            style={{
              display: 'block',
              width: 'clamp(180px, 22vw, 260px)',
              height: 'auto',
              borderRadius: 4,
              border: '1px solid var(--border)',
              transform: 'rotate(-6deg)',
              boxShadow: '0 24px 50px hsl(217 50% 18% / 0.22), 0 8px 18px hsl(217 50% 18% / 0.12)',
            }}
          />
        </a>

        {/* Right — what the document says */}
        <div style={{ textAlign: 'left', flex: '0 1 24rem', minWidth: '15rem' }}>
          <p
            style={{
              fontFamily: "'Moderniz', sans-serif",
              fontSize: 'clamp(1.1rem,2vw,1.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              margin: '0 0 0.5rem',
            }}
          >
            Ronen Yakobov
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.9rem',
              lineHeight: 1.5,
              color: 'var(--muted)',
              margin: '0 0 1.75rem',
            }}
          >
            CS graduate, GPA 88. SCE Academic College, 2022–2025.
          </p>

          <dl style={{ margin: '0 0 2rem', display: 'grid', gap: '0.7rem' }}>
            {CV_FACTS.map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '0.9rem' }}>
                <dt
                  style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '0.65rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--navy)',
                    flex: '0 0 6rem',
                  }}
                >
                  {label}
                </dt>
                <dd
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.92rem',
                    color: 'var(--text)',
                    margin: 0,
                  }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <a
            href="/ronen-cv.pdf"
            download
            style={{
              display: 'inline-block',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.72rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--nav-text)',
              background: 'var(--navy)',
              textDecoration: 'none',
              borderRadius: 100,
              padding: '0.75rem 1.6rem',
            }}
          >
            Download CV ↓
          </a>
          <p
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              color: 'var(--muted)',
              margin: '0.9rem 0 0',
            }}
          >
            one page · pdf
          </p>
        </div>
      </motion.div>
    </motion.section>
  )
}
