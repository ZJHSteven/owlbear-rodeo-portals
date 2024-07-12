import { BoundingBox, Item, Vector2 } from "@owlbear-rodeo/sdk";
import { Obr } from "../obr/types";
import { findOrigins } from "../crud/read/origin/findOrigins";
import { findDestination } from "../crud/read/destination/findDestination";
import onItemsMove from "../obr/scene/items/onItemsMove";
import gotoItemPosition from "../obr/viewport/gotoItemPosition";

let teleportIds: string[] = [];

export default async function addOnItemsMoveCallback(obr: Obr) {
  onItemsMove(obr, (items) => {
    handleMovement(obr, items);
  });
}

async function handleMovement(obr: Obr, movedItems: Item[]) {
  const ownCharacters = movedItems
    .filter(({ layer }) => layer === "CHARACTER")
    .filter(({ lastModifiedUserId }) => lastModifiedUserId === obr.player.id);

  const candidates: Item[] = [];
  ownCharacters.forEach((item) => {
    if (teleportIds.includes(item.id)) {
      gotoItemPosition(obr, item.position);
    } else {
      candidates.push(item);
    }
  });

  const teleports = await findTeleports(obr, candidates);
  teleportIds = Object.keys(teleports);
  if (teleportIds.length === 0) {
    return;
  }

  await obr.scene.items.updateItems(
    ({ id }) => id in teleports,
    (items) => {
      for (let item of items) {
        item.position = teleports[item.id];
      }
    },
  );
}

async function findTeleports(obr: Obr, items: Item[]) {
  const teleports: Record<string, Vector2> = {};
  if (items.length === 0) {
    return teleports;
  }

  const bounds: Record<string, BoundingBox> = {};
  const destinations: Record<string, Vector2> = {};

  const origins = await findOrigins(obr);
  for (let item of items) {
    for (let origin of origins) {
      if (item.id === origin.id) {
        continue;
      }

      if (await collides(obr, item, origin, bounds)) {
        const destination = await findDestination(obr, origin, destinations);
        if (destination === undefined) {
          console.error("unknown destination");
          continue;
        }

        teleports[item.id] = destination;
      }
    }
  }

  return teleports;
}

async function collides(
  obr: Obr,
  { position: { x, y } }: Item,
  origin: Item,
  bounds: Record<string, BoundingBox>,
): Promise<boolean> {
  const { min, max } = await getBounds(obr, origin, bounds);
  return min.x <= x && x <= max.x && min.y <= y && y <= max.y;
}

async function getBounds(
  obr: Obr,
  item: Item,
  bounds: Record<string, BoundingBox>,
): Promise<BoundingBox> {
  if (bounds[item.id]) {
    return bounds[item.id];
  }

  return (bounds[item.id] = await obr.scene.items.getItemBounds([item.id]));
}
