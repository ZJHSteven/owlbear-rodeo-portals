import { Player } from "@owlbear-rodeo/sdk";
import { useContext } from "react";
import { obrContext } from "../ObrContextProvider";
import useListenExternalStore from "../../react/hook/useListenExternalStore";
import onPlayersChange from "./onPlayersChange";
import getPlayers from "./getPlayers";

export default function usePlayers(): Player[] {
  const obr = useContext(obrContext);
  return useListenExternalStore(
    (callback) => onPlayersChange(obr, callback),
    () => getPlayers(obr),
    [],
  );
}
