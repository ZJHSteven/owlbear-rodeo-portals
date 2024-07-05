import { Obr } from "../../../obr/types";
import { onLinkVisibilityChange } from "./toggleLinkVisibility";
import updateLinkIndicatorsVisibility, {
  applyLinkIndicatorVisibility,
} from "./updateLinkIndicatorsVisibility";
import updateLinkIndicatorsTheme from "./updateLinkIndicatorsTheme";
import onItemsMove from "../../../obr/scene/items/onItemsMove";

export default async function addLinkIndicatorsCallbacks(obr: Obr) {
  onLinkVisibilityChange((linkVisibility) =>
    updateLinkIndicatorsVisibility(obr, linkVisibility),
  );
  obr.theme.onChange((theme) => updateLinkIndicatorsTheme(obr, theme));
  obr.scene.items.onChange(async () => await applyLinkIndicatorVisibility(obr));
}
