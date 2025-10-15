import React, { useMemo, useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, FeatureGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { accounts as raw } from "../data/accounts.js";

const STATUS_COLOR = { active: "#34d399", pilot: "#60a5fa", poc: "#f59e0b" };

export default function WorldMap(){
  const [filter, setFilter] = useState("all");
  const data = useMemo(() => raw.filter(a => filter==="all" ? true : a.status===filter), [filter]);
  const fgRef = useRef(null);

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg || !fg.getBounds) return;
    const b = fg.getBounds();
    if (b.isValid() && fg._map) fg._map.fitBounds(b.pad(0.3));
  }, [data.length]);

  return (
    <div className="card p-3 md:p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg tracking-wide">Worldwide Presence</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="opacity-70">Filter:</span>
          {["all","active","pilot","poc"].map(k=>(
            <button
              key={k}
              onClick={()=>setFilter(k)}
              className={"px-3 py-1 rounded-full border " + (filter===k ? "border-white/40" : "border-white/15 opacity-80")}
              title={k}
            >
              <span className="inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle"
                    style={{background: k==="all"?"linear-gradient(90deg,#34d399,#60a5fa,#f59e0b)":STATUS_COLOR[k]}} />
              {k.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[420px] md:h-[520px] rounded-xl overflow-hidden">
        <MapContainer center={[20,0]} zoom={2} scrollWheelZoom={false} style={{height:"100%",width:"100%"}}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FeatureGroup ref={fgRef}>
            {data.map((a,i)=>(
              <CircleMarker
                key={i}
                center={[a.lat,a.lon]}
                radius={7}
                pathOptions={{color: STATUS_COLOR[a.status] || "#a3a3a3", weight: 2, fillOpacity: 0.25}}
              >
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">{a.name}</div>
                    <div className="opacity-70 text-xs">{a.country}</div>
                    <div className="text-xs"><em>{a.focus}</em></div>
                    <div className="text-xs opacity-70">Status: {a.status}</div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </FeatureGroup>
        </MapContainer>
      </div>

      <p className="opacity-70 text-sm text-center">
        Tip: filter by stage; click a pin for details.
      </p>
    </div>
  );
}
