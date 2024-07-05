import {BoundingBox, Item, Vector2} from "@owlbear-rodeo/sdk";
import {Obr} from "./obr/types";
import {findPortals} from "./findPortals";
import {getDestination} from "./getDestination";
import {EXTENSION_ID} from "./constants";
import {LATEST_TELEPORT_IDS_METADATA_ID} from "./followTokensPopover";
import {TELEPORT_CHANNEL_ID} from "./onTeleport";

export const JUST_TELEPORTED_METADATA_ID = `${EXTENSION_ID}/just-teleported`;

export default async function handleMovement(obr: Obr, items: Item[]) {
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

  await obr.scene.items.updateItems(
    (item) => item.id in teleports,
    (items) => {
      for (let item of items) {
        item.metadata[JUST_TELEPORTED_METADATA_ID] = true;
        item.position.x += teleports[item.id].x;
        item.position.y += teleports[item.id].y;
      }
    });

  await obr.scene.setMetadata({[LATEST_TELEPORT_IDS_METADATA_ID]: ids});
  await obr.broadcast.sendMessage(TELEPORT_CHANNEL_ID, {}, {destination: "ALL"});
}

async function removeJustTeleported(obr: Obr) {
  return obr.scene.items.updateItems(
    ({metadata}) => !!metadata[JUST_TELEPORTED_METADATA_ID],
    (items) => {
      for (let item of items) {
        delete item.metadata[JUST_TELEPORTED_METADATA_ID];
      }
    }
  )
}

async function findTeleports(obr: Obr, items: Item[]) {
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

async function collides(obr: Obr, { position: { x, y } }: Item, portal: Item, boundsCache: Record<string, BoundingBox>): Promise<boolean> {
  const { min, max } = await getBounds(obr, portal, boundsCache);
  return min.x <= x && x <= max.x && min.y <= y && y <= max.y;
}

async function getBounds(obr: Obr, item: Item, boundsCache: Record<string, BoundingBox>): Promise<BoundingBox> {
  if (boundsCache[item.id]) {
    return Promise.resolve(boundsCache[item.id]);
  }

  return boundsCache[item.id] = await obr.scene.items.getItemBounds([item.id]);
}
