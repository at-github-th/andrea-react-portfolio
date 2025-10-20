export async function askAI(prompt){
  const url = import.meta.env.VITE_AI_ENDPOINT;
  const key = import.meta.env.VITE_AI_KEY;
  if(!url || !key){
    const canned = `Heuristic summary:\n- Query: ${prompt}\n- Related sections suggested: Architecture, Product, Core.\n- Tip: use "Open only this in classic" to deep dive.`;
    return { ok:true, text:canned };
  }
  try{
    const r = await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${key}` }, body: JSON.stringify({ prompt })});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    const j = await r.json();
    return { ok:true, text: j.text || JSON.stringify(j) };
  }catch(e){
    return { ok:false, text:`AI error: ${e.message}` };
  }
}
