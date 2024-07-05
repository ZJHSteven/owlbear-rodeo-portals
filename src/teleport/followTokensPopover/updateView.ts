import { Obr } from "../../obr/types";
import { close, render } from "./popover";
import { Item } from "@owlbear-rodeo/sdk";

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
      await goto(obr, item);
    },
    async onIgnore() {
      await close(obr);
    },
  });
}

async function goto(obr: Obr, item: Item) {
  const scale = await obr.viewport.getScale();
  const width = await obr.viewport.getWidth();
  const height = await obr.viewport.getHeight();

  await obr.viewport.setPosition({
    x: -item.position.x * scale + width / 2,
    y: -item.position.y * scale + height / 2,
  });

  await close(obr);
}
