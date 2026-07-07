import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 81
const framePath = (i: number) => `/cinema/frame_${String(i + 1).padStart(3, '0')}.webp`

type SkillGroup = { title: string; tags: string[] }

const GROUPS: SkillGroup[] = [
  {
    title: 'AI / ML',
    tags: ['Neural Networks', 'CNNs', 'PyTorch', 'scikit-learn', 'Transfer Learning', 'Model Evaluation'],
  },
  {
    title: 'Full Stack',
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'SQL / PostgreSQL', 'Tailwind', 'REST APIs'],
  },
  {
    title: 'Data & Tooling',
    tags: ['Python', 'Data Preprocessing', 'Git', 'Docker', 'Vite'],
  },
]

const FADE = 0.06 // fraction of scrub used for each group's fade in/out

// opacity of group i at progress p; groups own equal thirds, last group holds at the end
function groupOpacity(i: number, p: number): number {
  const start = i / GROUPS.length
  const end = (i + 1) / GROUPS.length
  const fadeIn = i === 0 ? 1 : (p - start) / FADE
  const fadeOut = i === GROUPS.length - 1 ? 1 : (end - p) / FADE
  return Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)))
}

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.62rem',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        borderRadius: 100,
        padding: '0.22rem 0.6rem',
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        background: 'rgba(255,255,255,0.7)',
      }}
    >
      {label}
    </span>
  )
}

function GroupOverlay({ group, opacity }: { group: SkillGroup; opacity: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 'clamp(2rem, 8vw, 8rem)',
        opacity,
        transform: `translateY(${(1 - opacity) * 14}px)`,
        pointerEvents: 'none',
        visibility: opacity === 0 ? 'hidden' : 'visible',
      }}
    >
      <h3
        style={{
          fontFamily: "'Moderniz', sans-serif",
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 400,
          letterSpacing: '-0.025em',
          color: 'var(--text)',
          margin: '0 0 1.4rem',
          lineHeight: 1.05,
        }}
      >
        {group.title}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', maxWidth: 480 }}>
        {group.tags.map((t) => (
          <Tag key={t} label={t} />
        ))}
      </div>
    </div>
  )
}

export function SkillsCinema() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 767px)')
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsMobile(mqMobile.matches)
    setReduced(mqReduced.matches)
    const onMobile = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    const onReduced = (e: MediaQueryListEvent) => setReduced(e.matches)
    mqMobile.addEventListener('change', onMobile)
    mqReduced.addEventListener('change', onReduced)
    return () => {
      mqMobile.removeEventListener('change', onMobile)
      mqReduced.removeEventListener('change', onReduced)
    }
  }, [])

  const drawFrame = (p: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // nearest loaded frame at or below the target, so gaps never flash white
    let idx = Math.min(FRAME_COUNT - 1, Math.floor(p * FRAME_COUNT))
    while (idx > 0 && !imagesRef.current[idx]?.complete) idx--
    const img = imagesRef.current[idx]
    if (!img || !img.complete || img.naturalWidth === 0) return
    const cw = canvas.width
    const ch = canvas.height
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
  }

  // preload frames when the section approaches (1 viewport early)
  useEffect(() => {
    if (isMobile || reduced || !wrapRef.current) return
    const el = wrapRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()
        for (let i = 0; i < FRAME_COUNT; i++) {
          const img = new Image()
          img.src = framePath(i)
          img.onload = () => {
            if (i === 0 || Math.floor(progressRef.current * FRAME_COUNT) === i) {
              drawFrame(progressRef.current)
            }
          }
          imagesRef.current[i] = img
        }
      },
      { rootMargin: '100% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isMobile, reduced])

  // canvas sizing + pin/scrub
  useEffect(() => {
    if (isMobile || reduced || !wrapRef.current || !canvasRef.current) return
    const wrap = wrapRef.current
    const canvas = canvasRef.current

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = wrap.clientWidth * dpr
      canvas.height = wrap.clientHeight * dpr
      drawFrame(progressRef.current)
    }
    size()
    window.addEventListener('resize', size, { passive: true })

    let ctx: ReturnType<typeof gsap.context> | null = null
    const raf = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: wrap,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress
            drawFrame(self.progress)
            setProgress(self.progress)
          },
        })
      }, wrap)
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
      ctx?.revert()
    }
  }, [isMobile, reduced])

  if (isMobile || reduced) return <SkillsStatic />

  return (
    <section id="skills" ref={wrapRef} style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* progress line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 2,
          background: 'var(--navy)',
          width: `${progress * 100}%`,
          zIndex: 10,
          transition: 'width 0.05s linear',
        }}
      />

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden />

      {/* fixed eyebrow */}
      <p
        style={{
          position: 'absolute',
          top: 'clamp(2rem, 5vw, 4rem)',
          left: 'clamp(2rem, 8vw, 8rem)',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.72rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          margin: 0,
          zIndex: 5,
        }}
      >
        (02) skills
      </p>

      {GROUPS.map((g, i) => (
        <GroupOverlay key={g.title} group={g} opacity={groupOpacity(i, progress)} />
      ))}
    </section>
  )
}

// static fallback: mobile and prefers-reduced-motion
function SkillsStatic() {
  return (
    <section id="skills" style={{ padding: 'clamp(80px,12vw,160px) clamp(1.5rem,5vw,4rem)', maxWidth: 820, margin: '0 auto' }}>
      <p
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.72rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          margin: '0 0 2.5rem',
        }}
      >
        (02) skills
      </p>
      <img
        src={framePath(FRAME_COUNT - 1)}
        alt=""
        aria-hidden
        style={{ width: '100%', height: 'auto', display: 'block', marginBottom: '3rem' }}
      />
      {GROUPS.map((g) => (
        <div key={g.title} style={{ marginBottom: '2.5rem' }}>
          <h3
            style={{
              fontFamily: "'Moderniz', sans-serif",
              fontSize: 'clamp(1.7rem, 6vw, 2.4rem)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 1rem',
              lineHeight: 1.05,
            }}
          >
            {g.title}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {g.tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
