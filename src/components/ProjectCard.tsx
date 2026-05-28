import { useState } from 'react'
import type { Project } from '../data/projects'

interface ProjectCardProps {
  project: Project
}

/** Splits `title` at `highlightWord` and renders that word in Dimension font + navy. */
function HighlightTitle({
  title,
  highlightWord,
}: {
  title: string
  highlightWord: string
}) {
  const idx = title.indexOf(highlightWord)
  if (idx === -1) {
    return <span>{title}</span>
  }
  const before = title.slice(0, idx)
  const after = title.slice(idx + highlightWord.length)
  return (
    <>
      {before}
      <span
        style={{
          fontFamily: "'Dimension', 'Cormorant Garamond', serif",
          color: 'var(--navy)',
          fontStyle: 'italic',
        }}
      >
        {highlightWord}
      </span>
      {after}
    </>
  )
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        width: '360px',
        flexShrink: 0,
        border: `1px solid ${hovered ? 'var(--navy)' : 'var(--border)'}`,
        borderRadius: '10px',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'border-color 0.2s',
        background: 'var(--bg)',
      }}
    >
      {/* Poster image area */}
      <div
        style={{
          aspectRatio: '16 / 10',
          background: 'var(--snippet-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.72rem',
              color: 'var(--muted)',
              textAlign: 'center',
              padding: '0 1rem',
            }}
          >
            {project.title}
          </span>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '1.25rem' }}>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: '1rem',
            color: 'var(--text)',
            margin: '0 0 0.35rem',
            lineHeight: 1.35,
          }}
        >
          <HighlightTitle title={project.title} highlightWord={project.highlightWord} />
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: '0.8rem',
            color: 'var(--muted)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {project.category}
        </p>
      </div>
    </a>
  )
}
