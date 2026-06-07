import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { projects } from '../data/projects'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

// ─── Module-level opener so window.ronen.terminal() can reach the React tree ───
let openFn: (() => void) | null = null
export function openTerminal() { openFn?.() }

type Line = { text: string; color?: string }

const COLORS = {
  prompt: '#28c840',
  cmd: '#fff',
  out: '#c9c9c9',
  muted: '#777',
  accent: '#569cd6',
  string: '#ce9178',
  comment: '#6a9955',
}

const EMAIL = 'ronen0902@gmail.com'
const GITHUB = 'https://github.com/RonenYakov'
const LINKEDIN = 'https://www.linkedin.com/in/ronen-yakobov-b217211ab/'

const BANNER: Line[] = [
  { text: "ronen@portfolio:~$ welcome — you found the terminal.", color: COLORS.comment },
  { text: "type 'help' for commands. 'exit' or Esc to close.", color: COLORS.muted },
]

const HELP: Line[] = [
  { text: 'available commands:', color: COLORS.accent },
  { text: '  help        this list' },
  { text: '  about       who I am' },
  { text: '  skills      what I work with' },
  { text: '  projects    list my work (with links)' },
  { text: '  open <id>   open a project on GitHub' },
  { text: '  resume      download my CV' },
  { text: '  contact     how to reach me' },
  { text: '  goto <sec>  jump to a section (about/projects/skills/contact)' },
  { text: '  sudo hire   the only command that matters', color: COLORS.comment },
  { text: '  clear       wipe the screen' },
  { text: '  exit        close the terminal' },
]

