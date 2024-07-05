import getItemText from "../../obr/scene/items/getItemText";
import { Item } from "@owlbear-rodeo/sdk";
import { EXTENSION_ID } from "../../constants";
import createUrl from "../../extension/createUrl";
import { Obr } from "../../obr/types";
import "../../css/theme.css";

type Props = {
  items: Item[];
  onGoto: (item: Item) => void;
  onIgnore: () => void;
};

export function render(parent: Element, { items, onGoto, onIgnore }: Props) {
  parent.append("The following tokens have been teleported:");

  const ul = document.createElement("ul");
  ul.classList.add("flat");
  items.forEach((item) => {
    const li = document.createElement("li");

    const button = document.createElement("button");
    button.classList.add("center-viewport");
    button.append("Center viewport on ", getItemText(item));
    button.addEventListener("click", () => onGoto(item));

    li.append(button);
    ul.append(li);
  });

  parent.append(ul);

  const button = document.createElement("button");
  button.classList.add("secondary");
  button.append("Ignore");
  button.addEventListener("click", onIgnore);

  parent.append(button);
}

const FOLLOW_TOKENS_POPOVER_ID = `${EXTENSION_ID}/popover/follow-tokens`;

export async function open(obr: Obr) {
  await obr.popover.open({
    id: FOLLOW_TOKENS_POPOVER_ID,
    url: createUrl("followTokensPopover.html"),
    width: 320,
    height: 240,
  });
}

export async function close(obr: Obr) {
  await obr.popover.close(FOLLOW_TOKENS_POPOVER_ID);
}

export async function resize(obr: Obr) {
  await obr.popover.setHeight(
    FOLLOW_TOKENS_POPOVER_ID,
    document.body.scrollHeight,
  );
}
