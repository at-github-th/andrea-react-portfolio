(function(){
  const hide = () => {
    const root = document.querySelector('[data-section="profile"]');
    if(!root) return;
    const svgs = Array.from(root.querySelectorAll('svg'));
    if(!svgs.length) return;
    // find the largest svg (the orbit)
    const big = svgs.map(el=>[el, el.getBoundingClientRect()])
      .sort((a,b)=> (b[1].width*b[1].height)-(a[1].width*a[1].height))[0]?.[0];
    if(big && !big.dataset.hidden){
      const wrap = big.closest('div') || big;
      wrap.style.display = 'none';
      big.dataset.hidden = 'true';
    }
  };
  if(document.readyState === "complete" || document.readyState === "interactive") hide();
  else document.addEventListener("DOMContentLoaded", hide);
  // also try after route/accordion toggles
  document.addEventListener("click", (e)=> {
    const t = e.target;
    if(t && (t.matches("[data-toggle]") || t.closest("[data-toggle]"))) {
      setTimeout(hide, 50);
    }
  }, true);
})();
