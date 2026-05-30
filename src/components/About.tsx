import { motion, useReducedMotion } from 'motion/react'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

const fadeUp = (delay = 0, reduce = false) =>
  reduce
    ? { initial: false as const, whileInView: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.75, ease: EASE_BRAND, delay },
      }

export function About() {
  const reduce = useReducedMotion() ?? false
  return (
    <section id="about" style={{ padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)' }}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.85, ease: EASE_BRAND }}
        className="about-card"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#111',
        }}
      >
        {/* Background image with Ken Burns entrance */}
        <motion.div
          initial={reduce ? false : { scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.6, ease: [0.25, 0, 0.1, 1] }}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/about-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.55)',
          }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(26,46,74,0.45) 100%)',
        }} />

        {/* Content — staggered */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(2rem,5vw,4rem)',
        }}>
          <motion.p {...fadeUp(0.2, reduce)} style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.72rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '1.25rem',
          }}>
            (01) about
          </motion.p>

          <motion.h2 {...fadeUp(0.35, reduce)} style={{
            fontFamily: "'Moderniz', sans-serif",
            fontSize: 'clamp(2rem,4.5vw,4.5rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginBottom: '1.5rem',
            maxWidth: '14ch',
          }}>
            Building across the stack.
          </motion.h2>

          <motion.p {...fadeUp(0.5, reduce)} style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(0.9rem,1.2vw,1.05rem)',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.72)',
            maxWidth: '52ch',
          }}>
            I'm at the start, and I know it. But I'm the kind of person who reads the paper, then builds the thing — and doesn't stop until it makes sense. Curiosity about AI pulled me deep during my studies, and ambition kept me building after: fullstack apps, ML models, low-level systems. I'm creative, I move fast, and I'm ready to do it inside a team.
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
