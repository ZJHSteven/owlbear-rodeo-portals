import { BoundingBox, Item, Vector2 } from "@owlbear-rodeo/sdk";
import { isVector2, Obr } from "../obr/types";
import { findOrigins } from "../crud/read/origin/findOrigins";
import { findDestination } from "../crud/read/destination/findDestination";
import onItemsMove from "../obr/scene/items/onItemsMove";
import gotoPosition from "../obr/viewport/gotoPosition";
import {
  DESTINATION_ID_METADATA_ID,
  EXTENSION_ID,
  SPREAD_ID_METADATA_ID,
  SPREAD_RELATIVE,
} from "../constants";
import getItemBounds, { isSupported } from "../obr/scene/items/getItemBounds";

const DESTINATION_POSITION_METADATA_ID = `${EXTENSION_ID}/destination-position`;
export const VISIBLE_METADATA_ID = `${EXTENSION_ID}/visible`;

export default async function addOnItemsMoveCallback(obr: Obr) {
  onItemsMove(obr, (items) => {
    handleMovement(obr, items);
  });
}

async function handleMovement(obr: Obr, movedItems: Item[]) {
  const ownCharacters = movedItems
    .filter(({ layer }) => layer === "CHARACTER")
    .filter(({ lastModifiedUserId }) => lastModifiedUserId === obr.player.id);

  const movedCharacters = ownCharacters.filter(({ position, metadata }) => {
    const destination = metadata[DESTINATION_POSITION_METADATA_ID];
    if (!isVector2(destination)) {
      return true;
    }

    return position.x !== destination.x || position.y !== destination.y;
  });

  const teleports = await findTeleports(obr, movedCharacters);
  const teleportIds = Object.keys(teleports);
  const attachments = await obr.scene.items.getItemAttachments(teleportIds);
  const localAttachments =
    await obr.scene.local.getItemAttachments(teleportIds);
  await passWallsAttachments(obr, attachments, localAttachments);

  await obr.scene.items.updateItems(movedCharacters, (items) => {
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

  await setHadCollisionAttachments(obr, attachments, localAttachments);
}

async function passWallsAttachments(
  obr: Obr,
  attachments: Item[],
  localAttachments: Item[],
) {
  return Promise.all([
    obr.scene.items.updateItems(attachments, passWallsItems),
    obr.scene.local.updateItems(localAttachments, passWallsItems),
  ]);
}

function passWallsItems(items: Item[]) {
  for (const item of items) {
    if (item.visible) {
      item.visible = false;
    }
  }
}

async function setHadCollisionAttachments(
  obr: Obr,
  attachments: Item[],
  localAttachments: Item[],
) {
  return Promise.all([
    obr.scene.items.updateItems(attachments, setHadCollisionItems),
    obr.scene.local.updateItems(localAttachments, setHadCollisionItems),
  ]);
}

function setHadCollisionItems(items: Item[]) {
  for (const item of items) {
    if (item.visible) {
      item.metadata[VISIBLE_METADATA_ID] = true;
    }
  }
}

async function findTeleports(obr: Obr, items: Item[]) {
  if (items.length === 0) {
    return {};
  }

  const destinationGroups: Record<string, { origin: Vector2; item: Item }[]> =
    {};
  const origins = await findOrigins(obr);
  for (let origin of origins.filter(isSupported)) {
    const bounds = await getItemBounds(origin);
    const destinationId = origin.metadata[DESTINATION_ID_METADATA_ID] as string;
    destinationGroups[destinationId] = [];
    for (let item of items) {
      try {
        if (item.id === origin.id) {
          continue;
        }

        if (collides(item.position, bounds)) {
          destinationGroups[destinationId].push({
            origin: bounds.center,
            item,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const teleports: Record<string, Vector2> = {};
  for (let destinationId in destinationGroups) {
    const { destination, bounds } = await findDestination(obr, destinationId);
    const group = destinationGroups[destinationId];
    for (const { origin, item } of group) {
      teleports[item.id] = { ...bounds.center };
      if (destination.metadata[SPREAD_ID_METADATA_ID] === SPREAD_RELATIVE) {
        teleports[item.id].x += item.position.x - origin.x;
        teleports[item.id].y += item.position.y - origin.y;
      }
    }
  }

  return teleports;
}

function collides({ x, y }: Vector2, { min, max }: BoundingBox) {
  return min.x <= x && x <= max.x && min.y <= y && y <= max.y;
}
