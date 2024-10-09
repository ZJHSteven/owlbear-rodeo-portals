import onSceneItemsChange from "../obr/scene/items/onSceneItemsChange";
import { Obr } from "../obr/types";
import hasDestination from "../crud/read/destination/hasDestination";
import { DESTINATION_ID_METADATA_ID } from "../constants";

export default async function addCleanUpOrphanedOriginsCallback(obr: Obr) {
  onSceneItemsChange(obr, async (items) => {
    const origins = items.filter(hasDestination);
    if (origins.length === 0) {
      return;
    }

    const destinationIds = origins.map(
      ({ metadata }) => metadata[DESTINATION_ID_METADATA_ID] as string,
    );

    const destinations = await obr.scene.items.getItems(destinationIds);
    const orphaned =
      destinations.length === 0
        ? origins
        : origins.filter(({ metadata }) => {
            const destinationId = metadata[
              DESTINATION_ID_METADATA_ID
            ] as string;
            const destination = destinations.find(
              ({ id }) => id === destinationId,
            );
            return destination === undefined;
          });

    if (orphaned.length === 0) {
      return;
    }

    await obr.scene.items.updateItems(orphaned, (items) => {
      for (const item of items) {
        delete item.metadata[DESTINATION_ID_METADATA_ID];
      }
    });
  });
}
