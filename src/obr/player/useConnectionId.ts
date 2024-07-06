import useListenExternalStore from "../../react/hook/useListenExternalStore";
import { useContext } from "react";
import { obrContext } from "../ObrContextProvider";
import onPlayerPropertyChange from "./onPlayerPropertyChange";

export default function useConnectionId() {
  const obr = useContext(obrContext);

  return useListenExternalStore(
    (callback) => () => onPlayerPropertyChange(obr, "connectionId", callback),
    () => obr.player.getConnectionId(),
    undefined,
  );
}
