import { Obr } from "../obr/types";
import onSceneItemsChange from "../obr/scene/items/onSceneItemsChange";
import { VISIBLE_METADATA_ID } from "./addOnItemsMoveCallback";

export async function addCollideWithWallsCallback(obr: Obr) {
  onSceneItemsChange(obr, async () => {
    await obr.scene.items.updateItems(
      ({ metadata }) => metadata[VISIBLE_METADATA_ID] === true,
      (items) => {
        for (const item of items) {
          item.visible = true;
          delete item.metadata[VISIBLE_METADATA_ID];
        }
      },
    );
  });
}
