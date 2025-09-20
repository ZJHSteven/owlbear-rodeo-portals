import { Obr } from "../obr/types";
import { findOrigins } from "../crud/read/origin/findOrigins";
import { Item, Layer } from "@owlbear-rodeo/sdk";
import { errors } from "../i18n/strings";
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

  const results: ItemValidationResult[] = [];
  await Promise.all([
    checkOrigins(origins, results),
    checkDestinations(obr, origins, results),
  ]);

  return results;
}

async function checkOrigins(origins: Item[], results: ItemValidationResult[]) {
  return origins.flatMap((origin) => checkOrigin(origin, results));
}

function checkOrigin(origin: Item, results: ItemValidationResult[]) {
  if (!isSupported(origin)) {
    results.push({
      offendingItem: origin,
      level: "error",
      message: errors.originTypeUnsupported,
    });
  }

  if (!isAccessibleLayer(origin.layer)) {
    results.push({
      offendingItem: origin,
      level: "warning",
      message: errors.originLayerInaccessible(origin.id),
    });
  }
}

async function checkDestinations(
  obr: Obr,
  origins: Item[],
  results: ItemValidationResult[],
) {
  const destinationIds = origins.map(
    ({ metadata }) => metadata[DESTINATION_ID_METADATA_ID] as string,
  );
  const destinations = await obr.scene.items.getItems(destinationIds);

  origins.forEach((origin) => checkDestination(origin, destinations, results));

  await checkOrphanedDestinations(obr, destinationIds, results);
}

function checkDestination(
  origin: Item,
  destinations: Item[],
  results: ItemValidationResult[],
) {
  const destinationId = origin.metadata[DESTINATION_ID_METADATA_ID] as string;
  const destination = destinations.find(({ id }) => id === destinationId);
  if (destination === undefined) {
    results.push({
      offendingItem: origin,
      level: "error",
      message: errors.destinationMissing(destinationId),
    });

    return;
  }

  if (!isSupported(destination)) {
    results.push({
      offendingItem: destination,
      level: "error",
      message: errors.destinationTypeUnsupported,
    });
  }

  if (!isAccessibleLayer(destination.layer)) {
    results.push({
      offendingItem: destination,
      level: "warning",
      message: errors.destinationLayerInaccessible(destinationId),
    });
  }
}

function isAccessibleLayer(layer: Layer) {
  return (
    layer === "MAP" ||
    layer === "DRAWING" ||
    layer === "PROP" ||
    layer === "MOUNT" ||
    layer === "CHARACTER" ||
    layer === "ATTACHMENT" ||
    layer === "NOTE" ||
    layer === "TEXT"
  );
}

async function checkOrphanedDestinations(
  obr: Obr,
  destinationIds: string[],
  results: ItemValidationResult[],
) {
  const destinations = await obr.scene.items.getItems(looksLikeDestination);
  destinations
    .filter(({ id }) => !destinationIds.includes(id))
    .forEach((orphan) => {
      results.push({
        offendingItem: orphan,
        level: "warning",
        message: errors.orphanDestination(orphan.id),
      });
    });
}

function looksLikeDestination(item: Item) {
  return SPREAD_ID_METADATA_ID in item.metadata;
}
