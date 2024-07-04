import {OBR} from "./obr/types";
import createPortalTool from "./tool/createPortalTool";
import handleMovement from "./handleMovement";
import onItemsMove from "./obr/scene/items/onItemsMove";
import createPortalContextMenu from "./contextMenu/createPortalContextMenu";
import showFollowTokensPopover from "./showFollowTokensPopover";
import onTeleport from "./onTeleport";

export default async function setUp(obr: OBR) {
  await createPortalTool(obr);
  await createPortalContextMenu(obr);
  await onItemsMove(obr, handleMovement);
  await onTeleport(obr, showFollowTokensPopover);
}
