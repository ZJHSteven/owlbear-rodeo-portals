import {BoundingBox, Item, Vector2} from "@owlbear-rodeo/sdk";
import {OBR} from "./obr/types";
import {findPortals} from "./findPortals";
import {getDestination} from "./getDestination";

export default async function handleMovement(obr: OBR, items: Item[]) {
  const teleports = await findTeleports(obr, items);
  return obr.scene.items.updateItems(
    (item) => item.id in teleports,
    (items) => {
      for (let item of items) {
        item.position = teleports[item.id];
      }
    });
}

async function findTeleports(obr: OBR, items: Item[]) {
  const bounds: Record<string, BoundingBox> = {};
  const destinations: Record<string, Vector2> = {};
  const teleports: Record<string, Vector2> = {};

  const portals = await findPortals(obr);
  for (let item of items) {
    for (let portal of portals) {
      if (item.id === portal.id) {
        continue;
      }

      if (await collides(obr, item, portal, bounds)) {
        teleports[item.id] = await getDestination(obr, portal, destinations);
      }
    }
  }

  return teleports;
}

async function collides(obr: OBR, { position: { x, y } }: Item, portal: Item, boundsCache: Record<string, BoundingBox>): Promise<boolean> {
  const { min, max } = await getBounds(obr, portal, boundsCache);
  return min.x <= x && x <= max.x && min.y <= y && y <= max.y;
}

async function getBounds(obr: OBR, item: Item, boundsCache: Record<string, BoundingBox>): Promise<BoundingBox> {
  if (boundsCache[item.id]) {
    return Promise.resolve(boundsCache[item.id]);
  }

  return boundsCache[item.id] = await obr.scene.items.getItemBounds([item.id]);
}
