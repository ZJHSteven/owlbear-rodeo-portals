import obrIsReady from "../obr/obrIsReady";
import sceneIsReady from "../obr/scene/sceneIsReady";
import { createRoot } from "react-dom/client";
import ContextProvider from "./ContextProvider";
import Action from "./Action";
import addThemeCallbacks from "../obr/theme/addThemeCallbacks";
import applyTheme from "../obr/theme/applyTheme";

(async function action() {
  const obr = await obrIsReady();
  await sceneIsReady(obr);

  applyTheme(await obr.theme.getTheme());
  await addThemeCallbacks(obr);

  const main = document.createElement("main");
  document.body.append(main);

  const root = createRoot(main);
  root.render(
    <ContextProvider obr={obr}>
      <Action />
    </ContextProvider>,
  );
})();
