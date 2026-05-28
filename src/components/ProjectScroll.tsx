import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import { ProjectCard } from './ProjectCard'

gsap.registerPlugin(ScrollTrigger)

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

    const ctx = gsap.context(() => {
      const distance = trackRef.current!.scrollWidth - window.innerWidth

      gsap.to(trackRef.current, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      })
    }, wrapRef)

    return () => ctx.revert()
  }, [isMobile])

  if (isMobile) {
    return (
      <section id="projects" style={{ padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '3rem' }}>
          (00) projects
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>
    )
  }

  return (
    <section id="projects" ref={wrapRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Progress bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, height: '2px',
        background: 'var(--navy)', width: `${progress * 100}%`, zIndex: 10,
      }} />

      {/* Eyebrow */}
      <div style={{ position: 'absolute', top: 'clamp(80px,12vw,160px)', left: 'clamp(2rem,8vw,8rem)', zIndex: 5 }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: 'var(--muted)' }}>
          (00) projects
        </p>
      </div>

      {/* Track */}
      <div ref={trackRef} style={{
        display: 'flex', alignItems: 'center', height: '100vh',
        paddingLeft: 'clamp(2rem,8vw,8rem)', paddingRight: '4rem',
        gap: '2rem', willChange: 'transform',
      }}>
        {projects.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  )
}
