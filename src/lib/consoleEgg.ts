import { openTerminal } from '../components/Terminal'

const EMAIL = 'ronen0902@gmail.com'

declare global {
  interface Window {
    ronen?: {
      terminal: () => void
      hire: () => void
      help: () => void
    }
  }
}

let installed = false

// Styled console banner + window.ronen API. Opt-in easter egg for the
// engineers who open devtools — costs non-technical visitors nothing.
export function installConsoleEgg() {
  if (installed || typeof window === 'undefined') return
  installed = true

  const title = 'color:#569cd6;font-size:15px;font-weight:700;font-family:monospace'
  const dim = 'color:#777;font-family:monospace'
  const accent = 'color:#28c840;font-family:monospace'
  const str = 'color:#ce9178;font-family:monospace'

  /* eslint-disable no-console */
  console.log('%cronen.init()', title)
  console.log('%c> hello, world — thanks for inspecting.', accent)
  console.log(
    '%cpsst: run %cronen.terminal()%c to open the terminal.',
    dim, 'color:#fff;font-family:monospace;font-weight:700', dim,
  )
  console.log('%calso: ronen.hire()  ·  ronen.help()', dim)
  console.log(`%c// looking for work — ${EMAIL}`, str)
  /* eslint-enable no-console */

  window.ronen = {
    terminal: () => openTerminal(),
    hire: () => { window.location.href = `mailto:${EMAIL}?subject=Let%27s%20talk` },
    help: () => {
      // eslint-disable-next-line no-console
      console.log('%cronen.terminal()  open the terminal\nronen.hire()      email me', 'color:#777;font-family:monospace')
    },
  }
}
