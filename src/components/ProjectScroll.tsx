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
  'social-platform',
  'wedding-invitation',
  'text-classification',
  'stock-trading-agent',
  'seizure-detection',
  'resnet-fashion',
  'graph-server',



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
      <MobileProjects />
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
            color: 'var(--text)',
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

function MobileProjects() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth)
      setActive(Math.min(sorted.length - 1, Math.max(0, idx)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="projects" style={{ padding: 'clamp(64px,12vw,120px) 0', overflow: 'hidden' }}>
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE_BRAND }}
          style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 0.6rem' }}
        >
          (00) projects
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: EASE_BRAND, delay: 0.06 }}
          style={{ fontFamily: "'Moderniz', sans-serif", fontSize: 'clamp(1.7rem,7vw,2.6rem)', fontWeight: 400, letterSpacing: '-0.03em', color: 'var(--text)', margin: 0, lineHeight: 1 }}
        >
          Selected Work
        </motion.h2>
      </div>

      <div
        ref={scrollerRef}
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          padding: '0 1.5rem 1rem',
          scrollbarWidth: 'none',
        }}
      >
        <style>{`#projects ::-webkit-scrollbar{display:none}`}</style>
        {sorted.map(p => (
          <div
            key={p.id}
            style={{
              flex: '0 0 86%',
              scrollSnapAlign: 'center',
            }}
          >
            <ProjectCard project={p} />
          </div>
        ))}
        <div style={{ flex: '0 0 7%' }} />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '1.25rem',
        padding: '0 1.5rem',
      }}>
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.14em',
          color: 'var(--muted)',
          minWidth: 44,
          textAlign: 'right',
        }}>
          {String(active + 1).padStart(2, '0')} / {String(sorted.length).padStart(2, '0')}
        </span>
        <div style={{ flex: 1, maxWidth: 140, height: 1, background: 'var(--border)', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${((active + 1) / sorted.length) * 100}%`,
            background: 'var(--navy)',
            transition: 'width 0.25s ease',
          }} />
        </div>
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>
          swipe →
        </span>
      </div>
    </section>
  )
}
