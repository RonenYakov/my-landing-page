import { useRef, useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useSpring, useTransform } from 'motion/react'

export function SplitHero() {
  const MONO_FONT = "'IBM Plex Mono', monospace"
  const BODY_FONT = "'DM Sans', sans-serif"
  const LABEL_FONT = "'Moderniz', sans-serif"

  const containerRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)

  const rawX = useMotionValue(50)
  const springX = useSpring(rawX, { stiffness: 60, damping: 18 })
  // No clamping — let mouse extremes fully commit to one side
  const mouseX = useTransform(springX, (v) => Math.max(0, Math.min(100, v)))

  // Wipe line position inside the laptop screen
  // mouseX 0 (left) → divider at 100% (AI fully covers screen)
  // mouseX 100 (right) → divider at 0% (FS fully covers screen)
  const screenSplitLeftPct = useTransform(mouseX, [0, 100], ['100%', '0%'])
  // AI image clipped from the right. At mouseX=0 inset right = 0 (full image). At mouseX=100 inset right = 100% (hidden).
  const aiClip = useTransform(mouseX, (v) => `inset(0 ${v}% 0 0)`)
  // Hide divider when fully committed to one side
  const dividerOpacity = useTransform(mouseX, (v) => {
    if (v < 3 || v > 97) return 0
    return 1
  })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mobile-only: auto-cycle between AI and FS using the same wipe driver
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 767px)')
    if (!mq.matches) return
    let cancelled = false
    let controls: ReturnType<typeof animate> | null = null
    const cycle = (to: number) => {
      if (cancelled) return
      controls = animate(rawX, to, {
        duration: 1.6,
        ease: [0.77, 0, 0.175, 1],
        onComplete: () => {
          if (cancelled) return
          window.setTimeout(() => cycle(to === 100 ? 0 : 100), 1400)
        },
      })
    }
    rawX.set(0)
    const start = window.setTimeout(() => cycle(100), 900)
    return () => {
      cancelled = true
      window.clearTimeout(start)
      controls?.stop()
    }
  }, [rawX])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set(((e.clientX - rect.left) / rect.width) * 100)
  }

  const handleMouseLeave = () => rawX.set(50)

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        background: 'var(--bg)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Faint code cluster (bottom-left, like reference) ── */}
      <div
        className="hidden md:flex"
        aria-hidden
        style={{
          position: 'absolute', bottom: '7%', left: 'clamp(2rem, 5vw, 4rem)',
          zIndex: 0, flexDirection: 'column', gap: '0.1em',
          pointerEvents: 'none', userSelect: 'none',
        }}
      >
        {([
          ['<html>', '2.4rem'],
          ['height:184px;}', '1.5rem'],
          ['class="jedi">', '1.9rem'],
          ['CSS3   HTML5', '2.2rem'],
          ['color:#000;', '2.6rem'],
          ['jQuery', '1.6rem'],
        ] as const).map(([text, size], i) => (
          <span
            key={i}
            style={{
              fontFamily: MONO_FONT, fontSize: size, fontWeight: 500,
              letterSpacing: '-0.02em', color: '#000', opacity: 0.07,
              whiteSpace: 'nowrap', lineHeight: 1.15,
            }}
          >
            {text}
          </span>
        ))}
      </div>

      {/* ── Side headers: black, on top of the laptop edges ── */}
      <div
        className="hidden md:flex"
        aria-hidden
        style={{
          position: 'absolute', left: 'clamp(2rem, 5vw, 5rem)', top: '50%',
          transform: 'translateY(-50%)', zIndex: 6,
          flexDirection: 'column', alignItems: 'flex-start',
          lineHeight: 0.85, pointerEvents: 'none',
        }}
      >
        {['ai', 'native'].map((w) => (
          <span key={w} style={{
            fontFamily: LABEL_FONT,
            fontSize: 'clamp(2.2rem, 5.5vw, 4.6rem)',
            letterSpacing: '-0.04em',
            color: '#111',
          }}>
            {w}
          </span>
        ))}
      </div>
      <div
        className="hidden md:flex"
        aria-hidden
        style={{
          position: 'absolute', right: 'clamp(2rem, 5vw, 5rem)', top: '50%',
          transform: 'translateY(-50%)', zIndex: 6,
          flexDirection: 'column', alignItems: 'flex-end',
          lineHeight: 0.85, textAlign: 'right', pointerEvents: 'none',
        }}
      >
        {['<full', 'stack>'].map((w) => (
          <span key={w} style={{
            fontFamily: LABEL_FONT,
            fontSize: 'clamp(2.2rem, 5.5vw, 4.6rem)',
            letterSpacing: '-0.04em',
            color: '#111',
          }}>
            {w}
          </span>
        ))}
      </div>

      {/* ── Mobile: labels + compact laptop centerpiece ── */}
      <div
        className="flex md:hidden"
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '0 1.25rem',
          zIndex: 2,
          textAlign: 'center',
          gap: '1.6rem',
        }}
      >
        <span style={{
          fontFamily: LABEL_FONT, fontSize: 'clamp(1.8rem, 9vw, 2.8rem)',
          letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1,
        }}>
          ai native
        </span>

        {/* Mini laptop with auto-cycling AI/FS wipe */}
        <div style={{ position: 'relative', width: 'min(86vw, 380px)' }}>
          <div style={{
            position: 'relative',
            background: 'linear-gradient(160deg, #2c2c2e 0%, #161617 58%, #0d0d0e 100%)',
            borderRadius: '14px 14px 4px 4px',
            padding: '7px 7px 9px',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 1.5px 0 rgba(255,255,255,0.16), 0 24px 50px -16px hsl(217 50% 12% / 0.45), 0 8px 20px -8px hsl(217 50% 12% / 0.35)',
          }}>
            <div style={{
              width: '4px', height: '4px',
              background: 'radial-gradient(circle at 35% 30%, #303033 0%, #050506 80%)',
              borderRadius: '50%',
              margin: '0 auto 4px',
            }} />
            <div style={{
              position: 'relative', width: '100%', aspectRatio: '16 / 10',
              borderRadius: '4px', overflow: 'hidden', background: '#000',
            }}>
              <img
                src="/hero/fs-screen-v3.png"
                alt="Full-stack work"
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'right center',
                  display: 'block',
                }}
              />
              <motion.img
                src="/hero/ai-screen-v3.png"
                alt="AI work"
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'left center',
                  clipPath: aiClip,
                  zIndex: 1,
                  display: 'block',
                }}
              />
              <motion.div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: screenSplitLeftPct,
                width: '2px',
                background: 'rgba(255,255,255,0.85)',
                boxShadow: '0 0 8px rgba(0,0,0,0.35)',
                zIndex: 3,
                pointerEvents: 'none',
                opacity: dividerOpacity,
              }} />
              <div style={{
                position: 'absolute', inset: 0, zIndex: 5,
                background: 'linear-gradient(120deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 38%)',
                pointerEvents: 'none',
              }} />
            </div>
          </div>
          <div style={{
            width: '104%', marginLeft: '-2%',
            height: '10px',
            background: 'linear-gradient(180deg, #c9cacc 0%, #9a9b9d 55%, #7c7d7f 100%)',
            borderRadius: '3px 3px 9px 9px',
            boxShadow: '0 10px 22px -6px hsl(217 50% 12% / 0.35)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          }}>
            <div style={{
              width: '14%', height: '3px',
              background: 'linear-gradient(180deg, #6d6e70, #8a8b8d)',
              borderRadius: '0 0 4px 4px',
            }} />
          </div>
        </div>

        <span style={{
          fontFamily: LABEL_FONT, fontSize: 'clamp(1.8rem, 9vw, 2.8rem)',
          letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1,
        }}>
          {'<full stack>'}
        </span>
      </div>

      {/* ── Laptop (centerpiece) ── */}
      <div
        className="hidden md:block"
        style={{
          position: 'relative',
          zIndex: 5,
          width: 'clamp(420px, 46vw, 720px)',
        }}
      >
        {/* Lid */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(160deg, #2c2c2e 0%, #161617 58%, #0d0d0e 100%)',
          borderRadius: '20px 20px 5px 5px',
          padding: 'clamp(7px, 0.85vw, 11px) clamp(7px, 0.85vw, 11px) clamp(10px, 1.1vw, 15px)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 1.5px 0 rgba(255,255,255,0.16), 0 50px 110px -28px hsl(217 50% 12% / 0.55), 0 14px 34px -12px hsl(217 50% 12% / 0.4)',
        }}>
          {/* Camera */}
          <div style={{
            width: '5px', height: '5px',
            background: 'radial-gradient(circle at 35% 30%, #303033 0%, #050506 80%)',
            borderRadius: '50%',
            margin: '0 auto 5px',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
          }} />

          {/* Screen */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 10',
            borderRadius: '5px',
            overflow: 'hidden',
            background: '#000',
          }}>
            {/* FS screen (base, anchored right) */}
            <img
              src="/hero/fs-screen-v3.png"
              alt="Full-stack work — React + TypeScript editor"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'right center',
                display: 'block',
              }}
            />
            {/* AI screen (top, clipped from the right, anchored left) */}
            <motion.img
              src="/hero/ai-screen-v3.png"
              alt="AI work — PyTorch training IDE"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'left center',
                clipPath: aiClip,
                zIndex: 1,
                display: 'block',
              }}
            />

            {/* Wipe divider */}
            <motion.div style={{
              position: 'absolute', top: 0, bottom: 0,
              left: screenSplitLeftPct,
              width: '2px',
              background: 'rgba(255,255,255,0.85)',
              boxShadow: '0 0 8px rgba(0,0,0,0.35)',
              zIndex: 3,
              pointerEvents: 'none',
              opacity: dividerOpacity,
            }} />

            {/* Glare */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 5,
              background: 'linear-gradient(120deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 38%)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Hinge + keyboard deck */}
        <div style={{
          width: '104%',
          marginLeft: '-2%',
          height: 'clamp(12px, 1.6vw, 20px)',
          background: 'linear-gradient(180deg, #c9cacc 0%, #9a9b9d 55%, #7c7d7f 100%)',
          borderRadius: '4px 4px 11px 11px',
          boxShadow: '0 14px 30px -8px hsl(217 50% 12% / 0.4)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        }}>
          <div style={{
            width: '14%', height: 'clamp(3px, 0.5vw, 6px)',
            background: 'linear-gradient(180deg, #6d6e70, #8a8b8d)',
            borderRadius: '0 0 5px 5px',
          }} />
        </div>

        {/* Ground shadow */}
        <div style={{
          width: '60%', height: '22px',
          margin: '6px auto 0',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(4px)',
        }} />
      </div>

      {/* ── Scroll cue ── */}
      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          zIndex: 6,
          fontFamily: BODY_FONT,
          fontSize: '0.85rem',
          color: 'var(--muted)',
          letterSpacing: '0.05em',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        ↓
      </motion.div>
    </section>
  )
}
