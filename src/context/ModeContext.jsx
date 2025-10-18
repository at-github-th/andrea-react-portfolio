import { createContext, useContext, useEffect, useMemo, useState } from "react";
const ModeContext = createContext({ futurist:false, setFuturist:()=>{} });
export const useMode = () => useContext(ModeContext);
export default function ModeProvider({ children }) {
  const [futurist, setFuturist] = useState(false);
  useEffect(()=>{ const root=document.documentElement; futurist?root.classList.add("futurist"):root.classList.remove("futurist"); },[futurist]);
  const value = useMemo(()=>({ futurist, setFuturist }), [futurist]);
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}
