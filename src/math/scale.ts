import { Vector2 } from "@owlbear-rodeo/sdk";

export default function scale(point: Vector2, center: Vector2, scale: Vector2) {
  return {
    x: (point.x - center.x) * scale.x + center.x,
    y: (point.y - center.y) * scale.y + center.y,
  };
}
