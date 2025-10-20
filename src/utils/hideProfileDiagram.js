export function hideProfileDiagram() {
  const sec = document.querySelector('[data-section="profile"]');
  if (!sec) return;
  const svgs = Array.from(sec.querySelectorAll('svg'))
    .filter(s => s.getBoundingClientRect().width > 300 && s.getBoundingClientRect().height > 200);
  if (svgs[0]) {
    const wrap = svgs[0].closest('div') || svgs[0];
    wrap.style.display = 'none';
    wrap.setAttribute('data-hidden', 'profile-orbit');
  }
}
