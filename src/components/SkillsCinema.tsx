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

// Mobile band composition: the frame draws as a full-bleed horizontal strip.
// ZOOM > 1 crops the frame's sides (lattice is centered, safe); BAND_TOP is
// the strip's top edge as a fraction of viewport height, just under the text.
const MOBILE_ZOOM = 1.4
const MOBILE_BAND_TOP = 0.34

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

function GroupOverlay({ group, opacity, mobile }: { group: SkillGroup; opacity: number; mobile: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        // desktop: text vertically centered in the wide frame. mobile portrait:
        // text anchored in the upper third, above the contain-fit lattice band.
        justifyContent: mobile ? 'flex-start' : 'center',
        paddingTop: mobile ? '6.5rem' : undefined,
        paddingLeft: mobile ? 'clamp(1.5rem, 5vw, 2rem)' : 'clamp(2rem, 8vw, 8rem)',
        paddingRight: mobile ? 'clamp(1.5rem, 5vw, 2rem)' : undefined,
        opacity,
        transform: `translateY(${(1 - opacity) * 14}px)`,
        pointerEvents: 'none',
        visibility: opacity === 0 ? 'hidden' : 'visible',
      }}
    >
      <h3
        style={{
          fontFamily: "'Moderniz', sans-serif",
          fontSize: mobile ? 'clamp(1.7rem, 7vw, 2.4rem)' : 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 400,
          letterSpacing: '-0.025em',
          color: 'var(--text)',
          margin: mobile ? '0 0 1.1rem' : '0 0 1.4rem',
          lineHeight: 1.05,
        }}
      >
        {group.title}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', maxWidth: mobile ? undefined : 480 }}>
        {group.tags.map((t) => (
          <Tag key={t} label={t} />
        ))}
      </div>
    </div>
  )
}

export function SkillsCinema() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)
  // lazy init: decide the branch (pinned canvas vs static fallback) before the
  // first paint. Flipping branches *after* GSAP has pinned the section crashes
  // React (it reparents the DOM node into a pin-spacer outside React's tree).
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 767px)')
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
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
    // desktop: cover-fit (fill the viewport, crop the 16:9 frame).
    // mobile portrait: full-bleed strip — zoomed past the screen width so it
    // has no left/right edges, anchored just below the skill text, with
    // top/bottom alpha-feathered so the frame's off-white studio background
    // melts into the page instead of reading as a boxed image.
    const scale = isMobile
      ? (cw / img.naturalWidth) * MOBILE_ZOOM
      : Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    const offX = (cw - dw) / 2
    const offY = isMobile ? ch * MOBILE_BAND_TOP : (ch - dh) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, offX, offY, dw, dh)
    if (isMobile) {
      const f = dh * 0.16 // feather depth
      ctx.globalCompositeOperation = 'destination-out'
      let g = ctx.createLinearGradient(0, offY, 0, offY + f)
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, offY - 1, cw, f + 1)
      g = ctx.createLinearGradient(0, offY + dh - f, 0, offY + dh)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(1, 'rgba(0,0,0,1)')
      ctx.fillStyle = g
      ctx.fillRect(0, offY + dh - f, cw, f + 1)
      ctx.globalCompositeOperation = 'source-over'
    }
  }

  // preload frames when the section approaches (1 viewport early)
  useEffect(() => {
    if (reduced || !wrapRef.current) return
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
    if (reduced || !wrapRef.current || !pinRef.current || !canvasRef.current) return
    const wrap = wrapRef.current
    const pinEl = pinRef.current
    const canvas = canvasRef.current

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = pinEl.clientWidth * dpr
      canvas.height = pinEl.clientHeight * dpr
      drawFrame(progressRef.current)
    }
    size()
    window.addEventListener('resize', size, { passive: true })

    let ctx: ReturnType<typeof gsap.context> | null = null
    const raf = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        // trigger on the outer wrapper but pin the inner section, so GSAP's
        // pin-spacer is inserted *inside* wrapRef (a node React owns and never
        // re-commits) instead of among <main>'s React-managed siblings. Pinning
        // the section directly reparents it in <main> and races with motion's
        // whileInView commit in the neighbouring Projects section → insertBefore
        // NotFoundError at mount.
        ScrollTrigger.create({
          trigger: wrap,
          start: 'top top',
          // shorter pin on mobile — thumb-scrolling 2.5 screens feels long
          end: isMobile ? '+=180%' : '+=250%',
          pin: pinEl,
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

  if (reduced) return <SkillsStatic />

  return (
    <div ref={wrapRef}>
      <section id="skills" ref={pinRef} style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
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

        {/* fixed eyebrow — pushed clear of the 56px navbar on mobile */}
        <p
          style={{
            position: 'absolute',
            top: isMobile ? '4.5rem' : 'clamp(2rem, 5vw, 4rem)',
            left: isMobile ? 'clamp(1.5rem, 5vw, 2rem)' : 'clamp(2rem, 8vw, 8rem)',
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
          <GroupOverlay key={g.title} group={g} opacity={groupOpacity(i, progress)} mobile={isMobile} />
        ))}
      </section>
    </div>
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
