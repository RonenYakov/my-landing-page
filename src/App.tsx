import { NavBar } from './components/NavBar'
import { SplitHero } from './components/SplitHero'
import { ProjectScroll } from './components/ProjectScroll'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <NavBar />
      <main style={{ paddingTop: '56px' }}>
        <SplitHero />
        <ProjectScroll />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
