import { createContext, PropsWithChildren, useContext } from "react";
import { Role } from "./types";
import useListenExternalStore from "../../react/hook/useListenExternalStore";
import onPlayerPropertyChange from "./onPlayerPropertyChange";
import { obrContext } from "../ObrContextProvider";

const DEFAULT_ROLE = "PLAYER";
export const roleContext = createContext<Role>(DEFAULT_ROLE);

export default function RoleContextProvider({ children }: PropsWithChildren) {
  const obr = useContext(obrContext);
  const currentRole = useListenExternalStore(
    (callback) => onPlayerPropertyChange(obr, "role", callback),
    () => obr.player.getRole(),
    DEFAULT_ROLE,
  );

  return (
    <roleContext.Provider value={currentRole}>{children}</roleContext.Provider>
  );
}
