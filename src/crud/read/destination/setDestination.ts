import { Item } from "@owlbear-rodeo/sdk";
import { DESTINATION_ID_METADATA_ID } from "../../../constants";
import { SupportedItem } from "../../../obr/scene/items/getItemBounds";

export default function setDestination(item: Item, destination: SupportedItem) {
  item.metadata[DESTINATION_ID_METADATA_ID] = destination.id;
}
