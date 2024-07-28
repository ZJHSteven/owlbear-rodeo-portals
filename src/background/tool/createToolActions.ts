import { Obr } from "../../obr/types";
import { createToggleLinkVisibilityAction } from "./action/toggleLinkVisiblity";
import { createToggleContextMenuVisibilityAction } from "./action/toggleContextMenuVisibility";
import { createCheckPortalsAction } from "./action/checkPortals";
import { createMetaActions } from "./action/meta";
import createToggleDirectionAction from "./action/toggleDirection";
import createSetImageActions from "./action/setImage";

export default async function createToolActions(obr: Obr) {
  await Promise.all([
    createToggleDirectionAction(obr),
    createSetImageActions(obr),
    createToggleLinkVisibilityAction(obr),
    createToggleContextMenuVisibilityAction(obr),
    createCheckPortalsAction(obr),
    createMetaActions(obr),
  ]);
}
