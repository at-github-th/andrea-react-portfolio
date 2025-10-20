import { createContext, useContext, useMemo, useState } from "react";

const ModeCtx = createContext(null);

export function ModeProvider({ children }) {
  const [compact, setCompact] = useState(false);
  const [futurist, setFuturist] = useState(false);
  const value = useMemo(
    () => ({
      compact,
      setCompact,
      toggle: () => setCompact(v => !v),
      futurist,
      setFuturist,
      toggleFuturist: () => setFuturist(v => !v),
    }),
    [compact, futurist]
  );
  return <ModeCtx.Provider value={value}>{children}</ModeCtx.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeCtx);
  if (!ctx) throw new Error("useMode must be used within <ModeProvider>");
  return ctx;
}
