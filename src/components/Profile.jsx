// src/components/Profile.jsx
import React from "react";

export default function Profile() {
  return (
    <section className="section">
      <h2>PROFILE</h2>
      <p className="opacity-70 mb-6">Expand this section for more details.</p>

      <div className="card p-6 rounded-xl">
        <div className="grid md:grid-cols-2 gap-6">
          <p className="opacity-90 leading-relaxed">
            I’m a <strong>Senior Solutions Engineer and Architect</strong> with a
            biomechanical engineering foundation and over a decade of experience
            delivering complex technical solutions across fast-evolving industries.
            I specialize in <strong>presales engineering</strong>, systems integration,
            automation, and solution design—bridging the gap between product vision
            and real-world implementation.
          </p>

          <p className="opacity-90 leading-relaxed">
            My background in <strong>biomechanics, robotics, and applied data
            systems</strong> gives me a unique edge in solving multidimensional
            problems with both precision and creativity. I lead projects
            end-to-end: discovery and architecture through hands-on build, PoC,
            and rollout—driving adoption through clarity, technical rigor, and
            commercial alignment.
          </p>
        </div>

        <p className="opacity-90 leading-relaxed mt-6">
          Multilingual and outcome-oriented, I thrive in high-impact, cross-functional
          environments where strategic architecture meets execution. Whether
          designing middleware, shaping integrations, or optimizing data flows, I
          focus on building <strong>scalable, adaptable solutions</strong> that
          help organizations grow with confidence.
        </p>
      </div>
    </section>
  );
}
