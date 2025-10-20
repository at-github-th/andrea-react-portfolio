const fs=require('node:fs'); const f='src/App.jsx';
let s=fs.readFileSync(f,'utf8'); const orig=s;

// ensure useMode import exists
if(!/import\s*\{\s*useMode\s*\}\s*from\s*"\.\/context\/ModeContext\.jsx"/.test(s)){
  const firstImportBlockEnd = s.indexOf('\n', s.indexOf('import '));
  s = 'import { useMode } from "./context/ModeContext.jsx";\n' + s;
}

// ensure FuturistToggle import exists
if(!/import\s+FuturistToggle\s+from\s*"\.\/components\/FuturistToggle\.jsx"/.test(s)){
  s = 'import FuturistToggle from "./components/FuturistToggle.jsx";\n' + s;
}

// ensure SystemMap import exists if section present
if(/id=["']system-map["']/.test(s) && !/import\s+SystemMap\s+from\s*"\.\/components\/SystemMap\.jsx"/.test(s)){
  s = s.replace('import SpatialGrid from "./components/SpatialGrid.jsx";',
                'import SpatialGrid from "./components/SpatialGrid.jsx";\nimport SystemMap from "./components/SystemMap.jsx";');
}

// ensure data-compact attribute is present
if(!/data-compact=/.test(s)){
  s = s.replace('<div className="min-h-dvh">',
                '<div className="min-h-dvh" data-compact={useMode().compact ? "" : undefined}>');
}

if(s!==orig){ fs.writeFileSync(f,s,'utf8'); console.log('patched App.jsx'); } else { console.log('no change'); }
