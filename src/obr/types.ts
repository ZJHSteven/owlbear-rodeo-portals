import OBR, { Vector2 } from "@owlbear-rodeo/sdk";

export type Obr = typeof OBR;

export function isVector2(vector: unknown): vector is Vector2 {
  return (
    vector !== undefined &&
    vector !== null &&
    typeof vector === "object" &&
    "x" in vector &&
    typeof vector.x === "number" &&
    "y" in vector &&
    typeof vector.y === "number"
  );
}
