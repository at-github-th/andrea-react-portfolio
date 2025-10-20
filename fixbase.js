const fs=require('fs'),f='vite.config.js';
if(fs.existsSync(f)){
  let s=fs.readFileSync(f,'utf8');
  if(/export default/.test(s)){
    if(!/base:/.test(s)) s=s.replace(/export default\s*\{/,'export default { base: "/andrea-react-portfolio/",');
    else s=s.replace(/base:\s*["'][^"']+["']/, 'base: "/andrea-react-portfolio/"');
    fs.writeFileSync(f,s);
  }
}
