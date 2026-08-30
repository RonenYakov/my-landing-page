import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Project } from '../data/projects'

const EASE_BRAND: [number, number, number, number] = [0.77, 0, 0.175, 1]

const IMG_H = 160  // fixed pixel height for all images so shapes are consistent

function CardImages({ images, accent }: { images: string[]; accent: string }) {
  const [main, second, third] = images

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: accent, overflow: 'hidden' }}>

      {/* Side image — left, behind main */}
      {second && (
        <img src={second} alt=""
          style={{
            position: 'absolute',
            left: '4%',
            top: '50%',
            transform: 'translateY(-50%) rotate(-2deg)',
            width: '38%',
            height: `${IMG_H}px`,
            objectFit: 'cover',
            borderRadius: '8px',
            boxShadow: '0 4px 18px hsl(217 50% 18% / 0.12)',
            zIndex: 1,
          }}
        />
      )}

      {/* Side image — right, behind main */}
      {third && (
        <img src={third} alt=""
          style={{
            position: 'absolute',
            right: '4%',
            top: '50%',
            transform: 'translateY(-50%) rotate(2deg)',
            width: '38%',
            height: `${IMG_H}px`,
            objectFit: 'cover',
            borderRadius: '8px',
            boxShadow: '0 4px 18px hsl(217 50% 18% / 0.12)',
            zIndex: 1,
          }}
        />
      )}

      {/* Main image — centered, front */}
      <img src={main} alt=""
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: second || third ? '52%' : '80%',
          height: `${IMG_H}px`,
          objectFit: 'cover',
          borderRadius: '8px',
          boxShadow: '0 8px 28px hsl(217 50% 18% / 0.16)',
          zIndex: 2,
        }}
      />
    </div>
  )
}

const PLACEHOLDER_CONTENT: Record<string, { lines: { text: string; muted?: boolean }[] }> = {
  'graph-server': {
    lines: [
      { text: 'graph.addEdge(u, v)' },
      { text: 'graph.bfs(start)' },
      { text: 'threads: 8 · latency: 2ms', muted: true },
      { text: 'clients connected: 12', muted: true },
    ],
  },
  'stock-trading-agent': {
    lines: [
      { text: 'signal: BUY  NVDA +2.4%' },
      { text: 'agent.step(observation)' },
      { text: 'reward: +0.087', muted: true },
      { text: 'episode: 1842 · ε: 0.12', muted: true },
    ],
  },
  'wedding-invitation': {
    lines: [
      { text: '♡  Save the Date  ♡' },
      { text: 'RSVP · Gallery · Map' },
      { text: 'animated · mobile-first', muted: true },
      { text: 'TypeScript + Framer', muted: true },
    ],
  },
  'assembly-project': {
    lines: [
      { text: 'MOV AX, input' },
      { text: 'CALL isPrime' },
      { text: 'Caesar shift: 13', muted: true },
      { text: 'x86 · 16-bit · DOS', muted: true },
    ],
  },
  'interactive-interpreter': {
    lines: [
      { text: '>>> run script.lang' },
      { text: 'parsed 42 tokens' },
      { text: 'exec: 0.003s', muted: true },
      { text: 'Python · custom grammar', muted: true },
    ],
  },
}

function NoImagePlaceholder({ id, accent }: { id: string; accent: string }) {
  const content = PLACEHOLDER_CONTENT[id] ?? {
    lines: [{ text: `// ${id}` }, { text: 'coming soon', muted: true }],
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: accent,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        padding: '1rem 1.5rem',
        background: 'rgba(255,255,255,0.55)',
        borderRadius: '8px',
        backdropFilter: 'blur(6px)',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '0.72rem',
        lineHeight: 2,
        minWidth: '200px',
      }}>
        {content.lines.map((l, i) => (
          <div key={i} style={{ color: l.muted ? '#999' : '#1a2e4a' }}>{l.text}</div>
        ))}
      </div>
    </div>
  )
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)
  const reduce = useReducedMotion()

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: EASE_BRAND }}
      whileHover={reduce ? undefined : { y: -6 }}
      whileTap={reduce ? undefined : { scale: 0.985, y: -2 }}
      className="project-card"
      style={{
        display: 'block',
        flexShrink: 0,
        border: `1px solid ${hovered ? 'var(--navy)' : 'var(--border)'}`,
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'border-color 200ms ease, box-shadow 220ms ease',
        background: 'var(--bg)',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      }}
    >
      {/* Image area — links to live site if available, else GitHub */}
      <a
        href={project.liveUrl ?? project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', textDecoration: 'none' }}
      >
        <div style={{ aspectRatio: '16 / 10', overflow: 'hidden' }}>
          {project.images?.length ? (
            <CardImages images={project.images} accent={project.accent} />
          ) : (
            <NoImagePlaceholder id={project.id} accent={project.accent} />
          )}
        </div>
      </a>

      {/* Card body */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          fontSize: '1.05rem',
          color: 'var(--text)',
          margin: '0 0 0.35rem',
          lineHeight: 1.35,
        }}>
          {project.title}
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: '0.85rem',
          lineHeight: 1.5,
          color: 'var(--muted)',
          margin: 0,
        }}>
          {project.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: '0.8rem',
            color: 'var(--muted)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {project.category}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.65rem',
                  letterSpacing: '0.06em',
                  color: 'var(--navy)',
                  textDecoration: 'none',
                  border: '1px solid var(--navy)',
                  borderRadius: '100px',
                  padding: '0.2rem 0.55rem',
                }}
              >
                live ↗
              </a>
            )}
            {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.06em',
                color: 'var(--muted)',
                textDecoration: 'none',
                border: '1px solid var(--border)',
                borderRadius: '100px',
                padding: '0.2rem 0.55rem',
              }}
            >
              github ↗
            </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
