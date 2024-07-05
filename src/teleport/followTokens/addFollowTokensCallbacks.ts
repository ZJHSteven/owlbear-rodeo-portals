import { Obr } from "../../obr/types";
import { TELEPORT_CHANNEL_ID } from "../worker/handleMovement";
import followTokens from "./followTokens";
import { Vector2 } from "@owlbear-rodeo/sdk";

export default async function addFollowTokensCallbacks(obr: Obr) {
  obr.broadcast.onMessage(TELEPORT_CHANNEL_ID, async (event) => {
    const teleports = event.data as Record<string, Vector2>;
    await followTokens(obr, teleports);
  });
}
