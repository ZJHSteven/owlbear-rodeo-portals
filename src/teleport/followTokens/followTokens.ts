import { Obr } from "../../obr/types";
import { Vector2 } from "@owlbear-rodeo/sdk";
import gotoItemPosition from "../../obr/viewport/gotoItemPosition";

export default async function followTokens(
  obr: Obr,
  teleports: Record<string, Vector2>,
) {
  const teleport = teleports[obr.player.id];
  if (teleport === undefined) {
    return;
  }

  await gotoItemPosition(obr, teleport);
}
