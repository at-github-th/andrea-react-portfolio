export const SECTION_CONTENT = {
  profile: {
    strategy: "Positioning across domains; value narrative that bridges Architecture↔Product↔Engineering; executive framing.",
    story: "Pivoted a biomech R&D track into a client-facing SA motion, aligning KPIs to product discovery.",
    math: "North-star KPIs: LTV:CAC>3, cycle-time ↓35%, reliability SLO 99.9%; evidence via control charts.",
    tech: "React/Vite/Tailwind, services split (stats, skills, resume), SVG systems view; infra: edge-first static + API."
  },
  architecture: {
    strategy: "System design for scale: bounded contexts, async edges, zero-trust data flow, cost-aware resilience.",
    story: "Split monolith into 4 contexts; reduced p95 from 1.2s→280ms and infra spend −27% via cache + eventing.",
    math: "RPS budget 3k/s; p99<400ms; availability 99.95%; SQS depth ≤5k; error budget burn <2%.",
    tech: "APIs (REST/gRPC), idempotent workflows, CQRS where needed, S3+Athena data lake, IaC pipelines."
  },
  product: {
    strategy: "Dual-track: discovery (evidence) + delivery (commit); pricing experiments under guardrails.",
    story: "Launched risk-scored onboarding; conversion +18% with privacy-safe signals.",
    math: "Uplift via CUPED; power≥0.8; sample N per arm ≈ 8k; MDE 2.5%.",
    tech: "Feature flags, event bus, cohort service, experimentation SDK; observability wired to product metrics."
  },
  core: {
    strategy: "Performance/security/data as first-class; platform primitives that unblock teams.",
    story: "Edge caching + async enrichment; P95 cut 62% with zero UX regressions.",
    math: "Throughput T≈N*B*η; cache hit ≥85%; tail p99 tracked with HDR histogram.",
    tech: "WASM transforms, KV/Edge cache, background workers, structured logs with trace propagation."
  },
  engineering: {
    strategy: "Velocity with quality: trunk-based dev, CI gates, progressive delivery.",
    story: "CI time from 18→6 min; flaky tests ↓92%; on-call pages −48%.",
    math: "DORA: deploy freq daily, lead time <24h; change-fail <10%; MTTR <1h.",
    tech: "Playwright, contract tests, typed API client, preview env per PR, canary + metrics guard."
  },
  sales: {
    strategy: "Technical storytelling to economic value; discovery → ROI narrative → proof.",
    story: "Quant model showed $1.2M/yr infra savings; closed in 2 cycles with exec buy-in.",
    math: "ROI = (ΔGross Margin − ΔOPEX)/Investment; payback < 8 months.",
    tech: "Presales demos driven by real telemetry; secure sandboxes; red-team Q&A playbook."
  },
  stats: {
    strategy: "Decision science: experiment rigor, trustworthy dashboards, causal insights.",
    story: "Rebuilt funnel with event reliability SLA; exec adopted one-sheet metrics.",
    math: "Bayesian posterior for lift; sequential testing with alpha-spending; anomaly via STL+EWMA.",
    tech: "dbt lineage, metrics layer, alerting on data contracts, CDC to lake."
  }
};
export const QUICK_HINTS = {
  profile:["open architecture","classic profile","summarize profile","suggest"],
  architecture:["open product","classic architecture","summarize architecture","suggest"],
  product:["open stats","classic product","summarize product","suggest"],
  core:["open engineering","classic core","summarize core","suggest"],
  engineering:["open core","classic engineering","summarize engineering","suggest"],
  sales:["open stats","classic sales","summarize sales","suggest"],
  stats:["open product","classic stats","summarize stats","suggest"]
};
export const PHRASE_ROUTER = [
  { rx:/roi|business case|storytelling/i, target:"sales", cmd:"summarize sales" },
  { rx:/schema|system design|apis?/i, target:"architecture", cmd:"summarize architecture" },
  { rx:/pricing|roadmap|experiments?/i, target:"product", cmd:"summarize product" },
  { rx:/performance|security|infra|core/i, target:"core", cmd:"summarize core" },
  { rx:/devops|deploy|quality|tests?/i, target:"engineering", cmd:"summarize engineering" },
  { rx:/kpi|stats?|dashboards?|cohorts?/i, target:"stats", cmd:"summarize stats" }
];
