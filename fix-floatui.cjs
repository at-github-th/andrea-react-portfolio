const fs=require('node:fs');const f='src/components/FloatUI.jsx';let s=fs.readFileSync(f,'utf8'),t=s;
t=t.replace(/(<Mail[^>]*\/>)\s*<\/span>/g,'$1');
t=t.replace(/<span[^>]*>\s*Contact\s*<\/span>/g,'');
t=t.replace(/<div className=["']flex items-center gap-2["']>\s*(<Mail[^>]*\/>)\s*<\/div>/g,'<div className="grid place-items-center w-5 h-5">$1</div>');
t=t.replace(/<span[^>]*>\s*<\/span>/g,'');
t=t.replace(/<Mail([^>]*)><\/Mail>/g,'<Mail$1 />');
if(t!==s){fs.writeFileSync(f,t,'utf8');console.log('patched FloatUI.jsx');}else{console.log('no change');}
