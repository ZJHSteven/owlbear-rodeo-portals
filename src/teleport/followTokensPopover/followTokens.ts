import { Obr } from "../../obr/types";
import { open } from "./popover";
import { Vector2 } from "@owlbear-rodeo/sdk";
import gotoItemPosition from "../../obr/viewport/gotoItemPosition";
import getPartySelection from "../../obr/party/getPartySelection";

export default async function followTokens(
  obr: Obr,
  teleports: Record<string, Vector2>,
) {
  let ids = Object.keys(teleports);
  if (ids.length === 0) {
    return;
  }

  const partySelection = await getPartySelection(obr);
  ids = ids.filter((id) => partySelection.includes(id));

  const selection = await obr.player.getSelection();
  if (selection === undefined || selection.length === 0) {
    await open(obr, ids);
    return;
  }

  const teleport = findTeleport(teleports, selection);
  if (teleport === undefined) {
    await open(obr, ids);
    return;
  }

  await gotoItemPosition(obr, teleport);
}

function findTeleport(teleports: Record<string, Vector2>, ids: string[]) {
  for (let id of ids) {
    if (id in teleports) {
      return teleports[id];
    }
  }

  return undefined;
}
