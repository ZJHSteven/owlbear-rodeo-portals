import { Item, ItemFilter, Path, Vector2 } from "@owlbear-rodeo/sdk";
import { Obr } from "../../obr/types";
import setIndicatorPosition, {
  Heads,
} from "../../ui/canvas/indicator/setIndicatorPosition";
import hasDestination from "../read/destination/hasDestination";
import setDestination from "../read/destination/setDestination";
import createIndicator from "../../ui/canvas/indicator/createIndicator";
import getItemBounds, {
  isSupported,
  SupportedItem,
} from "../../obr/scene/items/getItemBounds";

export enum Direction {
  ONE_WAY,
  TWO_WAY,
}

let origin: SupportedItem | null = null;
let indicatorId: string | null = null;

export async function setTarget(
  obr: Obr,
  target?: Item,
  direction: Direction = Direction.ONE_WAY,
) {
  if (origin === null) {
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

  if (!isSupported(target)) {
    throw "Unsupported token type.";
  }

  if (hasDestination(target)) {
    throw "This token already has a destination.";
  }

  origin = target;
  await addIndicator(obr, target, direction);
}

async function addIndicator(
  obr: Obr,
  origin: SupportedItem,
  direction: Direction,
) {
  if (indicatorId !== null) {
    throw "Indicator already set.";
  }

  const theme = await obr.theme.getTheme();
  const boundingBox = await getItemBounds(origin);
  const indicator = setIndicatorPosition(
    createIndicator(theme, origin.id),
    boundingBox,
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

  if (origin === null) {
    throw "Origin is not set.";
  }

  if (!isSupported(target)) {
    throw "Unsupported token type.";
  }

  const error = checkDestination(direction, origin, target);
  if (error !== null) {
    throw error;
  }

  const destinations: Record<string, SupportedItem> = { [origin.id]: target };
  if (direction === Direction.TWO_WAY) {
    destinations[target.id] = origin;
  }

  const filter: ItemFilter<Item> = Object.keys(destinations);
  await obr.scene.items.updateItems(filter, (items) => {
    for (let item of items) {
      setDestination(item, destinations[item.id]);
    }
  });

  return true;
}

function checkDestination(
  direction: Direction,
  origin: Item,
  target: SupportedItem,
): string | null {
  if (target.id === origin.id) {
    return direction === Direction.ONE_WAY
      ? "Origin and destination cannot be the same token."
      : "The two sides of a portal cannot be the same token.";
  }

  if (hasDestination(origin)) {
    return direction === Direction.ONE_WAY
      ? "The origin already has a destination."
      : "The first side of the portal already has a destination.";
  }

  if (direction === Direction.TWO_WAY && hasDestination(target)) {
    return "The second side of the portal already has a destination.";
  }

  return null;
}

export async function updateIndicator(
  obr: Obr,
  position: Vector2,
  direction: Direction,
  target?: Item,
) {
  if (indicatorId === null || origin == null) {
    return;
  }

  const originBoundingBox = await getItemBounds(origin);

  const destinationBoundingBox =
    target &&
    isSupported(target) &&
    isValidDestination(direction, origin, target)
      ? await getItemBounds(target)
      : undefined;

  await obr.scene.local.updateItems<Path>([indicatorId], (items) => {
    for (let item of items) {
      // work-around race-condition: indicator might get deleted before this callback function gets called
      if (item === null) {
        continue;
      }

      setIndicatorPosition(
        item,
        originBoundingBox,
        position,
        mapDirectionToArrowHeads(direction),
        destinationBoundingBox,
      );
    }
  });
}

function isValidDestination(
  direction: Direction,
  origin: Item,
  target: SupportedItem,
) {
  return checkDestination(direction, origin, target) === null;
}

export async function reset(obr: Obr) {
  origin = null;
  if (indicatorId === null) {
    return;
  }

  await obr.scene.local.deleteItems([indicatorId]);
  indicatorId = null;
}
