import FuturistToggle from "./components/FuturistToggle.jsx";
import Badges from "./components/Badges.jsx";
import FuturistPortal from "./futurist/FuturistPortal.jsx";
import SkillOrbit from "./components/SkillOrbit.jsx";
// src/App.jsx
import React, { useState } from "react";
import CompactToggle from "./components/CompactToggle.jsx";
import { useMode } from "./context/ModeContext.jsx";

import Hero from "./components/Hero.jsx";
import Profile from "./components/Profile.jsx";
import Areas from "./components/Areas.jsx";            // ← rendered inside PROFILE
import Stats from "./components/Stats.jsx";
import Globe3D from "./components/Globe3D.jsx";
import WorldMap from "./components/WorldMap.jsx";
import Projects from "./components/Projects.jsx";
import OpsGrid from "./components/OpsGrid.jsx";
import AIML from "./components/AIML.jsx";
import TechGrid from "./components/TechGrid.jsx";
import Resume from "./components/Resume.jsx";
import SpatialGrid from "./components/SpatialGrid.jsx";
import NavOverlay from "./components/NavOverlay.jsx";
import ContactModal from "./components/ContactModal.jsx";
import FloatUI from "./components/FloatUI.jsx";
import CollapsibleSection from "./components/CollapsibleSection.jsx";
import { ModeProvider, useMode } from "./context/ModeContext.jsx";
import SystemMap from "./components/SystemMap.jsx"; // use inside SYSTEM MAP section


function RootFrame({ children }) {
  const { compact } = useMode();
  return <div className="min-h-dvh">{children}</div>;
}

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-dvh" data-compact={useMode().compact ? "" : undefined}>
      <CompactToggle />
      {/* HERO */}
      <header className="section">
        <header className="section">
          <Hero />
        </header>
      <FuturistToggle />
      </header>

      <main>
        {/* PROFILE expands to show the four donut rows */}
        <CollapsibleSection id="profile" title="PROFILE" defaultOpen={true} data-section="profile">
<Profile />
          <div className="mt-8">
            <Areas />
          </div>
        </CollapsibleSection>

     <CollapsibleSection
  id="system-map"
  title="SYSTEM MAP"
  defaultOpen={false}
  data-section="system-map"
>
  <SystemMap />
</CollapsibleSection>


        {/* STATS */}
        <CollapsibleSection id="stats" title="STATS" defaultOpen={false}>
          <Stats />
        </CollapsibleSection>

        {/* SALES (Globe + Map only — CountryPills removed) */}
        <CollapsibleSection id="sales" title="SALES" defaultOpen={false}>
          <section className="section">
            <div className="mx-auto w-full max-w-5xl space-y-6">
              {/* 3D globe */}
              <div className="compact-hidden"><div className="card p-0">
                <div className="w-full">
                  <Globe3D />
                </div>
              </div></div>

              {/* world map */}
              <div className="compact-hidden"><div className="card p-0">
                <div className="w-full">
                  <WorldMap />
                </div>
              </div></div>
            </div>
          </section>
        </CollapsibleSection>

        {/* SKILLS */}
        <CollapsibleSection id="skills" title="SKILLS" defaultOpen={false}>
          <OpsGrid />
        </CollapsibleSection>

        {/* ENGINEERING */}
        <CollapsibleSection id="engineering" title="ENGINEERING" defaultOpen={false}>
          <AIML />
        </CollapsibleSection>

        {/* FINANCE */}
        <CollapsibleSection id="finance" title="FINANCE" defaultOpen={false}>
          <section className="section">
            <Projects />
          </section>
        </CollapsibleSection>

        {/* SOFTWARE */}
        <CollapsibleSection id="software" title="SOFTWARE" defaultOpen={false}>
          <TechGrid />
        </CollapsibleSection>

        {/* RESUME */}
        <CollapsibleSection id="resume" title="RESUME" defaultOpen={false}>
          <Resume />
        </CollapsibleSection>
      <FuturistPortal />
    </main>

      {/* Futurist overlay appears when compact is on */}
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
