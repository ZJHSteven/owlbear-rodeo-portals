import { Obr } from "../../obr/types";
import { close, render } from "./popover";
import { Item } from "@owlbear-rodeo/sdk";
import gotoItem from "../../obr/viewport/gotoItem";

export default async function updateView(obr: Obr, ids: string[]) {
  if (ids.length === 0) {
    await close(obr);
    return;
  }

  const items = await obr.scene.items.getItems(ids);
  if (items.length === 0) {
    console.warn("no items found");
    await close(obr);
    return;
  }

  document.body.innerHTML = "";
  render(document.body, {
    items,
    async onGoto(item: Item) {
      await gotoItem(obr, item);
      await close(obr);
    },
    async onIgnore() {
      await close(obr);
    },
  });
}
