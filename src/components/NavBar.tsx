import { motion, useReducedMotion } from 'motion/react'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

// GitHub and LinkedIn official brand SVGs (lucide-react does not export these icons)
function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.532 1.032 1.532 1.032.891 1.528 2.341 1.087 2.91.831.091-.646.349-1.087.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  )
}

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'about', href: '#about' },
  { label: 'projects', href: '#projects' },
  { label: 'skills', href: '#skills' },
  { label: 'contact', href: '#contact' },
]

export function NavBar() {
  const reduce = useReducedMotion()

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: reduce ? 0 : 0.1 } },
  }
  const linkVariants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: -8 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_BRAND } },
      }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 h-14"
      initial={reduce ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_BRAND }}
      style={{
        background: 'var(--nav-bg)',
        color: 'var(--nav-text)',
        zIndex: 100,
      }}
    >
      {/* Left: initials */}
      <span
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          fontSize: '1.1rem',
          color: '#ffffff',
          letterSpacing: '0.02em',
        }}
      >
        RY
      </span>

      {/* Center: nav links — hidden on mobile */}
      <motion.ul
        className="hidden md:flex items-center list-none m-0 p-0"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ gap: '2rem' }}
      >
        {NAV_LINKS.map(({ label, href }) => (
          <motion.li key={label} variants={linkVariants}>
            <a
              href={href}
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 400,
                fontSize: '1rem',
                color: 'var(--nav-text)',
                opacity: 0.85,
                textDecoration: 'none',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')}
            >
              {label}
            </a>
          </motion.li>
        ))}
      </motion.ul>

      {/* Right: GitHub + LinkedIn icons */}
      <div className="flex items-center" style={{ gap: '1rem' }}>
        <a
          href="https://github.com/RonenYakov"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          style={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}
        >
          <GitHubIcon size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/ronen-yakobov-b217211ab/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          style={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}
        >
          <LinkedInIcon size={20} />
        </a>
      </div>
    </motion.nav>
  )
}
