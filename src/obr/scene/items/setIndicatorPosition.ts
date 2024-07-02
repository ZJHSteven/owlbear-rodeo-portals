import {Curve, Vector2} from "@owlbear-rodeo/sdk";

const HEAD_LENGTH = 30;
const HEAD_ANGLE = Math.PI / 6;

export default function setIndicatorPosition(indicator: Curve, start: Vector2, end: Vector2): Curve {
  indicator.points = [
    start,
    end
  ];

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);

  const leftX = end.x - HEAD_LENGTH * Math.cos(angle - HEAD_ANGLE);
  const leftY = end.y - HEAD_LENGTH * Math.sin(angle - HEAD_ANGLE);

  const rightX = end.x - HEAD_LENGTH * Math.cos(angle + HEAD_ANGLE);
  const rightY = end.y - HEAD_LENGTH * Math.sin(angle + HEAD_ANGLE);

  indicator.points.push(
    { x: leftX, y: leftY },
    end,
    { x: rightX, y: rightY },
  );

  return indicator;
}
