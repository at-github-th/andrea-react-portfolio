(function(){
  var once=false, minA=180*180; // area threshold (px^2) to skip small icons
  function area(el){ var r=el.getBoundingClientRect(); return r.width*r.height; }
  function hide(){
    var root=document.querySelector('[data-section="profile"]');
    if(!root) return;
    var svgs=[].slice.call(root.querySelectorAll('svg'));
    if(!svgs.length) return;
    // find the biggest svg in PROFILE (the orbit), ignore tiny icons
    var big=svgs.filter(function(s){return area(s)>minA;})
                .sort(function(a,b){return area(b)-area(a)})[0];
    if(!big) return;
    if(big.dataset._orbitHidden==="1") return;
    var wrap=big.closest('div')||big;
    wrap.style.display='none';
    big.dataset._orbitHidden='1';
    once=true;
  }
  // run on load and whenever DOM mutates (accordion opens/resizes)
  var runLoop=function tries(){
    hide(); if(!once) requestAnimationFrame(tries);
  };
  if(document.readyState!=="loading") runLoop();
  else document.addEventListener("DOMContentLoaded", runLoop);

  var mo=new MutationObserver(function(){ setTimeout(hide, 50); });
  mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true});

  // tap clicks on accordion toggles
  document.addEventListener("click",function(e){
    var t=e.target;
    if(t && (t.matches('[data-toggle]') || (t.closest && t.closest('[data-toggle]')))){
      setTimeout(hide, 60);
    }
  },true);
})();
