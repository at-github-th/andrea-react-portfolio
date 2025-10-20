const fs=require('fs');

function edit(file, fn){let s=fs.readFileSync(file,'utf8');let t=fn(s);if(t!==s)fs.writeFileSync(file,t,'utf8');}

edit('src/App.jsx',(s)=>{
  if(!s.includes(' useMode ')) s=s.replace('import { ModeProvider } from "./context/ModeContext.jsx";','import { ModeProvider } from "./context/ModeContext.jsx";\nimport { useMode } from "./context/ModeContext.jsx";');
  if(!s.includes('FuturistToggle')) s=s.replace('import FloatUI from "./components/FloatUI.jsx";','import FloatUI from "./components/FloatUI.jsx";\nimport FuturistToggle from "./components/FuturistToggle.jsx";');
  if(!s.includes('data-compact')) s=s.replace('<div className="min-h-dvh">','<div className="min-h-dvh" data-compact={useMode().compact ? "" : undefined}>\n      <FuturistToggle />');
  s=s.replace(/(<CollapsibleSection[^>]+id=["']profile["'][\s\S]*?)\s*<div className="mb-8"><SkillOrbit\s*\/>\s*<\/div>\s*/,'$1');
  s=s.replace(/(<CollapsibleSection[^>]+id=["']system-map["'][\s\S]*?<SystemMap\s*\/>)/,'$1\n  <div className="mt-6"><SkillOrbit /></div>');
  return s;
});

edit('src/index.css',(c)=>{
  if(!c.includes('[data-compact]')) c+='\n\n[data-compact] .section { padding-top: 1.25rem; padding-bottom: 1.25rem; }\n[data-compact] .compact-hidden { display: none !important; }\n[data-compact] .container { max-width: 980px; }\n';
  return c;
});

console.log('OK');
