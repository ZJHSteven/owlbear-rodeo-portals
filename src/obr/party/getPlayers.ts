import { Player } from "@owlbear-rodeo/sdk";
import { Obr } from "../types";
import getPlayer from "../player/getPlayer";

export default async function getPlayers(obr: Obr): Promise<Player[]> {
  const [players, player] = await Promise.all([
    obr.party.getPlayers(),
    getPlayer(obr),
  ]);

  players.push(player);
  return players;
}
