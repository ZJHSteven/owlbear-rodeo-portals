import obrIsReady from "../obr/obrIsReady";
import createTool from "./tool/createTool";
import createContextMenu from "./contextMenu/createContextMenu";
import addLinkIndicatorsCallbacks from "../crud/read/link/addLinkIndicatorsCallbacks";

(async function main() {
  const obr = await obrIsReady();

  await Promise.all([
    createTool(obr),
    createContextMenu(obr),

    addLinkIndicatorsCallbacks(obr),
  ]);
})();
