import { createContext, PropsWithChildren } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { Obr } from "./types";

export const obrContext = createContext(OBR);

type Props = { obr: Obr } & PropsWithChildren;

export default function ObrContextProvider({ obr, children }: Props) {
  return <obrContext.Provider value={obr}>{children}</obrContext.Provider>;
}
