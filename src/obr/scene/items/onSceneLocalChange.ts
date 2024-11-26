import { Obr } from "../../types";
import { Item } from "@owlbear-rodeo/sdk";
import { Callback } from "../../../types";

const callbacks: Callback<Item[]>[] = [];

export default function onSceneLocalChange(
  obr: Obr,
  callback: Callback<Item[]>,
) {
  if (callbacks.length === 0) {
    obr.scene.local.onChange(dispatch);
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
