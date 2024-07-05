import { Curve, Vector2 } from "@owlbear-rodeo/sdk";

const HEAD_LENGTH = 30;
const HEAD_ANGLE = Math.PI / 6;

export enum Heads {
  END,
  BOTH,
}

export default function setIndicatorPosition(
  indicator: Curve,
  start: Vector2,
  end: Vector2,
  heads: Heads = Heads.END,
): Curve {
  indicator.points = [];

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);

  if (heads == Heads.BOTH) {
    indicator.points.push(...createArrowHead(dx, dy, angle, start, true));
  }

  indicator.points.push(start, end);
  indicator.points.push(...createArrowHead(dx, dy, angle, end, false));
  return indicator;
}

function createArrowHead(
  dx: number,
  dy: number,
  angle: number,
  tip: Vector2,
  isStart: boolean,
): Vector2[] {
  const direction = isStart ? 1 : -1;
  const leftX = tip.x + HEAD_LENGTH * Math.cos(angle - HEAD_ANGLE) * direction;
  const leftY = tip.y + HEAD_LENGTH * Math.sin(angle - HEAD_ANGLE) * direction;

  const rightX = tip.x + HEAD_LENGTH * Math.cos(angle + HEAD_ANGLE) * direction;
  const rightY = tip.y + HEAD_LENGTH * Math.sin(angle + HEAD_ANGLE) * direction;

  return [{ x: leftX, y: leftY }, tip, { x: rightX, y: rightY }];
}
