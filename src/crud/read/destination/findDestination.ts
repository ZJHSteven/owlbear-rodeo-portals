import { Obr } from "../../../obr/types";
import { Item, Vector2 } from "@owlbear-rodeo/sdk";
import { DESTINATION_ID_METADATA_ID } from "../../../constants";
import { optionalOne } from "../../../data/array";

export async function findDestination(
  obr: Obr,
  origin: Item,
  destinations: Record<string, Vector2>,
): Promise<Vector2 | undefined> {
  if (destinations[origin.id]) {
    return destinations[origin.id];
  }

  const item = optionalOne<Item>(
    await obr.scene.items.getItems([
      origin.metadata[DESTINATION_ID_METADATA_ID] as string,
    ]),
  );

  if (item === undefined) {
    return undefined;
  }

  return (destinations[origin.id] = item.position);
}
