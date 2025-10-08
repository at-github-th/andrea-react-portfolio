
import React from 'react'

export default function Hero(){
  return (
    <header className="relative h-[70vh] md:h-[78vh] overflow-hidden">
      <video className="absolute inset-0 w-full h-full object-cover opacity-40" autoPlay loop muted playsInline>
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/10 via-ink-900/40 to-ink-900" />
      <div className="relative section h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl tracking-[0.12em] font-bold">ANDREA TEMPESTINI</h1>
        <p className="mt-3 md:mt-4 text-sm md:text-base opacity-80 tracking-widest">LEAD SOLUTIONS ENGINEER • PRESALES • INTEGRATIONS</p>
        <a href="#projects" className="btn mt-8">Discover</a>
      </div>
    </header>
  )
}
