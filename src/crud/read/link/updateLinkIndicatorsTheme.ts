import { Obr } from "../../../obr/types";
import { Curve, Theme } from "@owlbear-rodeo/sdk";
import { isIndicator } from "./updateLinkIndicatorsVisibility";
import { getIndicatorColor } from "../../../ui/canvas/indicator/createIndicator";

export default async function updateLinkIndicatorsTheme(
  obr: Obr,
  theme: Theme,
) {
  const color = getIndicatorColor(theme);
  await obr.scene.local.updateItems<Curve>(isIndicator, (indicators) => {
    for (let indicator of indicators) {
      indicator.style.strokeColor = color;
      indicator.style.fillColor = color;
    }
  });
}
