import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

// Boot sequence. Each line types out, then the overlay lifts away.
const LINES: { prompt: string; text: string; color?: string }[] = [
  { prompt: '$', text: 'ronen.init()' },
  { prompt: '>', text: 'compiling portfolio…', color: '#6a9955' },
  { prompt: '>', text: 'hello, world', color: '#ce9178' },
]

const CHAR_MS = 26
const LINE_PAUSE = 130
const HOLD_AFTER = 520

const STORAGE_KEY = 'ry-intro-seen'

function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function Intro() {
  // Show once per session, and never when the user asked for reduced motion.
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    if (prefersReducedMotion()) return false
    return !sessionStorage.getItem(STORAGE_KEY)
  })

  const [typed, setTyped] = useState<string[]>(LINES.map(() => ''))
  const [activeLine, setActiveLine] = useState(0)
  const [done, setDone] = useState(false)
  const timers = useRef<number[]>([])

  const finish = () => {
    setVisible(false)
    try { sessionStorage.setItem(STORAGE_KEY, '1') } catch { /* private mode */ }
  }

  // Lock scroll while the intro is up.
  useEffect(() => {
    if (!visible) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [visible])

  // Typewriter driver.
  useEffect(() => {
    if (!visible) return
    let li = 0
    let ci = 0

    const step = () => {
      if (li >= LINES.length) {
        setDone(true)
        timers.current.push(window.setTimeout(finish, HOLD_AFTER))
        return
      }
      const line = LINES[li]
      if (ci <= line.text.length) {
        const slice = line.text.slice(0, ci)
        setTyped((prevArr) => {
          const next = [...prevArr]
          next[li] = slice
          return next
        })
        ci++
        timers.current.push(window.setTimeout(step, CHAR_MS))
      } else {
        li++
        ci = 0
        setActiveLine(li)
        timers.current.push(window.setTimeout(step, LINE_PAUSE))
      }
    }

    timers.current.push(window.setTimeout(step, 320))
    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  // Allow Esc / Space / Enter to skip.
  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.7, ease: EASE_BRAND } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'linear-gradient(160deg, #161617 0%, #0d0d0e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          {/* skip */}
          <button
            onClick={finish}
            aria-label="Skip intro"
            style={{
              position: 'absolute',
              top: 'clamp(1rem, 4vw, 2rem)',
              right: 'clamp(1rem, 4vw, 2rem)',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '100px',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.4rem 0.85rem',
              cursor: 'pointer',
              transition: 'color 150ms ease, border-color 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
            }}
          >
            skip →
          </button>

          {/* terminal window */}
          <div
            style={{
              width: 'min(560px, 92vw)',
              borderRadius: '10px',
              overflow: 'hidden',
              background: '#0c0c0d',
              boxShadow: '0 40px 90px -30px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.06)',
            }}
          >
            {/* title bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 0.9rem',
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.9 }} />
              ))}
              <span
                style={{
                  marginLeft: '0.5rem',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.04em',
                }}
              >
                ronen — zsh
              </span>
            </div>

            {/* body */}
            <div
              style={{
                padding: '1.4rem 1.5rem 1.6rem',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 'clamp(0.85rem, 2.4vw, 0.98rem)',
                lineHeight: 1.9,
                minHeight: '7.5rem',
              }}
            >
              {LINES.map((line, i) => (
                <div key={i} style={{ color: line.color ?? '#e8e8e8', whiteSpace: 'pre-wrap' }}>
                  {(i < activeLine || (i === activeLine) || done) && typed[i] !== '' && (
                    <>
                      <span style={{ color: line.prompt === '$' ? '#569cd6' : 'rgba(255,255,255,0.35)' }}>
                        {line.prompt}{' '}
                      </span>
                      {typed[i]}
                      {i === activeLine && !done && (
                        <span className="intro-caret" style={{ color: '#fff' }}>▋</span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <style>{`
            @keyframes intro-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
            .intro-caret { animation: intro-blink 1s steps(1) infinite; margin-left: 1px; }
            @media (prefers-reduced-motion: reduce) { .intro-caret { animation: none } }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
