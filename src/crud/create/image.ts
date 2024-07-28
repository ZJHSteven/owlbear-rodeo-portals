import { buildImage, Image, ImageDownload, Vector2 } from "@owlbear-rodeo/sdk";
import { Direction } from "./link";
import { Obr } from "../../obr/types";
import {
  getDestinationImage,
  getOriginImage,
} from "../../background/tool/action/setImage";
import { setDestinations } from "../read/destination/setDestination";

let origin: Image | null = null;

export async function setImagePosition(
  obr: Obr,
  pointerPosition: Vector2,
  direction: Direction,
) {
  const originImage = getOriginImage();
  if (originImage === undefined) {
    throw "Set an image for origin.";
  }

  const destinationImage = getDestinationImage();
  if (destinationImage === undefined) {
    throw "Set an image for destination.";
  }

  if (origin === null) {
    return start(obr, pointerPosition, originImage, destinationImage);
  }

  return finish(obr, pointerPosition, destinationImage, direction).catch(
    (error) => {
      resetImage(obr);
      throw error;
    },
  );
}

async function start(
  obr: Obr,
  pointerPosition: Vector2,
  originImage: ImageDownload,
  destinationImage: ImageDownload,
) {
  origin = createImage(pointerPosition, originImage);
  await obr.scene.items.addItems([origin]);

  await removeIndicator(obr);
  indicator = createImage(pointerPosition, destinationImage);
  await obr.scene.local.addItems([indicator]);
}

function createImage(pointerPosition: Vector2, imageDownload: ImageDownload) {
  const builder = buildImage(imageDownload.image, imageDownload.grid)
    .name(imageDownload.name)
    .text(imageDownload.text)
    .textItemType(imageDownload.textItemType)
    .visible(imageDownload.visible)
    .locked(imageDownload.locked)
    .rotation(imageDownload.rotation)
    .scale(imageDownload.scale)
    .position(pointerPosition);
  if (imageDownload.description !== undefined) {
    builder.description(imageDownload.description);
  }

  return builder.build();
}

async function finish(
  obr: Obr,
  pointerPosition: Vector2,
  imageDownload: ImageDownload,
  direction: Direction,
) {
  if (origin === null) {
    throw "Origin is not set.";
  }

  const destination = createImage(pointerPosition, imageDownload);
  await obr.scene.items.addItems([destination]);
  await setDestinations(obr, origin, destination, direction);

  origin = null;
  await removeIndicator(obr);
  return true;
}

export async function resetImage(obr: Obr) {
  await removeIndicator(obr);
  if (origin !== null) {
    await obr.scene.items.deleteItems([origin.id]);
    origin = null;
  }
}

async function removeIndicator(obr: Obr) {
  if (indicator !== null) {
    await obr.scene.local.deleteItems([indicator.id]);
    indicator = null;
  }
}

let indicator: Image | null = null;

export async function updateImageIndicator(obr: Obr, pointerPosition: Vector2) {
  if (indicator === null) {
    const originImage = getOriginImage();
    const destinationImage = getDestinationImage();
    if (originImage === undefined || destinationImage === undefined) {
      return;
    }

    indicator =
      origin === null
        ? createImage(pointerPosition, originImage)
        : createImage(pointerPosition, destinationImage);

    await obr.scene.local.addItems([indicator]);
    return;
  }

  await obr.scene.local.updateItems([indicator], (items) => {
    for (let item of items) {
      item.position = pointerPosition;
    }
  });
}
