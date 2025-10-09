import React from "react";

export default function Resume() {
  return (
    <div className="resume-wrap space-y-4">
      <div className="card resume-card px-4 py-3">
        <img
          src="/resume-icon.svg"
          alt=""
          className="w-5 h-5 opacity-80"
          onError={(e)=>{ e.currentTarget.style.display='none'; }}
        />
        <span className="tracking-wide">Resume</span>
      </div>

      <p className="opacity-80">
        Download my resume for background and projects; contact details included.
      </p>

      <a href="/resume.pdf" download className="btn mx-auto px-6 py-2">
        Download
      </a>
    </div>
  );
}
