import { Obr } from "../types";

export default async function getPartySelection(obr: Obr): Promise<string[]> {
  const players = await obr.party.getPlayers();
  return players.flatMap(({ selection }) =>
    selection === undefined ? [] : selection,
  );
}
