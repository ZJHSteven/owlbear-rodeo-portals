import { buildCurve, Curve, Theme } from "@owlbear-rodeo/sdk";
import { EXTENSION_ID } from "../../../constants";

export const INDICATOR_ORIGIN_ID_METADATA_ID = `${EXTENSION_ID}/indicator/origin-id`;

export default function createIndicator(theme: Theme, originId: string): Curve {
  return buildCurve()
    .layer("POPOVER")
    .disableHit(true)
    .strokeWidth(5)
    .strokeColor(getIndicatorStrokeColor(theme))
    .fillOpacity(0)
    .position({ x: 0, y: 0 })
    .closed(false)
    .tension(0)
    .metadata({ [INDICATOR_ORIGIN_ID_METADATA_ID]: originId })
    .build();
}

export function getIndicatorStrokeColor(theme: Theme): string {
  return theme.primary.main;
}
