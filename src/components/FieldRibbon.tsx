import { useEffect, useRef } from 'react'

/*
 * Section divider carrying the hero motif across the page: a strip of
 * particles that assembles from noise into an ordered dotted line when it
 * scrolls into view. Plain 2D canvas — no WebGL context needed at this scale.
 */

// #4a6080 → #1a2e4a, matching the hero's chaos → order tones
const CHAOS_RGB = [74, 96, 128]
const ORDER_RGB = [26, 46, 74]

type Dot = { sx: number; sy: number; ox: number; oy: number; phase: number; speed: number; fill: string }

export function FieldRibbon() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let running = false
    let progress = reduced ? 1 : 0
    let assembling = false
    let dots: Dot[] = []
    let W = 0
    let H = 0

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(60, Math.floor(W / 7))
      dots = Array.from({ length: count }, (_, i) => {
        const u = (i + 0.5) / count
        const r = CHAOS_RGB[0] + (ORDER_RGB[0] - CHAOS_RGB[0]) * u
        const g = CHAOS_RGB[1] + (ORDER_RGB[1] - CHAOS_RGB[1]) * u
        const b = CHAOS_RGB[2] + (ORDER_RGB[2] - CHAOS_RGB[2]) * u
        return {
          ox: u * W,
          oy: H / 2 + (i % 2 === 0 ? -2 : 2),
          sx: u * W + (Math.random() - 0.5) * 140,
          sy: H / 2 + (Math.random() - 0.5) * H * 0.9,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random(),
          fill: `rgb(${r | 0},${g | 0},${b | 0})`,
        }
      })
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H)
      const e = 1 - Math.pow(1 - progress, 3)
      for (const d of dots) {
        const wob = reduced ? 0 : Math.sin((t / 1000) * d.speed + d.phase) * (1.5 + (1 - e) * 6)
        const x = d.sx + (d.ox - d.sx) * e
        const y = d.sy + (d.oy - d.sy) * e + wob
        ctx.globalAlpha = 0.3 + e * 0.55
        ctx.fillStyle = d.fill
        ctx.beginPath()
        ctx.arc(x, y, 1.7, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = (t: number) => {
      if (assembling && progress < 1) progress = Math.min(1, progress + 1 / (1.4 * 60))
      draw(t)
      if (running) raf = requestAnimationFrame(tick)
    }

    build()
    draw(performance.now())

    const onResize = () => {
      build()
      draw(performance.now())
    }
    window.addEventListener('resize', onResize)

    let io: IntersectionObserver | null = null
    if (!reduced) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            assembling = true
            if (!running) {
              running = true
              raf = requestAnimationFrame(tick)
            }
          } else {
            running = false
            cancelAnimationFrame(raf)
          }
        },
        { threshold: 0.15 }
      )
      io.observe(canvas)
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io?.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div aria-hidden style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: 90 }}
      />
    </div>
  )
}
