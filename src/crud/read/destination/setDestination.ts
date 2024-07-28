import { Item, ItemFilter } from "@owlbear-rodeo/sdk";
import { DESTINATION_ID_METADATA_ID } from "../../../constants";
import { SupportedItem } from "../../../obr/scene/items/getItemBounds";
import { Direction } from "../../create/link";
import { Obr } from "../../../obr/types";

export default function setDestination(item: Item, destination: SupportedItem) {
  item.metadata[DESTINATION_ID_METADATA_ID] = destination.id;
}

export async function setDestinations(
  obr: Obr,
  origin: SupportedItem,
  destination: SupportedItem,
  direction: Direction,
) {
  const destinations: Record<string, SupportedItem> = {
    [origin.id]: destination,
  };
  if (direction === Direction.TWO_WAY) {
    destinations[destination.id] = origin;
  }

  const filter: ItemFilter<Item> = Object.keys(destinations);
  await obr.scene.items.updateItems(filter, (items) => {
    for (let item of items) {
      setDestination(item, destinations[item.id]);
    }
  });
}
