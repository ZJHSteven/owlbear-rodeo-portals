import { Obr } from "../../types";
import { Item } from "@owlbear-rodeo/sdk/lib/types/items/Item";
import { Vector2 } from "@owlbear-rodeo/sdk";
import { Callback } from "../../../types";

export default function onItemsMove(obr: Obr, callback: Callback<Item[]>) {
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

    if (moved.length === 0) {
      return;
    }

    callback(moved);
  });
}
