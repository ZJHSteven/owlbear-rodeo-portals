import { Vector2 } from "@owlbear-rodeo/sdk";
import { Obr } from "../types";

export default async function gotoPosition(obr: Obr, position: Vector2) {
  const [scale, width, height] = await Promise.all([
    obr.viewport.getScale(),
    obr.viewport.getWidth(),
    obr.viewport.getHeight(),
  ]);

  await obr.viewport.setPosition({
    x: -position.x * scale + width / 2,
    y: -position.y * scale + height / 2,
  });
}
