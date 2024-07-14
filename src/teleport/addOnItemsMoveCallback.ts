import { BoundingBox, Item, Vector2 } from "@owlbear-rodeo/sdk";
import { isVector2, Obr } from "../obr/types";
import { findOrigins } from "../crud/read/origin/findOrigins";
import { findDestination } from "../crud/read/destination/findDestination";
import onItemsMove from "../obr/scene/items/onItemsMove";
import gotoPosition from "../obr/viewport/gotoPosition";
import { EXTENSION_ID } from "../constants";
import getItemBounds, {
  isSupported,
  SupportedItem,
} from "../obr/scene/items/getItemBounds";

const DESTINATION_POSITION_METADATA_ID = `${EXTENSION_ID}/destination-position`;

export default async function addOnItemsMoveCallback(obr: Obr) {
  onItemsMove(obr, (items) => {
    handleMovement(obr, items);
  });
}

async function handleMovement(obr: Obr, movedItems: Item[]) {
  const ownCharacters = movedItems
    .filter(({ layer }) => layer === "CHARACTER")
    .filter(({ lastModifiedUserId }) => lastModifiedUserId === obr.player.id)
    .filter(({ position, metadata }) => {
      if (metadata === undefined) {
        return true;
      }

      const destination = metadata[DESTINATION_POSITION_METADATA_ID];
      if (!isVector2(destination)) {
        return true;
      }

      return position.x !== destination.x || position.y !== destination.y;
    });

  const teleports = await findTeleports(obr, ownCharacters);
  await obr.scene.items.updateItems(ownCharacters, (items) => {
    let viewportDestination: Vector2 | null = null;
    for (let item of items) {
      if (item.id in teleports) {
        const destination = teleports[item.id];
        item.position = destination;
        item.metadata[DESTINATION_POSITION_METADATA_ID] = destination;
        if (viewportDestination === null) {
          viewportDestination = destination;
        }
      } else if (DESTINATION_POSITION_METADATA_ID in item.metadata) {
        delete item.metadata[DESTINATION_POSITION_METADATA_ID];
      }
    }

    if (viewportDestination !== null) {
      gotoPosition(obr, viewportDestination);
    }
  });
}

async function findTeleports(obr: Obr, items: Item[]) {
  const teleports: Record<string, Vector2> = {};
  if (items.length === 0) {
    return teleports;
  }

  const bounds: Record<string, BoundingBox> = {};
  const destinations: Record<string, Vector2> = {};

  const origins = await findOrigins(obr);
  for (let origin of origins.filter(isSupported)) {
    for (let item of items) {
      try {
        if (item.id === origin.id) {
          continue;
        }

        if (await collides(item, origin, bounds)) {
          teleports[item.id] = await findDestination(obr, origin, destinations);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return teleports;
}

async function collides(
  { position: { x, y } }: Item,
  origin: SupportedItem,
  bounds: Record<string, BoundingBox>,
): Promise<boolean> {
  const { min, max } = await getBounds(origin, bounds);
  return min.x <= x && x <= max.x && min.y <= y && y <= max.y;
}

async function getBounds(
  item: SupportedItem,
  bounds: Record<string, BoundingBox>,
): Promise<BoundingBox> {
  if (bounds[item.id]) {
    return bounds[item.id];
  }

  return (bounds[item.id] = await getItemBounds(item));
}
