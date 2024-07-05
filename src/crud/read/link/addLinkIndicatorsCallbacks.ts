import { Obr } from "../../../obr/types";
import { onLinkVisibilityChange } from "./toggleLinkVisibility";
import updateLinkIndicatorsVisibility from "./updateLinkIndicatorsVisibility";
import updateLinkIndicatorsTheme from "./updateLinkIndicatorsTheme";

export default async function addLinkIndicatorsCallbacks(obr: Obr) {
  onLinkVisibilityChange((linkVisibility) =>
    updateLinkIndicatorsVisibility(obr, linkVisibility),
  );
  obr.theme.onChange((theme) => updateLinkIndicatorsTheme(obr, theme));
}
