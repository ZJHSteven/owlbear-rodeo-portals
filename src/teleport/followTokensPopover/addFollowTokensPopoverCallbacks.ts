import { Obr } from "../../obr/types";
import { TELEPORT_CHANNEL_ID } from "../worker/handleMovement";
import { open } from "./popover";

export default async function addFollowTokensPopoverCallbacks(obr: Obr) {
  obr.broadcast.onMessage(TELEPORT_CHANNEL_ID, async () => {
    await open(obr);
  });
}
