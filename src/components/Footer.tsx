export function Footer() {
  return (
    <footer style={{ padding: '2.5rem clamp(1.5rem,5vw,4rem)', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'var(--muted)' }}>
        <a href="mailto:ronen0902@gmail.com" style={{ color: 'var(--muted)', textDecoration: 'none' }}>ronen0902@gmail.com</a>
        <a href="https://github.com/RonenYakov" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none' }}>github</a>
        <a href="https://www.linkedin.com/in/ronen-yakobov-b217211ab/" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none' }}>linkedin</a>
        <span>+972 054-266-4674</span>
      </div>
    </footer>
  )
}
