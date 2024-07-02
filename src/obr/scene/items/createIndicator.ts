import {buildLine, buildRuler, Vector2} from "@owlbear-rodeo/sdk";
import {OBR} from "../../types";

export default function createIndicator(obr: OBR, start: Vector2, end: Vector2) {
  return buildLine()
    .layer("POPOVER")
    .startPosition(start)
    .endPosition(end)
    .disableHit(true)
    .strokeWidth(5)
    .strokeDash([10, 10])
    .strokeColor(obr.theme.primary.main)
    .build();
}
