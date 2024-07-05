import { Curve, Item, ItemFilter, Vector2 } from "@owlbear-rodeo/sdk";
import { Obr } from "../../obr/types";
import { requireOne } from "../../data/array";
import setIndicatorPosition, {
  Heads,
} from "../../ui/canvas/indicator/setIndicatorPosition";
import hasDestination from "../read/destination/hasDestination";
import setDestination from "../read/destination/setDestination";
import createIndicator from "../../ui/canvas/indicator/createIndicator";

export enum Direction {
  ONE_WAY,
  TWO_WAY,
}

let originId: string | null = null;
let indicatorId: string | null = null;

export async function setTarget(
  obr: Obr,
  target?: Item,
  direction: Direction = Direction.ONE_WAY,
) {
  if (originId === null) {
    return start(obr, direction, target);
  }

  return finish(obr, direction, target)
    .then((done) => {
      if (done) {
        reset(obr);
      }

      return done;
    })
    .catch((error) => {
      reset(obr);
      throw error;
    });
}

async function start(obr: Obr, direction: Direction, target?: Item) {
  if (target === undefined) {
    throw direction === Direction.ONE_WAY
      ? "Click on a token to set the origin."
      : "Click on a token to set first side of the portal.";
  }

  if (hasDestination(target)) {
    throw "This token already has a destination.";
  }

  if (target.layer === "MAP") {
    return;
  }

  originId = target.id;
  await addIndicator(obr, target, direction);
}

async function addIndicator(obr: Obr, origin: Item, direction: Direction) {
  if (indicatorId !== null) {
    throw "Indicator already set.";
  }

  const theme = await obr.theme.getTheme();
  const indicator = setIndicatorPosition(
    createIndicator(theme, origin.id),
    origin.position,
    origin.position,
    mapDirectionToArrowHeads(direction),
  );

  indicatorId = indicator.id;
  await obr.scene.local.addItems([indicator]);
}

function mapDirectionToArrowHeads(direction: Direction): Heads {
  return direction === Direction.ONE_WAY ? Heads.END : Heads.BOTH;
}

async function finish(obr: Obr, direction: Direction, target?: Item) {
  if (target === undefined) {
    return false;
  }

  if (originId === null) {
    throw "Origin is not set.";
  }

  if (target.id === originId) {
    throw direction === Direction.ONE_WAY
      ? "Origin and destination cannot be the same token."
      : "The two sides of a portal cannot be the same token.";
  }

  const origin = await getOrigin(obr);
  if (target.layer !== origin.layer) {
    throw direction === Direction.ONE_WAY
      ? "Origin and destination must be on the same layer."
      : "Both sides of the portal must be on the same layer.";
  }

  if (hasDestination(origin)) {
    throw direction === Direction.ONE_WAY
      ? "The origin already has a destination."
      : "The first side of the portal already has a destination.";
  }

  if (direction === Direction.TWO_WAY && hasDestination(target)) {
    throw "The second side of the portal already has a destination.";
  }

  const destinationIds: Record<string, string> = { [originId]: target.id };
  if (direction === Direction.TWO_WAY) {
    destinationIds[target.id] = originId;
  }

  const filter: ItemFilter<Item> = Object.keys(destinationIds);
  await obr.scene.items.updateItems(filter, (items) => {
    for (let item of items) {
      setDestination(item, destinationIds[item.id]);
    }
  });

  return true;
}

async function getOrigin(obr: Obr) {
  return obr.scene.items
    .getItems(({ id }) => id === originId)
    .then(requireOne<Item>);
}

export async function updateIndicator(
  obr: Obr,
  position: Vector2,
  direction: Direction = Direction.ONE_WAY,
) {
  if (indicatorId === null) {
    return;
  }

  const origin = await getOrigin(obr);
  await obr.scene.local.updateItems<Curve>([indicatorId], (items) => {
    for (let item of items) {
      setIndicatorPosition(
        item,
        origin.position,
        position,
        mapDirectionToArrowHeads(direction),
      );
    }
  });
}

export async function reset(obr: Obr) {
  originId = null;
  if (indicatorId === null) {
    return;
  }

  await obr.scene.local.deleteItems([indicatorId]);
  indicatorId = null;
}
