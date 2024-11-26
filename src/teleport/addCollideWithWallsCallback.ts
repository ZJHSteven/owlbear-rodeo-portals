import { Obr } from "../obr/types";
import onSceneItemsChange from "../obr/scene/items/onSceneItemsChange";
import { VISIBLE_METADATA_ID } from "./addOnItemsMoveCallback";
import onSceneLocalChange from "../obr/scene/items/onSceneLocalChange";
import { Item } from "@owlbear-rodeo/sdk";

export async function addCollideWithWallsCallback(obr: Obr) {
  onSceneItemsChange(obr, async () => {
    await obr.scene.items.updateItems(hadCollision, addCollideWithWalls);
  });

  onSceneLocalChange(obr, async () => {
    await obr.scene.local.updateItems(hadCollision, addCollideWithWalls);
  });
}

function hadCollision({ metadata }: Item) {
  return metadata[VISIBLE_METADATA_ID] === true;
}

function addCollideWithWalls(items: Item[]) {
  for (const item of items) {
    item.visible = true;
    delete item.metadata[VISIBLE_METADATA_ID];
  }
}
