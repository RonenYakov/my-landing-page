import { motion, useReducedMotion } from 'motion/react'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

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
          margin: '0 0 2rem',
        }}
      >
        Let's build something.
      </motion.h2>

      {/* CV preview — clickable image, downloads PDF */}
      <motion.div
        variants={item}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <a
          href="/ronen-cv.pdf"
          download
          aria-label="Download CV"
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <motion.img
            src="/cv-preview.png"
            alt="Ronen Yakobov CV"
            whileHover={reduce ? undefined : { y: -6, scale: 1.015 }}
            transition={{ duration: 0.45, ease: EASE_BRAND }}
            style={{
              display: 'block',
              width: 'clamp(200px, 26vw, 320px)',
              height: 'auto',
              borderRadius: 6,
              transform: 'rotate(-8deg)',
              boxShadow: '0 24px 50px hsl(217 50% 18% / 0.22), 0 8px 18px hsl(217 50% 18% / 0.12)',
            }}
          />
          <span
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.72rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            Download CV ↓
          </span>
        </a>
      </motion.div>
    </motion.section>
  )
}
