import React from "react";
import { accounts } from "../data/accounts";

function uniqCountries(list){
  const m = new Map();
  list.forEach(a => m.set(a.country, (m.get(a.country)||0)+1));
  return [...m.entries()].map(([country,count])=>({country,count}));
}

export default function CountryPills(){
  const countries = uniqCountries(accounts).sort((a,b)=>a.country.localeCompare(b.country));
  const focus = (country)=>{
    window.dispatchEvent(new CustomEvent("focus-country",{ detail:{ country } }));
  };
  return (
    <div className="country-pills-wrap">
      <div className="country-pills">
        {countries.map(c=>(
          <button key={c.country} type="button" onClick={()=>focus(c.country)}
                  className="pill" aria-label={`Focus ${c.country}`} title={`${c.country} (${c.count})`}>
            {c.country} <span className="count">{c.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
