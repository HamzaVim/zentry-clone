import { useState } from "react";
import { GlobalContext } from "./GlobalContext";

function GlobalProvider({ children }: GlobalProviderProps) {
  // When the site is muted
  const [isMuted, setIsMuted] = useState(true);

  // When the site is loading
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  // State for the music button if it's active
  const [musicActive, setMusicActive] = useState<boolean | null>(null);

  // State for the music if it runs before using mini video or not.
  const [musicRuns, setMusicRuns] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        isMuted,
        setIsMuted,
        isLoading,
        setIsLoading,
        musicActive,
        setMusicActive,
        musicRuns,
        setMusicRuns,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