export function Terminal() {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [cmdLog, setCmdLog] = useState<string[]>([])
  const [logIdx, setLogIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  // Register the global opener.
  useEffect(() => {
    openFn = () => {
      setOpen(true)
      setHistory((h) => (h.length ? h : [...BANNER]))
    }
    return () => { openFn = null }
  }, [])

  // Focus input + scroll to bottom whenever things change.
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [history, open])

  // Esc closes.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const print = (lines: Line[]) => setHistory((h) => [...h, ...lines])

  const run = (raw: string) => {
    const cmd = raw.trim()
    print([{ text: `ronen@portfolio:~$ ${cmd}`, color: COLORS.out }])
    if (!cmd) return
    setCmdLog((l) => [...l, cmd])

    const [name, ...rest] = cmd.split(/\s+/)
    const arg = rest.join(' ').toLowerCase()

    switch (name.toLowerCase()) {
      case 'help':
        print(HELP); break

      case 'about':
        print([
          { text: 'Ronen Yakobov — CS graduate.', color: COLORS.accent },
          { text: 'I build across deep learning and the full stack:' },
          { text: 'PyTorch models, React/TS apps, low-level systems.' },
          { text: 'I read the paper, then build the thing. Looking for a team.', color: COLORS.comment },
        ]); break

      case 'skills':
        print([
          { text: 'languages   Python · TypeScript · JavaScript · C', color: COLORS.string },
          { text: 'ai/ml       PyTorch · CNNs · scikit-learn · transfer learning', color: COLORS.string },
          { text: 'frontend    React · TypeScript · Tailwind · motion', color: COLORS.string },
          { text: 'backend     Node · Express · SQL · PostgreSQL · REST', color: COLORS.string },
          { text: 'tooling     Git · Docker · Vite', color: COLORS.string },
        ]); break

      case 'projects':
      case 'ls':
        print([
          { text: `${projects.length} projects — use 'open <id>' to view:`, color: COLORS.accent },
          ...projects.map((p) => ({ text: `  ${p.id.padEnd(24)} ${p.title}`, color: COLORS.out })),
        ]); break

      case 'open': {
        const p = projects.find((x) => x.id === arg)
        if (!p) { print([{ text: `no project '${arg}'. try 'projects'.`, color: '#ff6b6b' }]); break }
        print([{ text: `opening ${p.title} ↗`, color: COLORS.comment }])
        window.open(p.liveUrl ?? p.githubUrl, '_blank', 'noopener,noreferrer')
        break
      }

      case 'resume':
      case 'cv':
        print([{ text: 'downloading ronen-cv.pdf ↓', color: COLORS.comment }])
        { const a = document.createElement('a'); a.href = '/ronen-cv.pdf'; a.download = ''; a.click() }
        break

      case 'contact':
        print([
          { text: `email      ${EMAIL}`, color: COLORS.string },
          { text: `github     ${GITHUB}`, color: COLORS.string },
          { text: `linkedin   ${LINKEDIN}`, color: COLORS.string },
        ]); break

      case 'goto': {
        const map: Record<string, string> = { about: 'about', projects: 'projects', skills: 'skills', contact: 'contact' }
        const id = map[arg]
        if (!id) { print([{ text: `unknown section '${arg}'.`, color: '#ff6b6b' }]); break }
        print([{ text: `scrolling to #${id} …`, color: COLORS.comment }])
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        setTimeout(() => setOpen(false), 400)
        break
      }

      case 'sudo':
        if (arg.startsWith('hire')) {
          print([
            { text: '  ┌─────────────────────────────┐', color: COLORS.prompt },
            { text: '  │   access granted. let\'s talk. │', color: COLORS.prompt },
            { text: '  └─────────────────────────────┘', color: COLORS.prompt },
            { text: `opening mail to ${EMAIL} …`, color: COLORS.comment },
          ])
          window.location.href = `mailto:${EMAIL}?subject=Let%27s%20talk`
        } else {
          print([{ text: `usage: sudo hire`, color: COLORS.muted }])
        }
        break

      case 'whoami':
        print([{ text: 'a developer worth interviewing.', color: COLORS.comment }]); break

      case 'clear':
        setHistory([]); break

      case 'exit':
      case 'quit':
        setOpen(false); break

      default:
        print([{ text: `command not found: ${name} — try 'help'.`, color: '#ff6b6b' }])
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
      setLogIdx(-1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!cmdLog.length) return
      const next = logIdx < 0 ? cmdLog.length - 1 : Math.max(0, logIdx - 1)
      setLogIdx(next); setInput(cmdLog[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (logIdx < 0) return
      const next = logIdx + 1
      if (next >= cmdLog.length) { setLogIdx(-1); setInput('') }
      else { setLogIdx(next); setInput(cmdLog[next]) }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="term-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 10001,
            background: 'rgba(8,8,10,0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          <motion.div
            key="term"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.32, ease: EASE_BRAND }}
            onMouseDown={() => inputRef.current?.focus()}
            style={{
              width: 'min(680px, 96vw)',
              height: 'min(440px, 70vh)',
              display: 'flex', flexDirection: 'column',
              borderRadius: '10px', overflow: 'hidden',
              background: '#0c0c0d',
              boxShadow: '0 40px 90px -30px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.07)',
            }}
          >
            {/* title bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 0.9rem', flexShrink: 0,
              background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                <span key={c} onClick={c === '#ff5f57' ? () => setOpen(false) : undefined}
                  style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.9, cursor: c === '#ff5f57' ? 'pointer' : 'default' }} />
              ))}
              <span style={{ marginLeft: '0.5rem', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                ronen@portfolio — bash
              </span>
            </div>

            {/* body */}
            <div ref={bodyRef} style={{
              flex: 1, overflowY: 'auto', padding: '1rem 1.1rem',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.83rem', lineHeight: 1.7,
            }}>
              {history.map((l, i) => (
                <div key={i} style={{ color: l.color ?? COLORS.out, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{l.text}</div>
              ))}
              {/* input line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: COLORS.prompt }}>ronen@portfolio:~$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="terminal input"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: COLORS.cmd, fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.83rem',
                    caretColor: COLORS.prompt,
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
