import { Item, ItemFilter, Path, Vector2 } from "@owlbear-rodeo/sdk";
import { Obr } from "../../obr/types";
import { errors } from "../../i18n/strings";
import setIndicatorPosition, {
  Heads,
} from "../../ui/canvas/indicator/setIndicatorPosition";
import hasDestination from "../read/destination/hasDestination";
import setDestination, {
  setDestinations,
} from "../read/destination/setDestination";
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

export async function setLinkTarget(
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
        resetLink(obr);
      }

      return done;
    })
    .catch((error) => {
      resetLink(obr);
      throw error;
    });
}

async function start(obr: Obr, direction: Direction, target?: Item) {
  if (target === undefined) {
    throw direction === Direction.ONE_WAY
      ? errors.clickToSetOrigin
      : errors.clickToSetFirstSide;
  }

  if (!isSupported(target)) {
    throw errors.unsupportedToken;
  }

  if (hasDestination(target)) {
    throw errors.tokenAlreadyHasDestination;
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
    throw errors.indicatorAlreadySet;
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
    throw errors.originNotSet;
  }

  if (!isSupported(target)) {
    throw errors.unsupportedToken;
  }

  const error = checkDestination(direction, origin, target);
  if (error !== null) {
    throw error;
  }

  await setDestinations(obr, origin, target, direction);
  return true;
}

function checkDestination(
  direction: Direction,
  origin: Item,
  target: SupportedItem,
): string | null {
  if (target.id === origin.id) {
    return direction === Direction.ONE_WAY
      ? errors.sameOriginAndDestination
      : errors.samePortalSides;
  }

  if (hasDestination(origin)) {
    return direction === Direction.ONE_WAY
      ? errors.originHasDestination
      : errors.firstSideHasDestination;
  }

  if (direction === Direction.TWO_WAY && hasDestination(target)) {
    return errors.secondSideHasDestination;
  }

  return null;
}

export async function updateLinkIndicator(
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

export async function resetLink(obr: Obr) {
  origin = null;
  if (indicatorId === null) {
    return;
  }

  await obr.scene.local.deleteItems([indicatorId]);
  indicatorId = null;
}
