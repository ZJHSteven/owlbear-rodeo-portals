import { Obr } from "../../../obr/types";
import { TOOL_ID } from "../../../background/tool/createTool";
import createIconUrl from "../../../css/createIconUrl";

export default async function createAddOneWayMode(obr: Obr) {
  return;
}

/*
  let origin: Item | null = null;
  let indicatorId: string | null = null;

  async function setOriginOrDestination(event: ToolEvent) {
    if (origin === null) {
      origin = await setOrigin(event.target);
      if (origin === null) {
        return;
      }

      return addIndicator(origin);
    }

    return setDestination(origin, event.target);
  }

  async function setOrigin(item?: Item) {
    if (item === undefined) {
      return Promise.reject("Click on a token to set the origin.");
    }

    if (item.metadata[DESTINATION_ID_METADATA_ID]) {
      return Promise.reject("This token already has a destination.");
    }

    if (item.layer === "MAP") {
      return Promise.resolve(null);
    }

    return Promise.resolve(origin = item);
  }

  async function setDestination(origin: Item, destination?: Item) {
    if (destination === undefined) {
      await reset();
      return;
    }

    if (destination === origin) {
      return Promise.reject("Origin and destination cannot be the same token.");
    }

    if (destination.layer !== origin.layer) {
      await reset();
      return Promise.reject("Origin and destination must be on the same layer.");
    }

    if (origin.metadata[DESTINATION_ID_METADATA_ID]) {
      await reset();
      return Promise.reject("The origin already has a destination.");
    }

    await obr.scene.items.updateItems(
      [origin],
      (items) => {
        for (let item of items) {
          item.metadata[DESTINATION_ID_METADATA_ID] = destination.id;
        }
      }
    );

    await obr.notification.show("Link has been created.", "SUCCESS");
    await reset();
  }

  async function reset() {
    origin = null;
    if (indicatorId === null) {
      return Promise.resolve();
    }

    await obr.scene.local.deleteItems([indicatorId]);
    indicatorId = null;
  }

  async function addIndicator(origin: Item) {
    const indicator = setIndicatorPosition(createIndicator(obr), origin.position, origin.position);
    await obr.scene.local.addItems([indicator]);
    indicatorId = indicator.id;
  }

  function updateIndicator(event: ToolEvent) {
    if (indicatorId === null || origin === null) {
      return;
    }

    const start = origin.position;
    const end = event.pointerPosition;
    obr.scene.local.updateItems<Curve>(
      [indicatorId],
      (items) => {
        for (let item of items) {
          setIndicatorPosition(item, start, end);
        }
      }
    )
  }
 */
