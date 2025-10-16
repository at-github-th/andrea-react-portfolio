// src/components/WorldMap.jsx
import L from "leaflet";
import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, FeatureGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { accounts as raw } from "../data/accounts.js";

const STATUS_COLOR = { active: "#34d399", pilot: "#60a5fa", poc: "#f59e0b" };

export default function WorldMap() {
  const [map, setMap] = useState(null);
  const [filter, setFilter] = useState("all");

  // reactive mobile flag
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const data = useMemo(
    () => (Array.isArray(raw) ? raw : []).filter(a => (filter === "all" ? true : a.status === filter)),
    [filter]
  );

  const fgRef = useRef(null);

  // ---- padded fitBounds to avoid edge clipping (mobile vs desktop) ----
  const fitToData = useCallback(() => {
    const fg = fgRef.current;
    if (!fg || !fg.getBounds || !fg._map) return;
    const b = fg.getBounds();
    if (!b.isValid()) return;

    if (isMobile) {
      // extra bottom-right padding for attribution + FAB
      fg._map.fitBounds(b, {
        paddingTopLeft: L.point(16, 16),
        paddingBottomRight: L.point(16, 140),
        maxZoom: 4,
      });
    } else {
      fg._map.fitBounds(b, {
        padding: L.point(40, 40),
        maxZoom: 4,
      });
    }
  }, [isMobile]);

  useEffect(() => { fitToData(); }, [data.length, fitToData]);

  // ensure Leaflet sizes correctly after mount/orientation change
  useEffect(() => {
    if (!map) return;
    let t;
    const reflow = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        map.invalidateSize();
        fitToData();
      }, 120);
    };
    reflow(); // first mount
    window.addEventListener("resize", reflow);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", reflow);
    };
  }, [map, fitToData]);

  // External "focus-country" -> padded fitBounds + open popups in bounds
  useEffect(() => {
    if (!map) return;
    const handler = (ev) => {
      const country = ev.detail?.country;
      if (!country) return;
      const subset = (Array.isArray(raw) ? raw : []).filter(a => a.country === country);
      if (!subset.length) return;

      const b = L.latLngBounds(subset.map(a => [a.lat, a.lon]));
      if (!b.isValid()) return;

      if (isMobile) {
        map.fitBounds(b, {
          paddingTopLeft: L.point(16, 16),
          paddingBottomRight: L.point(16, 140),
          maxZoom: 4,
        });
      } else {
        map.fitBounds(b, {
          padding: L.point(40, 40),
          maxZoom: 4,
        });
      }

      setTimeout(() => {
        map.eachLayer(layer => {
          if (layer.getLatLng && b.contains(layer.getLatLng())) {
            layer.openPopup?.();
          }
        });
      }, 350);
    };

    window.addEventListener("focus-country", handler);
    return () => window.removeEventListener("focus-country", handler);
  }, [map, isMobile]);

  return (
    <div className="card p-3 md:p-4 space-y-3">
    <div className="flex flex-col gap-2">
      <h3 className="text-lg tracking-wide">Worldwide Presence</h3>

      {/* 4 equal-width chips, no scrolling */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {["all","active","pilot","poc"].map(k => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            aria-pressed={filter === k}
            className={
              "flex items-center justify-center gap-1 text-xs px-2 py-1 rounded-full border transition " +
              (filter === k ? "border-white/40" : "border-white/15 opacity-80 hover:opacity-100")
            }
            title={k}
          >
            <span
              style={{
                width: 6, height: 6, borderRadius: 9999,
                background: k === "all"
                  ? "linear-gradient(90deg,#34d399,#60a5fa,#f59e0b)"
                  : STATUS_COLOR[k]
              }}
            />
            {k.toUpperCase()}
          </button>
        ))}
      </div>
    </div>



      {/* fixed-height wrapper; Leaflet fills it */}
      <div className="w-full h-[420px] md:h-[520px] rounded-xl overflow-hidden">
        <MapContainer
          center={[20,0]}
          zoom={2}
          minZoom={2}
          maxZoom={7}
          scrollWheelZoom={false}
          style={{height:"100%",width:"100%"}}
          whenCreated={setMap}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FeatureGroup ref={fgRef}>
            {data.map((a,i)=>(
              <CircleMarker
                key={`${a.name}-${i}`}
                center={[a.lat,a.lon]}
                radius={7}
                pathOptions={{ color: STATUS_COLOR[a.status] || "#a3a3a3", weight: 2, fillOpacity: 0.25 }}
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
