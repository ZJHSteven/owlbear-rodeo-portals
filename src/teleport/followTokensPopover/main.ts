import obrIsReady from "../../obr/obrIsReady";
import addThemeCallbacks from "../../css/addThemeCallbacks";
import applyTheme from "../../css/applyTheme";
import addResizeCallbacks from "./addResizeCallbacks";
import addTeleportIdsCallbacks from "./addTeleportIdsCallbacks";
import sceneIsReady from "../../obr/scene/sceneIsReady";
import updateView from "./updateView";
import { LATEST_TELEPORT_IDS_METADATA_ID } from "../worker/handleMovement";
import { Obr } from "../../obr/types";

(async function main() {
  const obr = await obrIsReady();
  await sceneIsReady(obr);

  applyTheme(await obr.theme.getTheme());
  addResizeCallbacks(obr);

  await Promise.all([
    addThemeCallbacks(obr),
    addTeleportIdsCallbacks(obr),

    updateView(obr, await getLatestTeleportIds(obr)),
  ]);
})();

async function getLatestTeleportIds(obr: Obr): Promise<string[]> {
  const metadata = await obr.scene.getMetadata();
  return metadata[LATEST_TELEPORT_IDS_METADATA_ID] as string[];
}
