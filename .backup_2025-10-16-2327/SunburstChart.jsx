import React, { useEffect, useMemo, useRef, useCallback } from "react";
import * as echarts from "echarts";

export default function SunburstChart({ title = "Stats", subtitle = "", data = [] }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  const isMobile = typeof window !== "undefined" ? window.innerWidth < 640 : false;

  // Normalize series data; carry meta through
  const seriesData = useMemo(() => {
    const norm = (n) => ({
      name: n.name,
      value:
        n.value ??
        (Array.isArray(n.children) ? n.children.reduce((s, c) => s + (c.value || 0), 0) : 0),
      meta: n.meta || {},
      children: (n.children || []).map(norm),
    });
    return (data || []).map(norm);
  }, [data]);

  // Find node id by label path (["A","B"])
  const makePathFinder = useCallback(() => {
    if (!chartRef.current) return null;
    const model = chartRef.current.getModel?.();
    const series = model?.getSeriesByIndex?.(0);
    const tree = series?.getData?.()?.tree;
    if (!tree) return null;

    return (path = []) => {
      let node = tree.root;
      for (const name of path) {
        node = (node?.children || []).find(
          (n) => (n.name || "").toLowerCase() === String(name).toLowerCase()
        );
        if (!node) return null;
      }
      return node.getId ? node.getId() : node.dataIndex;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = (chartRef.current = echarts.init(containerRef.current, null, {
      renderer: "svg",                            // crisp text
      devicePixelRatio: Math.max(window.devicePixelRatio || 1, 2),
    }));

    const innerLabel = {
      show: true,
      position: "inside",
      rotate: 0,
      color: "#e5e7eb",
      fontWeight: 600,
      fontSize: isMobile ? 10 : 12,
      overflow: "break",
      width: isMobile ? 60 : 90,
      lineHeight: isMobile ? 12 : 16,
    };

    const outerLabel = {
      show: true,
      position: "inside",                        // keep labels inside the arc
      rotate: "tangential",
      color: "#e5e7eb",
      fontSize: isMobile ? 10 : 12,
      overflow: "break",                         // wrap, no ellipses
      width: isMobile ? 70 : 110,
      lineHeight: isMobile ? 12 : 16,
    };

    const option = {
      backgroundColor: "transparent",
      title: {
        text: title,
        left: "center",
        top: isMobile ? 28 : 18,
        textStyle: { color: "#cbd5e1", fontSize: isMobile ? 14 : 16, fontWeight: 700 },
      },
      tooltip: {
        trigger: "item",
        confine: true,
        appendToBody: true,
        backgroundColor: "rgba(8,12,22,0.92)",
        borderColor: "rgba(148,163,184,0.25)",
        borderWidth: 1,
        textStyle: { color: "#e5e7eb", fontSize: 12 },
        formatter: (p) => {
          const d = p.data || {};
          const m = d.meta || {};
          const unit = m.unit || "projects";
          const skills = Array.isArray(m.skills) ? m.skills.join(", ") : (m.skills || "");
          const next =
            (Array.isArray(m.upskilling) && m.upskilling[0]) || m.next || "";
          const name = echarts.format.encodeHTML(d.name || "");
          const count = echarts.format.encodeHTML(String(p.value ?? 0));
          return `
            <div style="padding:8px 10px;max-width:240px">
              <div style="font-weight:700;margin-bottom:2px">${name}</div>
              <div style="opacity:.9;margin-bottom:4px">${count} ${unit}</div>
              ${skills ? `<div style="font-style:italic;opacity:.95">${echarts.format.encodeHTML(skills)}</div>` : ""}
              ${next ? `<div style="margin-top:4px;opacity:.85"><b>Next:</b> ${echarts.format.encodeHTML(next)}</div>` : ""}
            </div>
          `;
        },
      },
      series: [
        {
          type: "sunburst",
          radius: isMobile ? ["28%", "68%"] : ["26%", "74%"],
          sort: undefined,
          data: seriesData,
          minAngle: 6,                            // keep tiny slices from showing labels
          labelLine: { show: false },             // no leader lines (keeps things tidy)
          itemStyle: { borderColor: "rgba(255,255,255,0.12)", borderWidth: 1 },
          emphasis: {
            focus: "ancestor",
            label: { fontWeight: 700 },
          },
          labelLayout: {
            hideOverlap: true,
            moveOverlap: "shiftY",
          },
          levels: [
            {}, // root
            // ring 1 (inner categories)
            {
              r0: "26%",
              r: "46%",
              label: innerLabel,
              itemStyle: { borderWidth: 1 },
            },
            // ring 2 (outer categories)
            {
              r0: "46%",
              r: "68%",
              label: outerLabel,
              itemStyle: { borderWidth: 1 },
            },
          ],
          animation: true,
          animationDuration: 400,
          animationEasing: "cubicOut",
        },
      ],
    };

    chart.setOption(option, { notMerge: true });

    const publish = (node) => {
      try {
        const path = node.getPath().map((n) => n.name).slice(1);
        const model = node.getModel ? node.getModel() : null;
        const d = model ? model.get("data") : null;
        const meta = d && d.meta ? d.meta : {};
        window.dispatchEvent(new CustomEvent("stats:focus", { detail: { path, meta } }));
      } catch {}
    };

    // click to drill + publish
    chart.on("click", (params) => {
      const node = params.dataNode;
      if (!node) return;
      const id = node.getId ? node.getId() : null;
      if (id != null) {
        chart.dispatchAction({ type: "sunburstHighlight", targetNodeId: id });
        chart.dispatchAction({ type: "sunburstRootToNode", targetNodeId: id });
        publish(node);
      }
    });

    // external focus from "See chart"
    const onFocus = (e) => {
      chart.dispatchAction({ type: "hideTip" }); // ensure tooltips are gone first
      const path = e.detail?.path || [];
      const getId = makePathFinder();
      const nodeId = getId?.(path);
      if (nodeId == null) return;
      chart.dispatchAction({ type: "sunburstHighlight", targetNodeId: nodeId });
      chart.dispatchAction({ type: "sunburstRootToNode", targetNodeId: nodeId });

      try {
        const series = chart.getModel().getSeriesByIndex(0);
        const node = series.getData().tree.getNodeById(nodeId);
        if (node) publish(node);
      } catch {}
      setTimeout(() => chart.resize(), 40);
    };
    window.addEventListener("stats-chart:focus", onFocus);

    // hide tooltip on external request (e.g., opening modal)
    const onHideTip = () => chart.dispatchAction({ type: "hideTip" });
    window.addEventListener("stats:hide-tooltips", onHideTip);

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);

    // deep-link (#chart=A.B)
    const m = typeof location !== "undefined" && location.hash.match(/^#chart=(.+)$/);
    if (m) {
      const path = decodeURIComponent(m[1]).split(".");
      onFocus({ detail: { path } });
    }

    return () => {
      window.removeEventListener("stats-chart:focus", onFocus);
      window.removeEventListener("stats:hide-tooltips", onHideTip);
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, [seriesData, title, isMobile, makePathFinder]);

  const exportPNG = () => {
    if (!chartRef.current) return;
    const url = chartRef.current.getDataURL({
      type: "png",
      pixelRatio: 2,
      backgroundColor: "#0b1220",
    });
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart.png";
    a.click();
  };

  const exportSVG = () => {
    if (!chartRef.current) return;
    const url = chartRef.current.getDataURL({
      type: "svg",
      pixelRatio: 2,
      backgroundColor: "#0b1220",
    });
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart.svg";
    a.click();
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
      <div ref={containerRef} style={{ height: "420px" }} />
    </div>
  );
}
