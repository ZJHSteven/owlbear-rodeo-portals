import {buildCurve, Curve} from "@owlbear-rodeo/sdk";
import {OBR} from "../../types";

export default function createIndicator(obr: OBR): Curve {
  return buildCurve()
    .layer("POPOVER")
    .disableHit(true)
    .strokeWidth(5)
    .strokeColor(obr.theme.primary.main)
    .fillOpacity(0)
    .position({x: 0, y: 0})
    .closed(false)
    .tension(0)
    .build();
}
