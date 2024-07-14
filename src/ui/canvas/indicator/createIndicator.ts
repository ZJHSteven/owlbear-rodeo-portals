import { buildPath, Path, Theme } from "@owlbear-rodeo/sdk";
import { EXTENSION_ID } from "../../../constants";

export const INDICATOR_ORIGIN_ID_METADATA_ID = `${EXTENSION_ID}/indicator/origin-id`;

export default function createIndicator(theme: Theme, originId: string): Path {
  const color = getIndicatorColor(theme);
  return buildPath()
    .layer("POPOVER")
    .disableHit(true)
    .strokeWidth(5)
    .strokeColor(color)
    .fillColor(color)
    .fillOpacity(0.2)
    .position({ x: 0, y: 0 })
    .metadata({ [INDICATOR_ORIGIN_ID_METADATA_ID]: originId })
    .build();
}

export function getIndicatorColor(theme: Theme): string {
  return theme.primary.main;
}
