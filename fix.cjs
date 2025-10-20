const fs = require('node:fs');
const path = require('node:path');

function read(p){return fs.readFileSync(p,'utf8')}
function write(p,s){fs.writeFileSync(p,s,'utf8')}
function exists(p){return fs.existsSync(p)}
function grep(dir, re, out=[]){
  for(const e of fs.readdirSync(dir)){ const p=path.join(dir,e);
    const st=fs.statSync(p);
    if(st.isDirectory()) grep(p,re,out);
    else if(/\.(jsx?|tsx?)$/.test(e)){
      const s=read(p); if(re.test(s)) out.push(p);
    }
  } return out;
}

let changed = [];

// 0) Locate App.jsx
const appFile = exists('src/App.jsx') ? 'src/App.jsx'
  : exists('src/App.tsx') ? 'src/App.tsx'
  : null;
if(!appFile){ console.error('Missing src/App.jsx'); process.exit(1); }

// 1) Wire compact on root + mount ONE toggle below header; remove Badges + SkillOrbit; add SystemMap section
{
  let s = read(appFile), orig = s;

  // imports
  if(!/from\s+"\.\/context\/ModeContext\.jsx"/.test(s))
    s = 'import { useMode } from "./context/ModeContext.jsx";\n' + s;
  else if(!/import\s*\{\s*useMode\s*\}/.test(s))
    s = s.replace(/import\s*\{\s*([^}]+)\}\s*from\s+"\.\/context\/ModeContext\.jsx";/,
                  (m,g)=>`import { ${g.replace(/\s/g,'')}, useMode } from "./context/ModeContext.jsx";`);

  if(!/import\s+FuturistToggle\s+from\s+"\.\/components\/FuturistToggle\.jsx"/.test(s) &&
     exists('src/components/FuturistToggle.jsx'))
    s = 'import FuturistToggle from "./components/FuturistToggle.jsx";\n' + s;

  if(!/import\s+SystemMap\s+from\s+"\.\/components\/SystemMap\.jsx"/.test(s) &&
     exists('src/components/SystemMap.jsx'))
    s = s.replace(/import\s+SpatialGrid.*?\n/,'$&' + 'import SystemMap from "./components/SystemMap.jsx";\n');

  // root data-compact
  if(!/data-compact=/.test(s))
    s = s.replace(/<div className=["']min-h-dvh["']>/,
                   '<div className="min-h-dvh" data-compact={useMode().compact ? "" : undefined}>');

  // mount ONE FuturistToggle after closing </header>
  if(/<\/header>/.test(s) && !/<FuturistToggle\s*\/>/.test(s))
    s = s.replace(/<\/header>/,'</header>\n      <FuturistToggle />');

  // remove profile Badges row and SkillOrbit if present
  s = s.replace(/<Badges[^>]*\/>\s*/g,'');
  s = s.replace(/<div className=["']mb-8["']>\s*<SkillOrbit\s*\/>\s*<\/div>\s*/g,'');
  s = s.replace(/<SkillOrbit\s*\/>\s*/g,'');

  // add SYSTEM MAP section if missing
  if(!/id=["']system-map["']/.test(s) && exists('src/components/SystemMap.jsx')){
    const insert = '\n\n<CollapsibleSection id="system-map" title="SYSTEM MAP" defaultOpen={false} data-section="system-map">\n  <SystemMap />\n</CollapsibleSection>\n';
    if(/\/\*\s*STATS\s*\*\//.test(s)) s = s.replace(/\/\*\s*STATS\s*\*\//, insert + '/* STATS */');
    else s += insert;
  }

  if(s!==orig){ write(appFile,s); changed.push(appFile); }
}

// 2) Place compact toggle bottom-left, round, aligned
{
  const f = 'src/components/FuturistToggle.jsx';
  if(exists(f)){
    let s = read(f), o=s;
    s = s.replace(/className=\{[\s\S]*?\}/,
      'className={"fixed z-40 left-4 bottom-4 md:left-6 md:bottom-6 grid place-items-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-800/90 border border-white/15 backdrop-blur shadow-lg hover:bg-slate-800/80"}'
    );
    if(s!==o){ write(f,s); changed.push(f); }
  }
}

// 3) Make every “Contact” chip/icon icon-only wherever Mail + Contact appear together
{
  const files = grep('src', /(Contact<\/|>Contact<|> Contact <|<Mail)/);
  for(const f of files){
    let s = read(f), o=s;
    // remove plain text Contact next to Mail icon
    s = s.replace(/(<Mail[^>]*\/>\s*)(?:<\/?span[^>]*>\s*)?Contact\b/g, '$1');
    // drop empty spans after removing text
    s = s.replace(/<span[^>]*>\s*<\/span>/g,'');
    if(s!==o){ write(f,s); changed.push(f); }
  }
}

// 4) Ensure compact CSS exists
{
  const f='src/index.css';
  if(exists(f)){
    let c=read(f), o=c;
    if(!/\[data-compact\]/.test(c)){
      c += '\n[data-compact] .section{padding-top:1.25rem;padding-bottom:1.25rem}\n[data-compact] .compact-hidden{display:none!important}\n[data-compact] .container{max-width:980px}\n';
    }
    if(!/\.corner-btn/.test(c)){
      c += '\n.corner-btn{width:2.5rem;height:2.5rem}@media(min-width:640px){.corner-btn{width:2.75rem;height:2.75rem}}\n';
    }
    if(c!==o){ write(f,c); changed.push(f); }
  }
}

console.log(JSON.stringify({changed},null,2));
