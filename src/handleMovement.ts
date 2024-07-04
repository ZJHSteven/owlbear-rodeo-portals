import {BoundingBox, Item, Vector2} from "@owlbear-rodeo/sdk";
import {OBR} from "./obr/types";
import {findPortals} from "./findPortals";
import {getDestination} from "./getDestination";
import {EXTENSION_ID} from "./constants";

const JUST_TELEPORTED_METADATA_ID = `${EXTENSION_ID}/just-teleported`;

export default async function handleMovement(obr: OBR, items: Item[]) {
  await removeJustTeleported(obr);

  items = items.filter(({layer, metadata}) => layer === "CHARACTER" && !metadata[JUST_TELEPORTED_METADATA_ID]);
  if (items.length === 0) {
    return;
  }

  const teleports = await findTeleports(obr, items);
  const ids = Object.keys(teleports);
  if (ids.length === 0) {
    return;
  }

  return obr.scene.items.updateItems(
    (item) => item.id in teleports,
    (items) => {
      for (let item of items) {
        item.metadata[JUST_TELEPORTED_METADATA_ID] = true;
        item.position.x += teleports[item.id].x;
        item.position.y += teleports[item.id].y;
      }
    });
}

async function removeJustTeleported(obr: OBR) {
  return obr.scene.items.updateItems(
    ({metadata}) => !!metadata[JUST_TELEPORTED_METADATA_ID],
    (items) => {
      for (let item of items) {
        delete item.metadata[JUST_TELEPORTED_METADATA_ID];
      }
    }
  )
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
        const destination = await getDestination(obr, portal, destinations);
        teleports[item.id] = {
          x: destination.x - item.position.x,
          y: destination.y - item.position.y,
        }
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
