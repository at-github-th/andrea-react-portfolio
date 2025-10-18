// src/App.jsx
import React, { useState } from "react";

import Hero from "./components/Hero.jsx";
import Profile from "./components/Profile.jsx";
import Areas from "./components/Areas.jsx";            // ← we’ll render this inside PROFILE now
import Stats from "./components/Stats.jsx";
import Globe3D from "./components/Globe3D.jsx";
import CountryPills from "./components/CountryPills.jsx";
import WorldMap from "./components/WorldMap.jsx";
import Projects from "./components/Projects.jsx";
import OpsGrid from "./components/OpsGrid.jsx";
import AIML from "./components/AIML.jsx";
import TechGrid from "./components/TechGrid.jsx";
import Resume from "./components/Resume.jsx";

import NavOverlay from "./components/NavOverlay.jsx";
import ContactModal from "./components/ContactModal.jsx";
import FloatUI from "./components/FloatUI.jsx";
import CollapsibleSection from "./components/CollapsibleSection.jsx";

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      <header className="section"><header className="section"><Hero /></header></header>

      <main>
        {/* PROFILE now expands to show the four donut rows */}
        <CollapsibleSection id="profile" title="PROFILE" defaultOpen={false}>
          <Profile />
          <div className="mt-8">
            <Areas />
          </div>
        </CollapsibleSection>

        {/* remove the old standalone Areas section */}
        {/* <section id="areas" className="section"><Areas /></section> */}

        <CollapsibleSection id="stats" title="STATS" defaultOpen={false}>
          <Stats />
        </CollapsibleSection>

        <CollapsibleSection id="sales" title="SALES" defaultOpen={false}>
          <div className="section">
            <Globe3D />
            <CountryPills />
            <WorldMap />
          </div>
        </CollapsibleSection>

        <CollapsibleSection id="skills" title="SKILLS" defaultOpen={false}>
          <OpsGrid />
        </CollapsibleSection>

        <CollapsibleSection id="engineering" title="ENGINEERING" defaultOpen={false}>
          <AIML />
        </CollapsibleSection>

        <CollapsibleSection id="finance" title="FINANCE" defaultOpen={false}>
          {/* keep whatever you currently show here for Finance */}
          {/* e.g., charts or financial projects if you’ve slotted them here */}
        </CollapsibleSection>

        <CollapsibleSection id="software" title="SOFTWARE" defaultOpen={false}>
          <TechGrid />
        </CollapsibleSection>

        <CollapsibleSection id="resume" title="RESUME" defaultOpen={false}>
          <Resume />
        </CollapsibleSection>
      </main>

      <FloatUI onOpenMenu={() => setNavOpen(true)} onOpenContact={() => setContactOpen(true)} />
      <NavOverlay open={navOpen} onClose={() => setNavOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      <footer className="section text-center opacity-60 text-sm">
        © {new Date().getFullYear()} Andrea — Built with React & Tailwind
      </footer>
    </div>
  );
}
