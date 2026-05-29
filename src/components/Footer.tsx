import { motion, useReducedMotion } from 'motion/react'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

const FOOTER_ITEMS = [
  { type: 'link' as const, href: 'mailto:ronen0902@gmail.com', label: 'ronen0902@gmail.com' },
  { type: 'link' as const, href: 'https://github.com/RonenYakov', label: 'github', external: true },
  { type: 'link' as const, href: 'https://www.linkedin.com/in/ronen-yakobov-b217211ab/', label: 'linkedin', external: true },
  { type: 'text' as const, label: '+972 054-266-4674' },
]

export function Footer() {
  const reduce = useReducedMotion()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  }
  const item = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_BRAND } },
      }

  return (
    <footer style={{ padding: '2.5rem clamp(1.5rem,5vw,4rem)', borderTop: '1px solid var(--border)' }}>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'var(--muted)' }}
      >
        {FOOTER_ITEMS.map((it) =>
          it.type === 'link' ? (
            <motion.a
              key={it.label}
              variants={item}
              href={it.href}
              {...(it.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              style={{ color: 'var(--muted)', textDecoration: 'none' }}
            >
              {it.label}
            </motion.a>
          ) : (
            <motion.span key={it.label} variants={item}>{it.label}</motion.span>
          )
        )}
      </motion.div>
    </footer>
  )
}
