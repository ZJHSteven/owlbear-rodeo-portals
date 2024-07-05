import obrIsReady from "../../obr/obrIsReady";
import addThemeCallbacks from "../../css/addThemeCallbacks";
import applyTheme from "../../css/applyTheme";
import addResizeCallbacks from "./addResizeCallbacks";
import sceneIsReady from "../../obr/scene/sceneIsReady";
import updateView from "./updateView";

(async function main() {
  const obr = await obrIsReady();
  await sceneIsReady(obr);

  applyTheme(await obr.theme.getTheme());
  addResizeCallbacks(obr);

  await Promise.all([addThemeCallbacks(obr), updateView(obr, getIds())]);
})();

function getIds(): string[] {
  const params = new URLSearchParams(location.search);
  const ids = params.get("ids");
  if (ids === null) {
    return [];
  }

  return ids.split(",");
}
