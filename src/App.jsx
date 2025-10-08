import React, { useState } from 'react'
import Hero from './components/Hero.jsx'
import Profile from './components/Profile.jsx'
import Areas from './components/Areas.jsx'
import Stats from './components/Stats.jsx'
import Projects from './components/Projects.jsx'
import OpsGrid from './components/OpsGrid.jsx'
import AIML from './components/AIML.jsx'
import Resume from './components/Resume.jsx'
import Cube from './components/Cube.jsx'
import NavOverlay from './components/NavOverlay.jsx'
import ContactModal from './components/ContactModal.jsx'
import FloatUI from './components/FloatUI.jsx'

export default function App(){
  const [navOpen, setNavOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <div className="min-h-dvh">
      <Hero />

      <main>
        <section id="profile" className="section">
          <Profile />
        </section>

        <section id="areas" className="section">
          <Areas />
        </section>

        <section id="summary" className="section">
          <Stats />
        </section>

        <section id="projects" className="section">
          <Projects />
        </section>

        <section id="cube" className="section">
          <Cube />
        </section>

        <section id="skills" className="section">
          <OpsGrid />
        </section>

        <section id="ai" className="section">
          <AIML />
        </section>

        <section id="resume" className="section">
          <Resume />
        </section>
      </main>

      <FloatUI onOpenMenu={()=>setNavOpen(true)} onOpenContact={()=>setContactOpen(true)} />
      <NavOverlay open={navOpen} onClose={()=>setNavOpen(false)} />
      <ContactModal open={contactOpen} onClose={()=>setContactOpen(false)} />

      <footer className="section text-center opacity-60 text-sm">
        © {new Date().getFullYear()} Andrea — Built with React & Tailwind
      </footer>
    </div>
  )
}
