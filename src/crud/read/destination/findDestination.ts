import { Obr } from "../../../obr/types";
import { BoundingBox, Item } from "@owlbear-rodeo/sdk";
import { optionalOne } from "../../../data/array";
import getItemBounds, {
  isSupported,
  SupportedItem,
} from "../../../obr/scene/items/getItemBounds";

export async function findDestination(
  obr: Obr,
  destinationId: string,
): Promise<{
  destination: SupportedItem;
  bounds: BoundingBox;
}> {
  const destination = optionalOne<Item>(
    await obr.scene.items.getItems([destinationId]),
  );

  if (destination === undefined) {
    throw "unknown destination";
  }

  if (!isSupported(destination)) {
    throw "unsupported destination type";
  }

  const bounds = await getItemBounds(destination);
  return { destination, bounds };
}
