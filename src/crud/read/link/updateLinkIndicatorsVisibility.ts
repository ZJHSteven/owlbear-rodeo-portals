import {Obr} from "../../../obr/types";
import {Curve, Item, Theme, Vector2} from "@owlbear-rodeo/sdk";
import setIndicatorPosition, {
  Heads
} from "../../../ui/canvas/indicator/setIndicatorPosition";
import createIndicator, {
  INDICATOR_METADATA_ID
} from "../../../ui/canvas/indicator/createIndicator";

type Portal = {
  start: Vector2,
  end: Vector2,
  heads: Heads
};

type Updates = Record<string, Portal>;

type Diff = {
  added: Portal[],
  updated: Updates,
  deleted: string[],
}

export default async function updateLinkIndicatorsVisibility(obr: Obr, linkVisibility: boolean) {
  const theme = await obr.theme.getTheme();
  const diff = linkVisibility
    ? await findDiff(obr)
    : {added: [], updated: [], deleted: await findIndicatorIds(obr)};

  await Promise.all([
    addIndicators(obr, theme, diff.added),
    updateIndicators(obr, diff.updated),
    deleteIndicators(obr, diff.deleted),
  ]);
}

async function findDiff(obr: Obr): Promise<Diff> {
  /*
    const origins = await findOrigins(obr);
    const destinations: Record<string, Vector2> = {};
    const indicators = await Promise.all(origins.map(async (portal) => {
      const destination = await getDestination(obr, portal, destinations);
    }));

   */
}

async function findIndicatorIds(obr: Obr): Promise<string[]> {
  const items = await obr.scene.local.getItems(isIndicator);
  return items.map(({id}) => id);
}

export function isIndicator({metadata}: Item) {
  return !!metadata[INDICATOR_METADATA_ID]
}

async function addIndicators(obr: Obr, theme: Theme, portals: Portal[]) {
  if (portals.length === 0) {
    return;
  }

  await obr.scene.local.addItems(
    portals.map(portal => setIndicatorPosition(
      createIndicator(theme),
      portal.start,
      portal.end,
      portal.heads
    )));
}

async function updateIndicators(obr: Obr, updates: Updates) {
  const keys = Object.keys(updates);
  if (keys.length === 0) {
    return;
  }

  await obr.scene.local.updateItems<Curve>(
    keys,
    indicators => {
      for (let indicator of indicators) {
        const {start, end, heads} = updates[indicator.id];
        setIndicatorPosition(indicator, start, end, heads);
      }
    }
  )
}

async function deleteIndicators(obr: Obr, ids: string[]) {
  if (ids.length === 0) {
    return;
  }

  await obr.scene.local.deleteItems(ids);
}
