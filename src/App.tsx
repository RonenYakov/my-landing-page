import { NavBar } from './components/NavBar'
import { SplitHero } from './components/SplitHero'
import { ProjectScroll } from './components/ProjectScroll'

export default function App() {
  return (
    <>
      <NavBar />
      <main style={{ paddingTop: '56px' }}>
        <SplitHero />
        <ProjectScroll />
      </main>
    </>
  )
}
