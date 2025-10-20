const fs=require('node:fs');
function edit(f,fn){let s=fs.readFileSync(f,'utf8');const t=fn(s);if(t!==s)fs.writeFileSync(f,t,'utf8');}

// ---- App.jsx: mount buttons, data-compact, remove tags row, add SYSTEM MAP
edit('src/App.jsx',(s)=>{
  // imports
  if(!/CornerButtons/.test(s)) s = 'import CornerButtons from "./components/CornerButtons.jsx";\n' + s;
  if(!/ useMode /.test(s)) s = s.replace('import { ModeProvider } from "./context/ModeContext.jsx";','import { ModeProvider } from "./context/ModeContext.jsx";\nimport { useMode } from "./context/ModeContext.jsx";');

  // data-compact on root wrapper
  if(!/data-compact=/.test(s)) s = s.replace('<div className="min-h-dvh">','<div className="min-h-dvh" data-compact={useMode().compact ? "" : undefined}>');

  // show CornerButtons (replace old FloatUI if present; otherwise inject near top)
  s = s.replace(/<FloatUI\s*\/>\s*/g,'');
  if(!/<CornerButtons \/>/.test(s)) s = s.replace(/<header[\s\S]*?<\/header>/, (m)=> m + '\n      <CornerButtons />');

  // remove the tags row under PROFILE
  s = s.replace(/<Badges[^>]*\/>\s*/g,'');

  // ensure SYSTEM MAP section exists (simple insert before STATS)
  if(!/id="system-map"/.test(s)){
    const insert = '\n\n<CollapsibleSection id="system-map" title="SYSTEM MAP" defaultOpen={false} data-section="system-map">\n  <SystemMap />\n</CollapsibleSection>\n\n';
    s = s.replace(/<\/CollapsibleSection>\s*\n\s*\/\*\s*STATS\s*\*\//, (m)=>'</CollapsibleSection>'+insert+'/* STATS */');
    if(!/import SystemMap/.test(s)) s = s.replace('import SpatialGrid from "./components/SpatialGrid.jsx";','import SpatialGrid from "./components/SpatialGrid.jsx";\nimport SystemMap from "./components/SystemMap.jsx";');
  }

  // remove the old wheel if still in PROFILE
  s = s.replace(/\s*<div className="mb-8">\s*<SkillOrbit\s*\/>\s*<\/div>\s*/g,'\n');

  return s;
});

// ---- index.css: sizes, z-index, hide old contact chip/button, compact tweaks
edit('src/index.css',(c)=>{
  if(!c.includes('.corner-btn')) c += `
.corner-btn{transition:transform .15s ease,opacity .15s ease}
.corner-group{pointer-events:auto}
@media (hover:hover){.corner-btn:hover{transform:translateY(-1px)}}
`;
  if(!/\[data-compact\]\s*\.section/.test(c)) c += `
[data-compact] .section{padding-top:1.25rem;padding-bottom:1.25rem}
[data-compact] .compact-hidden{display:none!important}
[data-compact] .container{max-width:980px}
`;
  // hide legacy contact chip/button if present
  if(!c.includes('a[href="#contact"]')) c += `
a[href="#contact"].chip, a[href="#contact"].button, a[href="#contact"].contact, .contact-chip{display:none!important}
`;
  return c;
});
console.log('patched');
