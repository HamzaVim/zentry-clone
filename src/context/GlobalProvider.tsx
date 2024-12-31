import { useState } from "react";
import { GlobalContext } from "./GlobalContext";

function GlobalProvider({ children }: GlobalProviderProps) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <GlobalContext.Provider value={{ isMuted, setIsMuted }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
