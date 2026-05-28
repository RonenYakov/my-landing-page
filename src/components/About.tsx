import { motion } from 'motion/react'

const EASE_BRAND: [number,number,number,number] = [0.77, 0, 0.175, 1]

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
        <h2 style={{ fontFamily: "'Barett Street', serif", fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.2, marginBottom: '2rem', letterSpacing: '-0.025em' }}>
          Building across the stack.
        </h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', lineHeight: 1.8, color: 'var(--text)', maxWidth: '56ch' }}>
          I'm a CS graduate who builds across the full stack and deep learning. I care about clean systems, real problems, and work that ships.
        </p>
      </div>
    </motion.section>
  )
}
