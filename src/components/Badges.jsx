export default function Badges({ items=[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {items.map(t=>(
        <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-slate-600/60 text-slate-300/90 hover:shadow-neon hover:border-cyan-400/70 transition select-none">{t}</span>
      ))}
    </div>
  );
}
