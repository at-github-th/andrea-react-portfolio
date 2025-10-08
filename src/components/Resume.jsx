
import React from 'react'
export default function Resume(){
  return (
    <section className="section">
      <h2>RESUME</h2>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="card p-4">
          <img src="/images/resume-placeholder.png" alt="Resume" className="rounded-xl" />
        </div>
        <div>
          <p className="opacity-80 mb-4">Download my resume for background and projects; contact details included.</p>
          <a className="btn" href="/Andrea_Tempestini_Resume.pdf" download>Download</a>
        </div>
      </div>
    </section>
  )
}
