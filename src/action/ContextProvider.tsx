import { PropsWithChildren } from "react";
import ObrContextProvider from "../obr/ObrContextProvider";
import { Obr } from "../obr/types";
import RoleContextProvider from "../obr/player/RoleContextProvider";

type Props = { obr: Obr } & PropsWithChildren;

export default function ContextProvider({ obr, children }: Props) {
  return (
    <ObrContextProvider obr={obr}>
      <RoleContextProvider>{children}</RoleContextProvider>
    </ObrContextProvider>
  );
}
