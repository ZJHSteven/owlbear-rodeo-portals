import { Obr } from "../types";
import { Unsubscribe } from "../../types";
import { Player } from "@owlbear-rodeo/sdk";
import { Callback } from "webpack-cli";
import getPlayer from "../player/getPlayer";

export default function onPlayersChange(
  obr: Obr,
  callback: Callback<Player[][]>,
): Unsubscribe {
  function notify(players: Player[], player: Player) {
    players.push(player);
    callback(players);
  }

  const unsubscribePlayers = obr.party.onChange(async (players) => {
    notify(players, await getPlayer(obr));
  });

  const unsubscribePlayer = obr.player.onChange(async (player) => {
    notify(await obr.party.getPlayers(), player);
  });

  return () => {
    unsubscribePlayers();
    unsubscribePlayer();
  };
}
