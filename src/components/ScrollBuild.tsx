import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
 * Frame-by-frame scroll showpiece. The section pins for 2.5 viewports while
 * scroll progress scrubs a particle assembly: dust flies in and resolves,
 * left to right, into the name set in Moderniz. Scrolling back dissolves it.
 * Same navy tones as the hero field.
 */

// #4a6080 → #1a2e4a across the name, matching the hero gradient
const CHAOS_RGB = [74, 96, 128]
const ORDER_RGB = [26, 46, 74]

type Pt = { sx: number; sy: number; tx: number; ty: number; st: number; phase: number; speed: number; swirl: number; fill: string }

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export function ScrollBuild() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    const ctx2d = canvas.getContext('2d')
    if (!ctx2d) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let pts: Pt[] = []
    let W = 0
    let H = 0
    let dotR = 1.8
    let raf = 0
    let running = false
    let disposed = false

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0)

      // rasterize the name offscreen, then sample dark pixels as particle targets
      const off = document.createElement('canvas')
      const octx = off.getContext('2d')!
      const font = "900 220px Moderniz, 'DM Sans', sans-serif"
      octx.font = font
      const text = 'RONEN'
      const textW = octx.measureText(text).width
      off.width = Math.ceil(textW) + 40
      off.height = 300
      octx.font = font
      octx.textBaseline = 'middle'
      octx.fillStyle = '#000'
      octx.fillText(text, 20, 160)
      const img = octx.getImageData(0, 0, off.width, off.height).data

      const scale = Math.min(W * 0.82, 980) / textW
      dotR = Math.max(1.3, 2.1 * scale)
      const step = W < 768 ? 6 : 5
      const cx = W / 2
      const cy = H / 2

      pts = []
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (img[(y * off.width + x) * 4 + 3] < 128) continue
          const u = x / off.width
          const r = CHAOS_RGB[0] + (ORDER_RGB[0] - CHAOS_RGB[0]) * u
          const g = CHAOS_RGB[1] + (ORDER_RGB[1] - CHAOS_RGB[1]) * u
          const b = CHAOS_RGB[2] + (ORDER_RGB[2] - CHAOS_RGB[2]) * u
          pts.push({
            tx: cx + (x - off.width / 2) * scale,
            ty: cy + (y - 160) * scale,
            sx: Math.random() * W,
            sy: Math.random() * H * 1.2 - H * 0.1,
            // letters resolve as a left-to-right wave, roughened per particle
            st: u * 0.7 + Math.random() * 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random(),
            swirl: (Math.random() - 0.5) * 90,
            fill: `rgb(${r | 0},${g | 0},${b | 0})`,
          })
        }
      }
    }

    const draw = (t: number) => {
      const p = reduced ? 1 : progressRef.current
      ctx2d.clearRect(0, 0, W, H)
      for (const pt of pts) {
        const lp = clamp01((p * 1.25 - 0.08 - pt.st * 0.3) / 0.6)
        const e = lp * lp * (3 - 2 * lp)
        const wob = reduced ? 0 : (1 - e) * 10 + 0.7
        const x = pt.sx + (pt.tx - pt.sx) * e + Math.sin((t / 1000) * pt.speed + pt.phase) * wob
        const y = pt.sy + (pt.ty - pt.sy) * e
          + Math.sin(e * Math.PI) * pt.swirl // curved flight path
          + Math.cos((t / 1000) * pt.speed * 0.8 + pt.phase) * wob
        ctx2d.globalAlpha = 0.15 + e * 0.75
        ctx2d.fillStyle = pt.fill
        ctx2d.beginPath()
        ctx2d.arc(x, y, dotR, 0, Math.PI * 2)
        ctx2d.fill()
      }
    }

    const tick = (t: number) => {
      draw(t)
      if (running) raf = requestAnimationFrame(tick)
    }

    let gctx: ReturnType<typeof gsap.context> | null = null
    let io: IntersectionObserver | null = null

    const init = () => {
      if (disposed) return
      build()
      draw(performance.now())
      if (reduced) return

      gctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: true,
          onUpdate: (self) => { progressRef.current = self.progress },
        })
      }, section)

      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!running) {
              running = true
              raf = requestAnimationFrame(tick)
            }
          } else {
            running = false
            cancelAnimationFrame(raf)
          }
        },
        { threshold: 0 }
      )
      io.observe(section)
    }

    // Moderniz must be loaded before rasterizing, or the sample uses the fallback
    let initialized = false
    const initOnce = () => {
      if (initialized) return
      initialized = true
      init()
    }
    if (document.fonts?.load) {
      document.fonts.load('900 220px Moderniz').then(initOnce, initOnce)
      window.setTimeout(initOnce, 1200)
    } else {
      initOnce()
    }

    const onResize = () => {
      if (!initialized) return
      build()
      draw(performance.now())
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      running = false
      cancelAnimationFrame(raf)
      io?.disconnect()
      gctx?.revert()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Ronen"
      style={{
        position: 'relative',
        height: '100vh',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </section>
  )
}
