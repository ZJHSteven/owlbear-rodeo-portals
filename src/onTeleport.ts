import {OBR} from "./obr/types";
import {EXTENSION_ID} from "./constants";

export const TELEPORT_CHANNEL_ID = `${EXTENSION_ID}/channel/teleport`;

export default async function onTeleport(obr: OBR, callback: (obr: OBR) => void) {
  return obr.broadcast.onMessage(TELEPORT_CHANNEL_ID, () => callback(obr));
}
