import { Obr } from "../../../obr/types";
import { Curve, Theme } from "@owlbear-rodeo/sdk";
import { isIndicator } from "./updateLinkIndicatorsVisibility";
import { getIndicatorStrokeColor } from "../../../ui/canvas/indicator/createIndicator";

export default async function updateLinkIndicatorsTheme(
  obr: Obr,
  theme: Theme,
) {
  const strokeColor = getIndicatorStrokeColor(theme);
  await obr.scene.local.updateItems<Curve>(isIndicator, (indicators) => {
    for (let indicator of indicators) {
      indicator.style.strokeColor = strokeColor;
    }
  });
}
