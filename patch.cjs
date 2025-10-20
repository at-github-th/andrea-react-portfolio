const fs=require('node:fs');

function edit(f,fn){let s=fs.readFileSync(f,'utf8');const t=fn(s);if(t!==s){fs.writeFileSync(f,t,'utf8');console.log('patched',f)}}

edit('src/App.jsx',(s)=>{
  if(!/import\s*\{\s*useMode\s*\}\s*from\s*"\.\/context\/ModeContext\.jsx"/.test(s)){
    s=s.replace('import { ModeProvider } from "./context/ModeContext.jsx";','import { ModeProvider } from "./context/ModeContext.jsx";\nimport { useMode } from "./context/ModeContext.jsx";');
  }
  if(!/data-compact=/.test(s)){
    s=s.replace('<div className="min-h-dvh">','<div className="min-h-dvh" data-compact={useMode().compact ? "" : undefined}>');
  }
  s=s.replace(/<Badges[^>]*\/>\s*/g,'');                                      // remove tags row
  s=s.replace(/\s*<div className="mb-8">\s*<SkillOrbit\s*\/>\s*<\/div>\s*/,''); // remove wheel from PROFILE
  s=s.replace(/<CollapsibleSection id="system-map"[\s\S]*?>\s*<SkillOrbit\s*\/>\s*<\/CollapsibleSection>/,
              '<CollapsibleSection id="system-map" title="SYSTEM MAP" defaultOpen={false} data-section="system-map">\n  <SystemMap />\n</CollapsibleSection>');
  if(!/<FuturistToggle\s*\/>/.test(s)){                                       // mount the button once
    if(/<\/header>/.test(s)) s=s.replace(/<\/header>/,'</header>\n      <FuturistToggle />');
    else s=s.replace('<main>','<FuturistToggle />\n      <main>');
  }
  return s;
});

edit('src/components/FuturistToggle.jsx',(s)=>{
  return s.replace(/className=\{[^}]*\}/,
    'className={"fixed z-[10001] left-4 bottom-4 md:left-6 md:bottom-6 grid place-items-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-800/90 border border-white/15 backdrop-blur shadow-lg hover:bg-slate-800/80"}'
  );
});

if (fs.existsSync('src/index.css')) {
  edit('src/index.css',(c)=>{
    if(!/\[data-compact\]/.test(c)){
      c+='\n[data-compact] .section{padding-top:1.25rem;padding-bottom:1.25rem}\n[data-compact] .compact-hidden{display:none!important}\n[data-compact] .container{max-width:980px}\n';
    }
    return c;
  });
}
