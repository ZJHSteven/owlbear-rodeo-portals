import { BoundingBox, Path, PathCommand, Vector2 } from "@owlbear-rodeo/sdk";
import { line, move } from "../../../obr/types/items/path";

const HEAD_LENGTH = 30;
const HEAD_ANGLE = Math.PI / 6;

export enum Heads {
  END,
  BOTH,
}

export default function setIndicatorPosition(
  indicator: Path,
  startBoundingBox: BoundingBox,
  endPosition: Vector2,
  heads: Heads = Heads.END,
  endBoundingBox?: BoundingBox,
): Path {
  indicator.commands = [];

  if (endBoundingBox !== undefined) {
    endPosition = endBoundingBox.center;
    if (heads == Heads.BOTH) {
      indicator.commands.push(...createArrowTail(endBoundingBox));
    }
  }

  const dx = endPosition.x - startBoundingBox.center.x;
  const dy = endPosition.y - startBoundingBox.center.y;
  const angle = Math.atan2(dy, dx);

  if (heads == Heads.BOTH) {
    indicator.commands.push(
      ...createArrowHead(angle, startBoundingBox.center, true),
    );
  }

  indicator.commands.push(...createArrowTail(startBoundingBox));
  indicator.commands.push(move(startBoundingBox.center), line(endPosition));

  indicator.commands.push(...createArrowHead(angle, endPosition, false));
  return indicator;
}

function createArrowHead(
  angle: number,
  tip: Vector2,
  isStart: boolean,
): PathCommand[] {
  const direction = isStart ? 1 : -1;
  const leftX = tip.x + HEAD_LENGTH * Math.cos(angle - HEAD_ANGLE) * direction;
  const leftY = tip.y + HEAD_LENGTH * Math.sin(angle - HEAD_ANGLE) * direction;

  const rightX = tip.x + HEAD_LENGTH * Math.cos(angle + HEAD_ANGLE) * direction;
  const rightY = tip.y + HEAD_LENGTH * Math.sin(angle + HEAD_ANGLE) * direction;

  return [
    move({ x: leftX, y: leftY }),
    line(tip),
    line({ x: rightX, y: rightY }),
  ];
}

function createArrowTail(tail: BoundingBox): PathCommand[] {
  return [
    move(tail.min),
    line({ x: tail.min.x, y: tail.max.y }),
    line(tail.max),
    line({ x: tail.max.x, y: tail.min.y }),
    line(tail.min),
  ];
}
