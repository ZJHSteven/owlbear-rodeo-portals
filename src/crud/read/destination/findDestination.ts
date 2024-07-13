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

  const destination = optionalOne<Item>(
    await obr.scene.items.getItems([
      origin.metadata[DESTINATION_ID_METADATA_ID] as string,
    ]),
  );

  if (destination === undefined) {
    return undefined;
  }

  const boundingBox = await obr.scene.items.getItemBounds([destination.id]);
  return (destinations[origin.id] = boundingBox.center);
}
