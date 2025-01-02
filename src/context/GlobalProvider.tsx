import { useRef, useState } from "react";
import { GlobalContext } from "./GlobalContext";

function GlobalProvider({ children }: GlobalProviderProps) {
  // When the site is muted
  const [isMuted, setIsMuted] = useState(true);

  // When the site is loading
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  // Ref for the music
  const musicRef = useRef<HTMLAudioElement>(null);

  return (
    <GlobalContext.Provider
      value={{ isMuted, setIsMuted, isLoading, setIsLoading, musicRef }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
