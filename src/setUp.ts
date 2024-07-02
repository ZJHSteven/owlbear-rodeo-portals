import {OBR} from "./obr/types";
import createPortalsAndTrapsTool from "./tool/createPortalsAndTrapsTool";
import handleMovement from "./handleMovement";
import onItemsMove from "./obr/scene/items/onItemsMove";
import createPortalsAndTrapsContextMenu
  from "./contextMenu/createPortalsAndTrapsContextMenu";

export default async function setUp(obr: OBR) {
  await createPortalsAndTrapsTool(obr);
  await createPortalsAndTrapsContextMenu(obr);
  onItemsMove(obr, items => handleMovement(obr, items));
}
