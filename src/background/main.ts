import obrIsReady from "../obr/obrIsReady";
import createTool from "./tool/createTool";
import createContextMenu from "./contextMenu/createContextMenu";
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
    createContextMenu(obr),

    addLinkIndicatorsCallbacks(obr),
    applyLinkIndicatorVisibility(obr),

    addWorkerCoordinationCallbacks(obr),
    suggestWorker(obr),

    addFollowTokensCallbacks(obr),
  ]);
})();
