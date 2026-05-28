import { NavBar } from './components/NavBar'
import { ProjectScroll } from './components/ProjectScroll'

export default function App() {
  return (
    <>
      <NavBar />
      <main style={{ paddingTop: '56px' }}>
        <ProjectScroll />
      </main>
    </>
  )
}
