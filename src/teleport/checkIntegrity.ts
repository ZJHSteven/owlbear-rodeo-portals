import { Obr } from "../obr/types";
import { findOrigins } from "../crud/read/origin/findOrigins";
import { Item } from "@owlbear-rodeo/sdk";
import { isSupported } from "../obr/scene/items/getItemBounds";
import { DESTINATION_ID_METADATA_ID } from "../constants";

type PortalError = {
  offendingItem: Item;
  error: string;
};

export default async function checkIntegrity(obr: Obr): Promise<PortalError[]> {
  const origins = await findOrigins(obr);

  return (
    await Promise.all([checkOrigins(origins), checkDestinations(obr, origins)])
  ).flat();
}

async function checkOrigins(origins: Item[]): Promise<PortalError[]> {
  return origins.flatMap(checkOrigin);
}

function checkOrigin(origin: Item): PortalError[] {
  if (!isSupported(origin)) {
    return [
      {
        offendingItem: origin,
        error: "Token type for origin not supported.",
      },
    ];
  }

  return [];
}

async function checkDestinations(
  obr: Obr,
  origins: Item[],
): Promise<PortalError[]> {
  const destinationIds = origins.map(
    ({ metadata }) => metadata[DESTINATION_ID_METADATA_ID] as string,
  );
  const destinations = await obr.scene.items.getItems(destinationIds);

  return origins.flatMap((origin) => checkDestination(origin, destinations));
}

function checkDestination(origin: Item, destinations: Item[]): PortalError[] {
  const destinationId = origin.metadata[DESTINATION_ID_METADATA_ID] as string;
  const destination = destinations.find(({ id }) => id === destinationId);
  if (destination === undefined) {
    return [
      {
        offendingItem: origin,
        error: `Destination token ${destinationId} is missing.`,
      },
    ];
  }

  if (!isSupported(destination)) {
    return [
      {
        offendingItem: destination,
        error: "Token type for destination not supported.",
      },
    ];
  }

  return [];
}
