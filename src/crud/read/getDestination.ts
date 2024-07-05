import { Obr } from "./obr/types";
import { Item, Vector2 } from "@owlbear-rodeo/sdk";
import { DESTINATION_ID_METADATA_ID } from "./constants";

export async function getDestination(
  obr: Obr,
  portal: Item,
  destinationsCache: Record<string, Vector2>,
): Promise<Vector2> {
  if (destinationsCache[portal.id]) {
    return Promise.resolve(destinationsCache[portal.id]);
  }

  const items = await obr.scene.items.getItems([
    portal.metadata[DESTINATION_ID_METADATA_ID] as string,
  ]);
  return (destinationsCache[portal.id] = items[0].position);
}
