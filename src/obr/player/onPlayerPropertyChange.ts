import { Obr } from "../types";
import { Callback, Unsubscribe } from "../../types";
import { Player } from "@owlbear-rodeo/sdk";

export default function onPlayerPropertyChange<K extends keyof Player>(
  obr: Obr,
  key: K,
  callback: Callback<Player[K]>,
): Unsubscribe {
  let value: Player[K];
  return obr.player.onChange((player) => {
    if (value === player[key]) {
      return;
    }

    value = player[key];
    callback(value);
  });
}
