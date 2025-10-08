import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

export default function SunburstChart({
  title = "Profile Mix",
  subtitle = "Click slices to drill. Reset to zoom out.",
  data = []
}) {
  const elRef = useRef(null);
  const chartRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!elRef.current) return;
    const reduceMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const chart = echarts.init(elRef.current, null, { renderer: "canvas" });
    chartRef.current = chart;

    const option = {
      backgroundColor: "transparent",
      title: [
        { text: title, left: "center", top: 0, textStyle: { color: "#e7f3ff", fontSize: 16, letterSpacing: 2 } },
        { text: subtitle, left: "center", top: 24, textStyle: { color: "rgba(231,243,255,0.6)", fontSize: 12 } }
      ],
      series: [{
        type: "sunburst",
        radius: ["12%", "80%"],
        sort: undefined,
        nodeClick: "zoomToNode",
        emphasis: { focus: "ancestor" },
        data,
        levels: [
          {},
          { r0: "12%", r: "32%", label: { rotate: "tangential" } },
          { r0: "32%", r: "56%", label: { rotate: "tangential" } },
          { r0: "56%", r: "80%", label: { rotate: "tangential" } }
        ],
        label: { color: "#bfeaff", fontSize: 10 },
        itemStyle: {
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.15)"
        },
        highlightPolicy: "descendant",
        animation: !reduceMotion,
        animationDuration: reduceMotion ? 0 : 800,
        animationEasing: "cubicOut"
      }],
      tooltip: { trigger: "item", formatter: ({treePathInfo, value}) => {
        const path = treePathInfo?.slice(1).map(n=>n.name).join(" ▸ ") || "";
        const v = typeof value === "number" ? value : value?.value;
        return `<div style="padding:4px 6px">${path}<br/><b>${v ?? ""}</b></div>`;
      }},
      visualMap: null
    };

    chart.setOption(option);

    chart.on("highlight", () => {});
    chart.on("mouseover", params => {
      if (params && params.treePathInfo) {
        chart.dispatchAction({ type: "downplay" });
        chart.dispatchAction({ type: "highlight", dataIndex: params.dataIndex });
      }
    });

    setReady(true);
    const handle = () => { chart.resize(); };
    window.addEventListener("resize", handle);
    return () => { window.removeEventListener("resize", handle); chart.dispose(); chartRef.current = null; };
  }, [data, title, subtitle]);

  const download = (type) => {
    if (!chartRef.current) return;
    const dataURL = chartRef.current.getDataURL({ type, pixelRatio: 2, backgroundColor: "#0b1423" });
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = type === "png" ? "summary-chart.png" : "summary-chart.svg";
    a.click();
  };

  const resetZoom = () => {
    if (!chartRef.current) return;
    chartRef.current.clear();
    chartRef.current.setOption(chartRef.current.getOption()); // reset to last option
  };

  return (
    <div className="card p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm opacity-75">What this means: hover to inspect; click to zoom; Reset to return.</div>
        <div className="flex gap-2">
          <button onClick={()=>download("png")} className="btn">Export PNG</button>
          <button onClick={()=>download("svg")} className="btn">Export SVG</button>
          <button onClick={resetZoom} className="btn">Reset</button>
        </div>
      </div>
      <div ref={elRef} style={{width:"100%", height: 420}} />
      {!ready && <div className="text-center text-sm opacity-60 mt-2">Loading chart…</div>}
    </div>
  );
}
