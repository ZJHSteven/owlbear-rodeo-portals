import deg2rad from "./deg2rad";
import { Vector2 } from "@owlbear-rodeo/sdk";

export default function rotate(
  point: Vector2,
  center: Vector2,
  degree: number,
) {
  const radians = deg2rad(degree);
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);

  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: dx * cos - dy * sin + center.x,
    y: dy * cos + dx * sin + center.y,
  };
}
