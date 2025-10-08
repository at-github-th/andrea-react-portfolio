document.addEventListener('click',(e)=>{
  const hit = e.target.closest('#summary .grid > *, #summary [class*="stat"], #summary [class*="card"], #summary [class*="metric"], #summary button');
  if(!hit) return;
  const chart = document.querySelector('#summary-chart') ||
                document.querySelector('#summary svg, #summary canvas');
  if(chart) chart.scrollIntoView({behavior:'smooth', block:'center'});
});
