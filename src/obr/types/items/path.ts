import { Command, LineCommand, MoveCommand, Vector2 } from "@owlbear-rodeo/sdk";

export function move(position: Vector2): MoveCommand {
  return [Command.MOVE, position.x, position.y];
}

export function line(position: Vector2): LineCommand {
  return [Command.LINE, position.x, position.y];
}
