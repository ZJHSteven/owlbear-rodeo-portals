import { Obr } from "../../../obr/types";
import { onLinkVisibilityChange } from "./toggleLinkVisibility";
import updateLinkIndicatorsVisibility, {
  applyLinkIndicatorVisibility,
} from "./updateLinkIndicatorsVisibility";
import updateLinkIndicatorsTheme from "./updateLinkIndicatorsTheme";
import onSceneItemsChange from "../../../obr/scene/items/onSceneItemsChange";

export default async function addLinkIndicatorsCallbacks(obr: Obr) {
  onLinkVisibilityChange((linkVisibility) =>
    updateLinkIndicatorsVisibility(obr, linkVisibility),
  );
  obr.theme.onChange((theme) => updateLinkIndicatorsTheme(obr, theme));
  onSceneItemsChange(obr, async () => await applyLinkIndicatorVisibility(obr));
}
