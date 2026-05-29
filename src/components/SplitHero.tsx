import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

export function SplitHero() {
  const MONO_FONT = "'IBM Plex Mono', monospace"
  const BODY_FONT = "'DM Sans', sans-serif"
  const LABEL_FONT = "'Moderniz', sans-serif"

  const containerRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)

  const rawX = useMotionValue(50)
  const springX = useSpring(rawX, { stiffness: 60, damping: 18 })
  const clampedX = useTransform(springX, (v) => Math.max(20, Math.min(80, v)))
  // bgSplitPct: inverted so mouse LEFT expands AI (dark) side
  const bgSplitPct = useTransform(clampedX, (v) => `${100 - v}%`)
  // screenSplitLeftPct: laptop AI-half width — mouse LEFT = wider AI half (used in Tasks 4 & 5)
  const screenSplitLeftPct = useTransform(clampedX, [20, 80], ['70%', '30%'])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        background: 'var(--bg)',   // mobile fallback
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* ── Split backgrounds (desktop only) ── */}
      <motion.div
        className="hidden md:block"
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: bgSplitPct,
          background: '#0d1117',
          zIndex: 0,
        }}
      />
      {/* right bg — full coverage behind dark div */}
      <motion.div
        className="hidden md:block"
        style={{
          position: 'absolute', inset: 0,
          background: 'var(--bg)',
          zIndex: -1,
        }}
      />

      {/* ── Visual divider line ── */}
      <motion.div
        className="hidden md:block"
        style={{
          position: 'absolute', left: bgSplitPct, top: 0, bottom: 0,
          width: '1px',
          background: 'rgba(150,150,150,0.25)',
          zIndex: 6,
          pointerEvents: 'none',
        }}
      />

      {/* ── AI snippets (left) ── */}
      <div
        className="hidden md:block"
        style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}
      >
        <div style={{
          position: 'absolute', top: '12%', left: '3%',
          background: 'rgba(22,27,34,0.92)', border: '1px solid #30363d',
          borderRadius: '6px', padding: '4px 10px',
          fontFamily: MONO_FONT, fontSize: '0.65rem', color: '#c9d1d9',
        }}>
          <span style={{ color: '#3fb950' }}>loss:</span> 0.0423
        </div>
        <div style={{
          position: 'absolute', top: '35%', left: '2%',
          background: 'rgba(22,27,34,0.92)', border: '1px solid #30363d',
          borderRadius: '6px', padding: '4px 10px',
          fontFamily: MONO_FONT, fontSize: '0.62rem', color: '#c9d1d9',
        }}>
          <span style={{ color: '#58a6ff' }}>model</span> = <span style={{ color: '#e3b341' }}>SNN</span>(64)
        </div>
        <div style={{
          position: 'absolute', top: '55%', left: '4%',
          fontFamily: MONO_FONT, fontSize: '0.62rem', color: '#3fb950', opacity: 0.8,
        }}>
          accuracy: 94.2%
        </div>
        <div style={{
          position: 'absolute', top: '72%', left: '3%',
          fontFamily: MONO_FONT, fontSize: '0.58rem', color: 'rgba(136,136,136,0.55)',
        }}>
          PyTorch · NumPy · sklearn
        </div>
        <div style={{
          position: 'absolute', bottom: '14%', left: '5%',
          background: 'rgba(22,27,34,0.92)', border: '1px solid #30363d',
          borderRadius: '6px', padding: '4px 10px',
          fontFamily: MONO_FONT, fontSize: '0.6rem', color: '#c9d1d9',
        }}>
          <span style={{ color: '#bc8cff' }}>epoch</span> 47/100{' '}
          <span style={{ color: '#e3b341' }}>████░░</span>
        </div>
      </div>

      {/* ── FS snippets (right) ── */}
      <div
        className="hidden md:block"
        style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}
      >
        <div style={{
          position: 'absolute', top: '14%', right: '3%',
          fontFamily: MONO_FONT, fontSize: '0.62rem', color: 'rgba(26,46,74,0.55)',
        }}>
          const [data, setData]
        </div>
        <div style={{
          position: 'absolute', top: '38%', right: '2%',
          background: 'rgba(244,244,244,0.95)', border: '1px solid #e8e8e8',
          borderRadius: '6px', padding: '4px 10px',
          fontFamily: MONO_FONT, fontSize: '0.62rem', color: '#1a2e4a',
        }}>
          npm run build <span style={{ color: '#27ae60' }}>✓</span>
        </div>
        <div style={{
          position: 'absolute', top: '58%', right: '4%',
          fontFamily: MONO_FONT, fontSize: '0.6rem', color: 'rgba(136,136,136,0.55)',
        }}>
          border-radius: 12px
        </div>
        <div style={{
          position: 'absolute', bottom: '14%', right: '3%',
          fontFamily: MONO_FONT, fontSize: '0.58rem', color: 'rgba(136,136,136,0.45)',
        }}>
          React · TypeScript · SQL
        </div>
      </div>

      {/* ── Mobile: stacked labels ── */}
      <div
        className="flex md:hidden"
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '0 2rem',
          zIndex: 2,
          textAlign: 'center',
          gap: '1.5rem',
        }}
      >
        <span style={{
          fontFamily: LABEL_FONT,
          fontSize: 'clamp(2rem, 8vw, 3rem)',
          letterSpacing: '-0.03em',
          color: 'var(--text)',
          lineHeight: 1,
        }}>
          deep learning
        </span>
        <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
        <span style={{
          fontFamily: LABEL_FONT,
          fontSize: 'clamp(2rem, 8vw, 3rem)',
          letterSpacing: '-0.03em',
          color: 'var(--text)',
          lineHeight: 1,
        }}>
          {'<full stack>'}
        </span>
      </div>

      {/* ── Laptop ── */}
      <div
        className="hidden md:block"
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 7,
          width: 'clamp(260px, 28vw, 380px)',
        }}
      >
        {/* Screen lid */}
        <div style={{
          background: '#1c1c1e',
          borderRadius: '10px 10px 3px 3px',
          padding: '8px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        }}>
          {/* Notch */}
          <div style={{
            width: '10px', height: '10px',
            background: '#2a2a2e', borderRadius: '50%',
            margin: '0 auto 6px',
          }} />

          {/* Screen */}
          <div style={{
            display: 'flex',
            height: 'clamp(150px, 16vw, 210px)',
            borderRadius: '5px',
            overflow: 'hidden',
          }}>

            {/* ── AI half ── */}
            <motion.div style={{
              width: screenSplitLeftPct,
              background: '#0d1117',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              {/* Confusion matrix label */}
              <div style={{
                fontFamily: MONO_FONT, fontSize: '5.5px',
                color: '#3fb950', paddingBottom: '2px',
              }}>
                ● Confusion Matrix — FashionMNIST
              </div>

              {/* 5×5 grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '1.5px',
                flex: 1.2,
              }}>
                {[
                  '#1e4a8a','#0a1830','#1a3a70','#0a1830','#2060a0',
                  '#0a1830','#1e4a8a','#0a1830','#2868b0','#0a1830',
                  '#2060a0','#0a1830','#1e4a8a','#0a1830','#0a1830',
                  '#0a1830','#2060a0','#0a1830','#1e4a8a','#2060a0',
                  '#0a1830','#0a1830','#2868b0','#0a1830','#1e4a8a',
                ].map((bg, i) => (
                  <div key={i} style={{ background: bg, borderRadius: '1px' }} />
                ))}
              </div>

              {/* Classification report block */}
              <div style={{
                background: '#161b22',
                borderRadius: '3px',
                padding: '4px 5px',
              }}>
                <div style={{
                  fontFamily: MONO_FONT, fontSize: '5px',
                  color: '#888', marginBottom: '2px',
                }}>
                  Classification Report
                </div>
                {([
                  ['precision', '0.88'],
                  ['recall',    '0.87'],
                  ['f1-score',  '0.87'],
                ] as const).map(([label, val]) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontFamily: MONO_FONT, fontSize: '5px',
                  }}>
                    <span style={{ color: '#58a6ff' }}>{label}</span>
                    <span style={{ color: '#3fb950' }}>{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Internal screen divider ── */}
            <div style={{
              width: '1px',
              background: 'rgba(100,100,100,0.4)',
              flexShrink: 0,
              zIndex: 2,
              pointerEvents: 'none',
            }} />

            {/* ── FS half ── */}
            <div style={{
              flex: 1,
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              {/* Mini nav */}
              <div style={{
                background: '#111',
                padding: '3px 7px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: BODY_FONT, fontSize: '5px', color: '#fff', fontWeight: 700 }}>RY</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['about', 'projects', 'skills'].map((l) => (
                    <span key={l} style={{ fontFamily: BODY_FONT, fontSize: '4px', color: '#888' }}>{l}</span>
                  ))}
                </div>
              </div>

              {/* Social platform hero area */}
              <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #f5f0eb 0%, #ece6df 100%)',
                padding: '10px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                gap: '3px',
                overflow: 'hidden',
              }}>
                <div style={{ fontFamily: MONO_FONT, fontSize: '4.5px', color: '#c07a50', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  EVENTS · SOCIAL · MEDIA
                </div>
                <div style={{ fontFamily: BODY_FONT, fontSize: '14px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.1 }}>
                  Creating<br />presence.
                </div>
                <div style={{ fontFamily: BODY_FONT, fontSize: '5px', color: '#888' }}>
                  Social media management
                </div>
                <div style={{
                  background: '#c07a50', color: '#fff',
                  borderRadius: '10px', padding: '2px 6px',
                  fontSize: '4px', fontFamily: BODY_FONT,
                  width: 'fit-content', marginTop: '3px',
                }}>
                  Let's create buzz →
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard base */}
        <div style={{
          background: '#222',
          height: '12px',
          borderRadius: '0 0 8px 8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: '1px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          <div style={{ width: '50px', height: '7px', background: '#1a1a1a', borderRadius: '3px' }} />
        </div>
      </div>

      {/* ── Left side ── */}
      <div
        className="hidden md:flex"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '38%',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 'clamp(2.5rem, 6vw, 6rem)',
          paddingRight: '2rem',
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "'Moderniz', sans-serif",
            fontSize: 'clamp(2.2rem, 4.5vw, 5rem)',
            letterSpacing: '-0.03em',
            color: '#ffffff',
            lineHeight: 1,
            display: 'block',
            marginBottom: '1rem',
          }}
        >
          deep learning
        </span>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.6,
            maxWidth: '22ch',
            margin: 0,
          }}
        >
          Building AI systems that solve real clinical problems — from seizure detection to text classification.
        </p>
      </div>

      {/* ── Right side ── */}
      <div
        className="hidden md:flex"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '38%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingRight: 'clamp(2.5rem, 6vw, 6rem)',
          paddingLeft: '2rem',
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "'Moderniz', sans-serif",
            fontSize: 'clamp(2.2rem, 4.5vw, 5rem)',
            letterSpacing: '-0.03em',
            color: '#111111',
            lineHeight: 1,
            display: 'block',
            marginBottom: '1rem',
            textAlign: 'right',
          }}
        >
          {'<full stack>'}
        </span>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.95rem',
            color: 'rgba(17,17,17,0.5)',
            lineHeight: 1.6,
            maxWidth: '22ch',
            margin: 0,
            textAlign: 'right',
          }}
        >
          Full-stack developer who builds clean, fast, and production-ready web applications.
        </p>
      </div>



      {/* ── Scroll cue ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
          fontFamily: "'DM Sans', sans-serif",
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
