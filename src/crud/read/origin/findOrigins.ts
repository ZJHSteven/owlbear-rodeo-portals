import { Obr } from "../../../obr/types";
import hasDestination from "../destination/hasDestination";

export async function findOrigins(obr: Obr) {
  return obr.scene.items.getItems(hasDestination);
}
