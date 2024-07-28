import { createContext, PropsWithChildren, useState } from "react";
import { Obr } from "./types";
import usePromise from "../react/hook/usePromise";
import obrIsReady from "./obrIsReady";

export const obrContext = createContext<Obr | undefined>(undefined);

export default function ObrContextProvider({ children }: PropsWithChildren) {
  const [obr, setObr] = useState<Obr | undefined>(undefined);
  usePromise(async () => obrIsReady(), setObr);
  return <obrContext.Provider value={obr}>{children}</obrContext.Provider>;
}
