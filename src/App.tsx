import { useLenis } from './hooks/useLenis'
import { NavBar } from './components/NavBar'
import { SplitHero } from './components/SplitHero'
import { ProjectScroll } from './components/ProjectScroll'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  useLenis()
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
