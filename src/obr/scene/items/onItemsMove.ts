import { Obr } from "../../types";
import { Item } from "@owlbear-rodeo/sdk/lib/types/items/Item";
import { Vector2 } from "@owlbear-rodeo/sdk";

export default function onItemsMove(
  obr: Obr,
  callback: (obr: Obr, items: Item[]) => void,
) {
  let positions: Record<string, Vector2> = {};
  return obr.scene.items.onChange((items) => {
    const moved = items.filter((item) => {
      const position = positions[item.id];
      if (position === undefined) {
        return false;
      }

      return position.x !== item.position.x || position.y !== item.position.y;
    });

    positions = {};
    for (let item of items) {
      positions[item.id] = item.position;
    }

    callback(obr, moved);
  });
}
