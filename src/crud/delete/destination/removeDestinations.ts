import { Item } from "@owlbear-rodeo/sdk";
import { Obr } from "../../../obr/types";
import { DESTINATION_ID_METADATA_ID } from "../../../constants";
import hasDestination from "../../read/destination/hasDestination";

export default async function removeDestinations(obr: Obr, items: Item[]) {
  await obr.scene.items.updateItems(items.filter(hasDestination), (items) => {
    for (let item of items) {
      delete item.metadata[DESTINATION_ID_METADATA_ID];
    }
  });
}
