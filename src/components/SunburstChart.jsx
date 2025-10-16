import React, { useEffect, useMemo, useRef, useCallback } from "react";
import * as echarts from "echarts";

export default function SunburstChart({ title="Stats", subtitle="", data=[] }){
  const ref = useRef(null);
  const chartRef = useRef(null);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ECharts series data
  const seriesData = useMemo(() => {
    return data.map(node => ({
      name: node.name,
      value: node.value ?? (node.children || []).reduce((a,b)=>a+(b.value||0),0),
      children: (node.children || []).map(ch => ({ name: ch.name, value: ch.value }))
    }));
  }, [data]);

  // Utility: find a nodeId by a path of names (e.g., ["Solutions","Presales"])
  const findNodeIdByPath = useCallback(() => {
    if (!chartRef.current) return null;
    const model = chartRef.current.getModel?.();
    const series = model?.getSeriesByIndex?.(0);
    const tree = series?.getData?.()?.tree;
    if (!tree) return null;

    return (path=[]) => {
      let node = tree.root;
      for (const name of path) {
        const next = (node.children || []).find(n => (n.name || "").toLowerCase() === name.toLowerCase());
        if (!next) return null;
        node = next;
      }
      // Prefer ECharts node id, fallback to dataIndex
      return node.getId ? node.getId() : node.dataIndex;
    };
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    chartRef.current = echarts.init(ref.current, null, { renderer: "canvas" });
    const chart = chartRef.current;

    const option = {
      title: { text: title, left: "center", top: 0, textStyle:{ fontSize: 16 } },
      tooltip: { trigger: "item", formatter: p => `${p.name}: ${p.value}` },
      series: [{
        type: "sunburst",
        radius: ["15%","80%"],
        data: seriesData,
        sort: undefined,
        emphasis: { focus: "ancestor" },
        levels: [
          {},
          { r0: "15%", r: "40%", itemStyle:{ borderWidth:1 }, label:{ rotate:"tangential" } },
          { r0: "40%", r: "65%", itemStyle:{ borderWidth:1 }, label:{ rotate:"tangential" } },
          { r0: "65%", r: "80%", itemStyle:{ borderWidth:1 }, label:{ rotate:"tangential" } },
        ],
        animation: !prefersReduced,
        animationDuration: prefersReduced ? 0 : 600,
        animationEasing: "cubicOut",
        itemStyle:{ borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }
      }],
    };

    chart.setOption(option);

    // click-to-drill
    chart.on("click", params => {
      const id = params.dataNode?.getId?.();
      if (id != null) {
        chart.dispatchAction({ type: "sunburstHighlight", targetNodeId: id });
        chart.dispatchAction({ type: "sunburstRootToNode", targetNodeId: id });
      }
    });

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);

    // Listen for external focus requests: { detail: { path: ["Solutions","Presales"] } }
    const focusHandler = (e) => {
      const path = e.detail?.path || [];
      if (!Array.isArray(path) || path.length === 0) return;
      const getId = findNodeIdByPath();
      const nodeId = getId?.(path);
      if (nodeId == null) return;
      chart.dispatchAction({ type: "sunburstHighlight", targetNodeId: nodeId });
      chart.dispatchAction({ type: "sunburstRootToNode", targetNodeId: nodeId });
      // ensure visible after state change
      setTimeout(() => chart.resize(), 50);
    };
    window.addEventListener("stats-chart:focus", focusHandler);

    // Deep-link on first load if location hash present: #chart=Solutions.Presales
    const tryHash = () => {
      const m = location.hash.match(/^#chart=(.+)$/);
      if (!m) return;
      const path = decodeURIComponent(m[1]).split(".");
      focusHandler({ detail: { path } });
    };
    tryHash();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("stats-chart:focus", focusHandler);
      chart.dispose();
    };
  }, [seriesData, title, prefersReduced, findNodeIdByPath]);

  const exportPNG = () => {
    if (!chartRef.current) return;
    const url = chartRef.current.getDataURL({ type:"png", pixelRatio:2, backgroundColor:"#0b1220" });
    const a = document.createElement("a"); a.href = url; a.download = "chart.png"; a.click();
  };
  const exportSVG = () => {
    if (!chartRef.current) return;
    const url = chartRef.current.getDataURL({ type:"svg", pixelRatio:2, backgroundColor:"#0b1220" });
    const a = document.createElement("a"); a.href = url; a.download = "chart.svg"; a.click();
  };

  return (
    <div className="card rounded-xl p-4" id="stats-chart">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="opacity-80 text-sm">{subtitle}</div>
        <div className="flex gap-2">
          <button className="btn" onClick={exportPNG}>Export PNG</button>
          <button className="btn" onClick={exportSVG}>Export SVG</button>
        </div>
      </div>
      <div ref={ref} style={{ height: "420px" }} />
    </div>
  );
}
