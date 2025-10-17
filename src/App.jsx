// src/App.jsx
import React, { useState } from "react";

import Hero from "./components/Hero.jsx";
import Profile from "./components/Profile.jsx";
import Areas from "./components/Areas.jsx";

import Stats from "./components/Stats.jsx";            // STATS
import Globe3D from "./components/Globe3D.jsx";       // SALES (3D)
import CountryPills from "./components/CountryPills.jsx";
import WorldMap from "./components/WorldMap.jsx";     // SALES (2D)

import OpsGrid from "./components/OpsGrid.jsx";       // SKILLS
import AIML from "./components/AIML.jsx";             // ENGINEERING
import Projects from "./components/Projects.jsx";     // FINANCE (Financial Projects)
import TechGrid from "./components/TechGrid.jsx";     // SOFTWARE
import Resume from "./components/Resume.jsx";

import NavOverlay from "./components/NavOverlay.jsx";
import ContactModal from "./components/ContactModal.jsx";
import FloatUI from "./components/FloatUI.jsx";
import CollapsibleSection from "./components/CollapsibleSection.jsx";

export default function App(){
  const [navOpen, setNavOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      <header className="section"><header className="section"><Hero /></header></header>

      <main>
        {/* PROFILE */}
        <CollapsibleSection id="profile" title="PROFILE" defaultOpen={false}>
          <Profile />
        </CollapsibleSection>

        {/* AREAS (kept standalone) */}
        <section id="areas" className="section">
          <Areas />
        </section>

        {/* STATS */}
        <CollapsibleSection id="stats" title="STATS" defaultOpen={false}>
          <Stats />
        </CollapsibleSection>

        {/* SALES (3D globe + 2D map) */}
        <CollapsibleSection id="sales" title="SALES" defaultOpen={false}>
          <section id="globe" className="section">
            <Globe3D />
            <CountryPills />
          </section>
          <section id="worldmap" className="section">
            <WorldMap />
          </section>
        </CollapsibleSection>

        {/* SKILLS (after SALES) */}
        <CollapsibleSection id="skills" title="SKILLS" defaultOpen={false}>
          <OpsGrid />
        </CollapsibleSection>

        {/* ENGINEERING */}
        <CollapsibleSection id="engineering" title="ENGINEERING" defaultOpen={false}>
          <AIML />
        </CollapsibleSection>

        {/* FINANCE (after ENGINEERING) */}
        <CollapsibleSection id="finance" title="FINANCE" defaultOpen={false}>
          <Projects />
        </CollapsibleSection>

        {/* SOFTWARE */}
        <CollapsibleSection id="software" title="SOFTWARE" defaultOpen={false}>
          <TechGrid />
        </CollapsibleSection>

        {/* RESUME */}
        <CollapsibleSection id="resume" title="RESUME" defaultOpen={false}>
          <Resume />
        </CollapsibleSection>
      </main>

      <FloatUI onOpenMenu={()=>setNavOpen(true)} onOpenContact={()=>setContactOpen(true)} />
      <NavOverlay open={navOpen} onClose={()=>setNavOpen(false)} />
      <ContactModal open={contactOpen} onClose={()=>setContactOpen(false)} />

      <footer className="section text-center opacity-60 text-sm">
        © {new Date().getFullYear()} Andrea — Built with React & Tailwind
      </footer>
    </div>
  );
}
