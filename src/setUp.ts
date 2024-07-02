import {OBR} from "./obr/types";
import createPortalTool from "./tool/createPortalTool";
import handleMovement from "./handleMovement";
import onItemsMove from "./obr/scene/items/onItemsMove";
import createPortalContextMenu from "./contextMenu/createPortalContextMenu";

export default async function setUp(obr: OBR) {
  await createPortalTool(obr);
  await createPortalContextMenu(obr);
  onItemsMove(obr, items => handleMovement(obr, items));
}
