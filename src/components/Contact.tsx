import { motion } from 'motion/react'

const EASE_BRAND: [number,number,number,number] = [0.77, 0, 0.175, 1]

export function Contact() {
  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: 0.85, ease: EASE_BRAND }}
      style={{ padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}
    >
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '2rem' }}>
        (03) contact
      </p>
      <h2 style={{ fontFamily: "'Barett Street', serif", fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 400, fontStyle: 'italic', marginBottom: '3rem', letterSpacing: '-0.025em' }}>
        Let's build something.
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <a
          href="mailto:ronen0902@gmail.com"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.1rem', color: 'var(--navy)', textDecoration: 'none', borderBottom: '1px solid var(--border)', paddingBottom: '2px' }}
        >
          ronen0902@gmail.com
        </a>
        <a
          href="/ronen-cv.pdf"
          download
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', border: '1px solid var(--navy)', borderRadius: '100px', padding: '0.6rem 1.6rem', color: 'var(--navy)', textDecoration: 'none', transition: 'background 0.2s, color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--navy)' }}
        >
          Download CV
        </a>
      </div>
    </motion.section>
  )
}
