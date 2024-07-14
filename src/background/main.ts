import obrIsReady from "../obr/obrIsReady";
import createTool from "./tool/createTool";
import updateContextMenu from "./contextMenu/updateContextMenu";
import addLinkIndicatorsCallbacks from "../crud/read/link/addLinkIndicatorsCallbacks";
import sceneIsReady from "../obr/scene/sceneIsReady";
import { applyLinkIndicatorVisibility } from "../crud/read/link/updateLinkIndicatorsVisibility";
import addOnItemsMoveCallback from "../teleport/addOnItemsMoveCallback";
import addCleanUpOrphanedOrigins from "../teleport/addCleanUpOrphanedOrigins";

(async function background() {
  const obr = await obrIsReady();
  await sceneIsReady(obr);

  await Promise.all([
    createTool(obr),
    updateContextMenu(obr),

    addLinkIndicatorsCallbacks(obr),
    applyLinkIndicatorVisibility(obr),

    addOnItemsMoveCallback(obr),
    addCleanUpOrphanedOrigins(obr),
  ]);
})();
