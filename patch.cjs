const fs=require('node:fs');

function read(f){return fs.readFileSync(f,'utf8')}
function write(f,s){fs.writeFileSync(f,s,'utf8')}
function edit(f,fn){let s=read(f),t=fn(s); if(t!==s) write(f,t)}

// --- 1) App.jsx: wire compact attr, mount single FuturistToggle, remove tags, move wheel, add SYSTEM MAP
edit('src/App.jsx',(s)=>{
  if(!/ useMode /.test(s)) s=s.replace('import { ModeProvider } from "./context/ModeContext.jsx";','import { ModeProvider } from "./context/ModeContext.jsx";\nimport { useMode } from "./context/ModeContext.jsx";');
  if(!/FuturistToggle/.test(s) && /components\/FuturistToggle\.jsx/.test(s)===false) s = s.replace(/(^import .*?\n)(?!.*FuturistToggle)/m, '$1'+'import FuturistToggle from "./components/FuturistToggle.jsx";\n');
  if(!/data-compact=/.test(s)) s=s.replace('<div className="min-h-dvh">','<div className="min-h-dvh" data-compact={useMode().compact ? "" : undefined}>');
  if(!/<FuturistToggle\s*\/>/.test(s)){
    if(/<\/header>/.test(s)) s=s.replace(/<\/header>/, '</header>\n      <FuturistToggle />');
    else s=s.replace('<div className="min-h-dvh"', '<div className="min-h-dvh">\n      <FuturistToggle />');
  }
  s=s.replace(/<Badges[^>]*\/>\s*/g,'');
  s=s.replace(/<div className="mb-8">\s*<SkillOrbit\s*\/>\s*<\/div>\s*/g,'');
  // also strip any bare SkillOrbit inside PROFILE block only
  s=s.replace(/(<CollapsibleSection[^>]+id=["']profile["'][\s\S]*?)<SkillOrbit\s*\/>([\s\S]*?<\/CollapsibleSection>)/, '$1$2');
  if(!/id=["']system-map["']/.test(s)){
    const section = '\n\n<CollapsibleSection id="system-map" title="SYSTEM MAP" defaultOpen={false} data-section="system-map">\n  <SystemMap />\n</CollapsibleSection>\n';
    if(/<\/CollapsibleSection>\s*\n\s*\/\*\s*STATS\s*\*\//.test(s)){
      s=s.replace(/<\/CollapsibleSection>\s*\n\s*\/\*\s*STATS\s*\*\//, m=>'</CollapsibleSection>'+section+'\n/* STATS */');
    } else if(/(<CollapsibleSection[^>]+id=["']profile["'][\s\S]*?<\/CollapsibleSection>)/.test(s)){
      s=s.replace(/(<CollapsibleSection[^>]+id=["']profile["'][\s\S]*?<\/CollapsibleSection>)/, '$1'+section);
    }
    if(!/import SystemMap/.test(s)) s=s.replace('import SpatialGrid from "./components/SpatialGrid.jsx";','import SpatialGrid from "./components/SpatialGrid.jsx";\nimport SystemMap from "./components/SystemMap.jsx";');
  }
  return s;
});

// --- 2) FuturistToggle.jsx: bottom-left, round, aligned
if(fs.existsSync('src/components/FuturistToggle.jsx')){
  edit('src/components/FuturistToggle.jsx',(s)=>{
    s=s.replace(/className=\{[\s\S]*?\}/, match=>{
      const base = 'className={' +
        '"fixed z-40 left-4 bottom-4 md:left-6 md:bottom-6 ' +
        'grid place-items-center w-10 h-10 md:w-11 md:h-11 rounded-full ' +
        'bg-slate-800/90 border border-white/15 backdrop-blur shadow-lg ' +
        'hover:bg-slate-800/80"' +
      '}';
      return base;
    });
    return s;
  });
}

// --- 3) Make Contact button icon-only anywhere it says “Contact” next to a Mail icon
function iconOnlyContactIn(file){
  if(!fs.existsSync(file)) return;
  edit(file,(s)=>{
    s=s.replace(/(<a[^>]*>[\s\S]*?<Mail[^>]*>)[\s\S]*?Contact([\s\S]*?<\/a>)/g, '$1$2');
    s=s.replace(/(<button[^>]*>[\s\S]*?<Mail[^>]*>)[\s\S]*?Contact([\s\S]*?<\/button>)/g, '$1$2');
    return s;
  });
}
const walk=(d)=>fs.readdirSync(d).flatMap(n=>{
  const p=d+'/'+n; const st=fs.statSync(p);
  if(st.isDirectory()) return walk(p);
  return /\.jsx?$/.test(p)?[p]:[];
});
walk('src').forEach(f=>iconOnlyContactIn(f));

// --- 4) Ensure compact CSS exists
edit('src/index.css',(c)=>{
  if(!/\[data-compact\]/.test(c)){
    c += '\n[data-compact] .section{padding-top:1.25rem;padding-bottom:1.25rem}\n[data-compact] .compact-hidden{display:none!important}\n[data-compact] .container{max-width:980px}\n';
  }
  return c;
});

console.log('OK');
