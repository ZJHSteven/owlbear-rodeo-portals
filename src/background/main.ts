import obrIsReady from "../obr/obrIsReady";
import createTool from "./tool/createTool";
import updateContextMenu from "./contextMenu/updateContextMenu";
import addLinkIndicatorsCallbacks from "../crud/read/link/addLinkIndicatorsCallbacks";
import {
  addWorkerCoordinationCallbacks,
  suggestWorker,
} from "../teleport/worker/coordination";
import sceneIsReady from "../obr/scene/sceneIsReady";
import { applyLinkIndicatorVisibility } from "../crud/read/link/updateLinkIndicatorsVisibility";
import addFollowTokensCallbacks from "../teleport/followTokens/addFollowTokensCallbacks";

(async function background() {
  const obr = await obrIsReady();
  await sceneIsReady(obr);

  await Promise.all([
    createTool(obr),
    updateContextMenu(obr),

    addLinkIndicatorsCallbacks(obr),
    applyLinkIndicatorVisibility(obr),

    addWorkerCoordinationCallbacks(obr),
    suggestWorker(obr),

    addFollowTokensCallbacks(obr),
  ]);
})();
