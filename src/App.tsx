import { useEffect } from 'react'
import { useLenis } from './hooks/useLenis'
import { NavBar } from './components/NavBar'
import { SplitHero } from './components/SplitHero'
import { ProjectScroll } from './components/ProjectScroll'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Intro } from './components/Intro'
import { Terminal } from './components/Terminal'
import { FieldRibbon } from './components/FieldRibbon'
import { ScrollBuild } from './components/ScrollBuild'
import { installConsoleEgg } from './lib/consoleEgg'
// import { FunFacts } from './components/FunFacts'
// import { ThemeProvider } from './ThemeContext'
// import { BackToTop } from './components/BackToTop'

export default function App() {
  useLenis()
  useEffect(() => { installConsoleEgg() }, [])
  return (
    <>
      <Intro />
      <NavBar />
      <main style={{ paddingTop: '56px' }}>
        <SplitHero />
        <About />
        <FieldRibbon />
        <ProjectScroll />
        <Skills />
        <ScrollBuild />
        <Contact />
        {/* <FunFacts /> */}
      </main>
      <Footer />
      {/* <BackToTop /> */}
      <Terminal />
    </>
  )
}
