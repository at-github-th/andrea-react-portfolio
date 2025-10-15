import React from "react";
import { accounts } from "../data/accounts";

function uniqCountries(list){
  const m=new Map();
  list.forEach(a=>m.set(a.country,(m.get(a.country)||0)+1));
  return [...m.entries()].map(([country,count])=>({country,count}));
}

export default function CountryPills(){
  const countries=uniqCountries(accounts).sort((a,b)=>a.country.localeCompare(b.country));
  const focus=(country)=>{
    window.dispatchEvent(new CustomEvent("focus-country",{detail:{country}}));
    const sec=document.getElementById("worldmap");
    if(sec) sec.scrollIntoView({behavior:"smooth",block:"center"});
  };
  return (
    <div className="section">
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
        {countries.map(c=>(
          <button
            key={c.country}
            type="button"
            onClick={()=>focus(c.country)}
            className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-sm hover:border-white/35 hover:bg-white/10 transition shadow-sm"
            aria-label={`Focus ${c.country}`}
            title={`${c.country} (${c.count})`}
          >
            {c.country}
            <span className="ml-1 text-xs opacity-70">{c.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
