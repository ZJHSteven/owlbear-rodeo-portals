import { BoundingBox, Item, Vector2 } from "@owlbear-rodeo/sdk";
import { EXTENSION_ID } from "../../constants";
import { Obr } from "../../obr/types";
import { findOrigins } from "../../crud/read/origin/findOrigins";
import { findDestination } from "../../crud/read/destination/findDestination";
import { not } from "../../stream/predicate";

export const JUST_TELEPORTED_METADATA_ID = `${EXTENSION_ID}/just-teleported`;
export const TELEPORT_CHANNEL_ID = `${EXTENSION_ID}/channel/teleport`;
export const LATEST_TELEPORT_IDS_METADATA_ID = `${EXTENSION_ID}/latest-teleport-ids`;

export default async function handleMovement(obr: Obr, movedItems: Item[]) {
  const movedCharacters = movedItems
    .filter(isCharacter)
    .filter(not(isTeleported));

  await removeJustTeleported(obr);
  if (movedCharacters.length === 0) {
    return;
  }

  const teleports = await findTeleports(obr, movedCharacters);
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
    },
  );

  await obr.scene.setMetadata({ [LATEST_TELEPORT_IDS_METADATA_ID]: ids });
  await obr.broadcast.sendMessage(
    TELEPORT_CHANNEL_ID,
    {},
    { destination: "ALL" },
  );
}

function isCharacter({ layer }: Item): boolean {
  return layer === "CHARACTER";
}

function isTeleported({ metadata }: Item): boolean {
  return metadata[JUST_TELEPORTED_METADATA_ID] === true;
}

async function removeJustTeleported(obr: Obr) {
  return obr.scene.items.updateItems(isTeleported, (items) => {
    for (let item of items) {
      delete item.metadata[JUST_TELEPORTED_METADATA_ID];
    }
  });
}

async function findTeleports(obr: Obr, items: Item[]) {
  const bounds: Record<string, BoundingBox> = {};
  const destinations: Record<string, Vector2> = {};
  const teleports: Record<string, Vector2> = {};

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

        teleports[item.id] = {
          x: destination.x - item.position.x,
          y: destination.y - item.position.y,
        };
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
    return Promise.resolve(bounds[item.id]);
  }

  return (bounds[item.id] = await obr.scene.items.getItemBounds([item.id]));
}
