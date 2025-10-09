import React, { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";

export default function SunburstChart({ title="Stats", subtitle="", data=[] }){
  const ref = useRef(null);
  const chartRef = useRef(null);
  const prefersReduced = typeof window!=="undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const seriesData = useMemo(()=>{
    // Convert flat array with children into ECharts sunburst
    return data.map(node=>({
      name: node.name,
      value: node.value ?? (node.children||[]).reduce((a,b)=>a+(b.value||0),0),
      children: (node.children||[]).map(ch=>({ name: ch.name, value: ch.value }))
    }));
  },[data]);

  useEffect(()=>{
    if(!ref.current) return;
    chartRef.current = echarts.init(ref.current, null, {renderer:"canvas"});
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
        itemStyle:{
          borderColor: "rgba(255,255,255,0.15)",
          borderWidth: 1
        }
      }],
    };

    chart.setOption(option);

    chart.on("click", params=>{
      chart.dispatchAction({
        type:"sunburstHighlight", targetNodeId: params.dataNode?.getId?.()
      });
      chart.dispatchAction({ type: "sunburstRootToNode", targetNodeId: params.dataNode?.getId?.() });
    });

    const onResize=()=>chart.resize();
    window.addEventListener("resize", onResize);
    return ()=>{ window.removeEventListener("resize", onResize); chart.dispose(); };
  },[seriesData, title, prefersReduced]);

  const exportPNG = ()=> {
    if(!chartRef.current) return;
    const url = chartRef.current.getDataURL({ type:"png", pixelRatio:2, backgroundColor:"#0b1220" });
    const a = document.createElement("a"); a.href=url; a.download="chart.png"; a.click();
  };
  const exportSVG = ()=> {
    if(!chartRef.current) return;
    const url = chartRef.current.getDataURL({ type:"svg", pixelRatio:2, backgroundColor:"#0b1220" });
    const a = document.createElement("a"); a.href=url; a.download="chart.svg"; a.click();
  };

  return (
    <div className="card rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="opacity-80 text-sm">{subtitle}</div>
        <div className="flex gap-2">
          <button className="btn" onClick={exportPNG}>Export PNG</button>
          <button className="btn" onClick={exportSVG}>Export SVG</button>
        </div>
      </div>
      <div ref={ref} style={{height:"420px"}} />
    </div>
  );
}
