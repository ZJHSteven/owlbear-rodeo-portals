import { DESTINATION_ID_METADATA_ID } from "../../../constants";
import { Item } from "@owlbear-rodeo/sdk";

export default function hasDestination(item: Item) {
  return item.metadata[DESTINATION_ID_METADATA_ID] !== undefined;
}
