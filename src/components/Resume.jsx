// src/components/Resume.jsx
import React, { useState } from "react";

export default function Resume() {
  const [open, setOpen] = useState(false);

  return (
    <section className="section" id="resume">
      <h2>RESUME</h2>
      <p className="opacity-70 mb-6">
        Download my resume for background, projects, and contact details.
      </p>

      <button
        className="btn"
        onClick={() => setOpen(true)}
        aria-label="Open resume preview"
      >
        View Resume
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="card p-4 w-[92vw] max-w-4xl h-[85vh] overflow-hidden rounded-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold tracking-widest">My Resume</h3>
              <button
                className="btn"
                onClick={() => setOpen(false)}
                aria-label="Close resume preview"
              >
                Close
              </button>
            </div>

            <iframe
              src="/resume.pdf"
              title="Resume PDF"
              className="w-full h-full rounded-lg border border-white/10"
            ></iframe>

            <div className="mt-4 flex justify-end">
              <a
                href="/resume.pdf"
                download
                className="btn"
                aria-label="Download resume"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
