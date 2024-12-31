import { createContext } from "react";

export const GlobalContext = createContext<GlobalContextType>(
  {} as GlobalContextType,
);
