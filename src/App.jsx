// src/App.jsx
import React, { useState } from "react";

import Hero from "./components/Hero.jsx";
import Profile from "./components/Profile.jsx";
import Areas from "./components/Areas.jsx";

import Stats from "./components/Stats.jsx";             // STATS
import Projects from "./components/Projects.jsx";       // FINANCE (Financial Projects)

import Globe3D from "./components/Globe3D.jsx";         // SALES (3D + 2D)
import CountryPills from "./components/CountryPills.jsx";
import WorldMap from "./components/WorldMap.jsx";

import OpsGrid from "./components/OpsGrid.jsx";         // SKILLS
import AIML from "./components/AIML.jsx";               // ENGINEERING
import TechGrid from "./components/TechGrid.jsx";       // SOFTWARE
import Resume from "./components/Resume.jsx";           // RESUME

import NavOverlay from "./components/NavOverlay.jsx";
import ContactModal from "./components/ContactModal.jsx";
import FloatUI from "./components/FloatUI.jsx";
import CollapsibleSection from "./components/CollapsibleSection.jsx";

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      <header className="section">
        <header className="section">
          <Hero />
        </header>
      </header>

      <main>
        {/* Compact, expandable sections */}
        <CollapsibleSection id="profile" title="PROFILE" defaultOpen={false}>
          <Profile />
        </CollapsibleSection>

        <section id="areas" className="section">
          <Areas />
        </section>

        <CollapsibleSection id="skills" title="SKILLS" defaultOpen={false}>
          <OpsGrid />
        </CollapsibleSection>

        {/* STATS (leave as-is) */}
        <CollapsibleSection id="stats" title="STATS" defaultOpen={false}>
          <Stats />
        </CollapsibleSection>

        {/* SALES (3D Globe + 2D World Map) */}
        <CollapsibleSection id="sales" title="SALES" defaultOpen={false}>
          <section id="globe" className="section pt-0">
            <Globe3D />
            <CountryPills />
          </section>
          <section id="worldmap" className="section">
            <WorldMap />
          </section>
        </CollapsibleSection>

        {/* FINANCE (Financial Projects list) */}
        <CollapsibleSection id="finance" title="FINANCE" defaultOpen={false}>
          <section id="projects" className="section pt-0">
            <Projects />
          </section>
        </CollapsibleSection>

        {/* ENGINEERING (AI / Systems Engineering) */}
        <CollapsibleSection id="engineering" title="ENGINEERING" defaultOpen={false}>
          <AIML />
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

      <FloatUI
        onOpenMenu={() => setNavOpen(true)}
        onOpenContact={() => setContactOpen(true)}
      />
      <NavOverlay open={navOpen} onClose={() => setNavOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      <footer className="section text-center opacity-60 text-sm">
        © {new Date().getFullYear()} Andrea — Built with React & Tailwind
      </footer>
    </div>
  );
}
