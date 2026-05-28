import { motion } from 'motion/react'

const EASE_BRAND: [number,number,number,number] = [0.77, 0, 0.175, 1]

const languages = ['Python', 'TypeScript', 'JavaScript', 'C', 'SQL', 'HTML', 'CSS']
const frameworks = ['React', 'Node.js', 'PyTorch', 'scikit-learn', 'Express', 'Tailwind']
const tools = ['Git', 'Docker', 'PostgreSQL', 'Vite', 'Linux', 'REST APIs']
const ai = ['Neural Networks', 'CNNs', 'Transfer Learning', 'Data Preprocessing', 'Model Evaluation']

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        border: '1px solid var(--border)',
        borderRadius: '100px',
        padding: '0.35rem 0.85rem',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.85rem',
        color: 'var(--text)',
        cursor: 'default',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--navy)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {label}
    </span>
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
      style={{ padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)' }}
    >
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '3rem' }}>
        (02) skills
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', maxWidth: '900px' }}>
        <div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            Languages & Frameworks
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[...languages, ...frameworks].map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
        <div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            Tools & AI Workflow
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[...tools, ...ai].map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
