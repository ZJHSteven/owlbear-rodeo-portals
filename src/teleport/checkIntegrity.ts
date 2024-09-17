import { Obr } from "../obr/types";
import { findOrigins } from "../crud/read/origin/findOrigins";
import { Item } from "@owlbear-rodeo/sdk";
import { isSupported } from "../obr/scene/items/getItemBounds";
import {
  DESTINATION_ID_METADATA_ID,
  SPREAD_ID_METADATA_ID,
} from "../constants";

type ItemValidationResult = {
  offendingItem: Item;
  level: "error" | "warning";
  message: string;
};

export default async function checkIntegrity(
  obr: Obr,
): Promise<ItemValidationResult[]> {
  const origins = await findOrigins(obr);

  return (
    await Promise.all([checkOrigins(origins), checkDestinations(obr, origins)])
  ).flat();
}

async function checkOrigins(origins: Item[]): Promise<ItemValidationResult[]> {
  return origins.flatMap(checkOrigin);
}

function checkOrigin(origin: Item): ItemValidationResult[] {
  if (!isSupported(origin)) {
    return [
      {
        offendingItem: origin,
        level: "error",
        message: "Token type for origin not supported.",
      },
    ];
  }

  return [];
}

async function checkDestinations(
  obr: Obr,
  origins: Item[],
): Promise<ItemValidationResult[]> {
  const destinationIds = origins.map(
    ({ metadata }) => metadata[DESTINATION_ID_METADATA_ID] as string,
  );
  const destinations = await obr.scene.items.getItems(destinationIds);

  const errors = origins.flatMap((origin) =>
    checkDestination(origin, destinations),
  );

  const orphans = await checkOrphanedDestinations(obr, destinationIds);
  orphans.forEach((orphan) => {
    errors.push({
      offendingItem: orphan,
      level: "warning",
      message: `Token ${orphan.id} looks like a destination but has no origin.`,
    });
  });

  return errors;
}

async function checkOrphanedDestinations(obr: Obr, destinationIds: string[]) {
  const destinations = await obr.scene.items.getItems(looksLikeDestination);
  return destinations.filter(({ id }) => !destinationIds.includes(id));
}

function looksLikeDestination(item: Item) {
  return SPREAD_ID_METADATA_ID in item.metadata;
}

function checkDestination(
  origin: Item,
  destinations: Item[],
): ItemValidationResult[] {
  const destinationId = origin.metadata[DESTINATION_ID_METADATA_ID] as string;
  const destination = destinations.find(({ id }) => id === destinationId);
  if (destination === undefined) {
    return [
      {
        offendingItem: origin,
        level: "error",
        message: `Destination token ${destinationId} is missing.`,
      },
    ];
  }

  if (!isSupported(destination)) {
    return [
      {
        offendingItem: destination,
        level: "error",
        message: "Token type for destination not supported.",
      },
    ];
  }

  return [];
}
