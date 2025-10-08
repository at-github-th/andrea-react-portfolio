import React from 'react';

export default function Hero() {
  const goProfile = () => {
    const el = document.getElementById('profile');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="hero" className="section grid min-h-[72vh] place-items-center">
      <div className="w-full text-center">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-[0.08em]">
          ANDREA TEMPESTINI
        </h1>
        <p className="mt-2 opacity-75">
          LEAD SOLUTIONS ENGINEER • PRESALES • INTEGRATIONS
        </p>
        <button className="btn mt-6" onClick={goProfile}>Discover</button>
      </div>
    </section>
  );
}
