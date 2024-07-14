import { Obr } from "../../types";
import { Item } from "@owlbear-rodeo/sdk";
import { Callback } from "../../../types";

const callbacks: Callback<Item[]>[] = [];

export default function onSceneItemsChange(
  obr: Obr,
  callback: Callback<Item[]>,
) {
  if (callbacks.length === 0) {
    obr.scene.items.onChange(dispatch);
  }

  callbacks.push(callback);
}

function dispatch(items: Item[]) {
  callbacks.forEach((callback) => {
    try {
      callback(items);
    } catch (error) {
      console.error(error);
    }
  });
}
