import { Obr } from "../../obr/types";
import { createToggleLinkVisibilityAction } from "./action/toggleLinkVisiblity";
import { createToggleContextMenuVisibilityAction } from "./action/toggleContextMenuVisibility";
import { createCheckPortalsAction } from "./action/checkPortals";
import { createMetaActions } from "./action/meta";

export default async function createToolActions(obr: Obr) {
  await Promise.all([
    createToggleLinkVisibilityAction(obr),
    createToggleContextMenuVisibilityAction(obr),
    createCheckPortalsAction(obr),
    createMetaActions(obr),
  ]);
}
