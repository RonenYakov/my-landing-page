import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'
import { projects } from '../data/projects'
import { ProjectCard } from './ProjectCard'

gsap.registerPlugin(ScrollTrigger)

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

// ─── Change order here ───────────────────────────────────────────────────────
const ORDER = [
  'seizure-detection',
  'text-classification',
  'stock-trading-agent',
  'social-platform',
  'resnet-fashion',
  'graph-server',
  'wedding-invitation',
  'assembly-project',
  'interactive-interpreter',
]
// ─────────────────────────────────────────────────────────────────────────────

const sorted = ORDER
  .map(id => projects.find(p => p.id === id))
  .filter(Boolean) as typeof projects

export function ProjectScroll() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (isMobile || !wrapRef.current || !trackRef.current) return

    let ctx: ReturnType<typeof gsap.context> | null = null

    const raf = requestAnimationFrame(() => {
      const track = trackRef.current
      const wrap = wrapRef.current
      if (!track || !wrap) return

      const getDistance = () => track.scrollWidth - window.innerWidth

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        })
      }, wrap)
    })

    return () => {
      cancelAnimationFrame(raf)
      ctx?.revert()
    }
  }, [isMobile])

  if (isMobile) {
    return (
      <section id="projects" style={{ padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)' }}>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE_BRAND }}
          style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.6rem' }}
        >
          (00) projects
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: EASE_BRAND, delay: 0.08 }}
          style={{ fontFamily: "'Moderniz', sans-serif", fontSize: 'clamp(1.8rem,6vw,3rem)', fontWeight: 400, letterSpacing: '-0.03em', color: 'var(--navy)', margin: '0 0 2.5rem', lineHeight: 1 }}
        >
          Selected Work
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {sorted.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>
    )
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      <section id="projects" ref={wrapRef} style={{ position: 'relative' }}>
        {/* Progress bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '2px',
          background: 'var(--navy)', width: `${progress * 100}%`, zIndex: 10,
          transition: 'width 0.05s linear',
        }} />

        {/* Eyebrow + heading */}
        <div style={{ position: 'absolute', top: 'clamp(2rem,5vw,4rem)', left: 0, right: 0, zIndex: 5, textAlign: 'center' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 0.6rem' }}>
            (00) projects
          </p>
          <h2 style={{
            fontFamily: "'Moderniz', sans-serif",
            fontSize: 'clamp(1.8rem,3.5vw,3.2rem)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            color: 'var(--navy)',
            margin: 0,
            lineHeight: 1,
          }}>
            Selected Work
          </h2>
        </div>

        {/* Track */}
        <div ref={trackRef} style={{
          display: 'flex',
          alignItems: 'center',
          height: '100vh',
          paddingLeft: 'clamp(2rem,8vw,8rem)',
          paddingRight: '8rem',
          gap: '2rem',
          willChange: 'transform',
        }}>
          {sorted.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>
    </div>
  )
}
