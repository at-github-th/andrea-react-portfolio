// src/components/Resume.jsx
import React, { useMemo, useState } from "react";

export default function Resume() {
  const [open, setOpen] = useState(false);

  const RESUME_URL = useMemo(() => `${import.meta.env.BASE_URL}resume.pdf`, []);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;

  return (
    <section className="section" id="resume">
      <h2>RESUME</h2>
      <p className="opacity-70 mb-6">
        Download my resume for background, projects, and contact details.
      </p>

      <button className="btn" onClick={() => setOpen(true)} aria-label="Open resume preview">
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
              <button className="btn" onClick={() => setOpen(false)} aria-label="Close resume preview">
                Close
              </button>
            </div>

            {/* Mobile: avoid iframe PDF embed (unreliable). Desktop: embed. */}
            {isMobile ? (
              <div className="flex-1 grid place-items-center text-center gap-3">
                <p className="opacity-80">
                  Preview works best by opening the PDF directly on mobile.
                </p>
                <div className="flex gap-2">
                  <a className="btn" href={RESUME_URL} target="_blank" rel="noreferrer">
                    Open
                  </a>
                  <a className="btn" href={RESUME_URL} download>
                    Download PDF
                  </a>
                </div>
              </div>
            ) : (
              <iframe
                src={RESUME_URL}
                title="Resume PDF"
                className="w-full flex-1 rounded-lg border border-white/10 bg-transparent"
              />
            )}

            {!isMobile && (
              <div className="mt-4 flex justify-end gap-2">
                <a className="btn" href={RESUME_URL} target="_blank" rel="noreferrer">
                  Open
                </a>
                <a className="btn" href={RESUME_URL} download>
                  Download PDF
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}