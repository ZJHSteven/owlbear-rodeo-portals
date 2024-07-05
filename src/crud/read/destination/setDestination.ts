import { Item } from "@owlbear-rodeo/sdk";
import { DESTINATION_ID_METADATA_ID } from "../../../constants";

export default function setDestination(item: Item, destinationId: string) {
  item.metadata[DESTINATION_ID_METADATA_ID] = destinationId;
}
