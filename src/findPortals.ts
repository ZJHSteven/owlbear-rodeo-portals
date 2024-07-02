import {OBR} from "./obr/types";
import {DESTINATION_ID_METADATA_ID} from "./constants";

export async function findPortals(obr: OBR) {
  return obr.scene.items.getItems(item => item.metadata[DESTINATION_ID_METADATA_ID] !== undefined);
}
