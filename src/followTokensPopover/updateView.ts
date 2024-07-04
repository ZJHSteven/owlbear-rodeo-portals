import {Metadata} from "@owlbear-rodeo/sdk";
import getText from "../obr/scene/items/getText";
import {
  FOLLOW_TOKENS_POPOVER_ID,
  LATEST_TELEPORT_IDS_METADATA_ID
} from "../followTokensPopover";
import {OBR} from "../obr/types";

export default async function updateView(obr: OBR, metadata: Metadata) {
  const ids: string[] | undefined = metadata[LATEST_TELEPORT_IDS_METADATA_ID] as string[];
  if (ids === undefined || ids.length === 0) {
    return obr.popover.close(FOLLOW_TOKENS_POPOVER_ID);
  }

  const items = await obr.scene.items.getItems(ids);
  if (items.length === 0) {
    return obr.popover.close(FOLLOW_TOKENS_POPOVER_ID);
  }

  document.body.innerHTML = "";
  document.body.append("The following tokens have been teleported:")

  const ul = document.createElement("ul");
  ul.classList.add("flat");
  items.forEach(item => {
    const li = document.createElement('li');

    const button = document.createElement("button");
    button.classList.add("center-viewport")
    button.append("Center viewport on ", getText(item));
    button.addEventListener("click", async () => {
      const scale = await obr.viewport.getScale();
      const width = await obr.viewport.getWidth();
      const height = await obr.viewport.getHeight();

      await obr.viewport.setPosition({
        x: -item.position.x * scale + width / 2,
        y: -item.position.y * scale + height / 2,
      });

      return obr.popover.close(FOLLOW_TOKENS_POPOVER_ID);
    });

    li.append(button);
    ul.append(li);
  })

  document.body.append(ul);

  const button = document.createElement("button");
  button.classList.add("secondary");
  button.append("Ignore");
  button.addEventListener("click", async () => {
    await obr.popover.close(FOLLOW_TOKENS_POPOVER_ID);
  });

  document.body.append(button);

  const resizeObserver = new ResizeObserver(() => {
    obr.popover.setHeight(FOLLOW_TOKENS_POPOVER_ID, document.body.scrollHeight);
  });

  resizeObserver.observe(document.body);
}
