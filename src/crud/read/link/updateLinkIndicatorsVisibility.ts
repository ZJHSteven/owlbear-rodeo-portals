import { Obr } from "../../../obr/types";
import { BoundingBox, Item, Path, Theme, Vector2 } from "@owlbear-rodeo/sdk";
import setIndicatorPosition from "../../../ui/canvas/indicator/setIndicatorPosition";
import createIndicator, {
  INDICATOR_ORIGIN_ID_METADATA_ID,
} from "../../../ui/canvas/indicator/createIndicator";
import { findOrigins } from "../origin/findOrigins";
import { findDestination } from "../destination/findDestination";
import { TOOL_ID } from "../../../background/tool/createTool";
import {
  DEFAULT_LINK_VISIBILITY,
  LINK_VISIBILITY_METADATA_ID,
} from "./toggleLinkVisibility";

type Portal = {
  originId: string;
  start: BoundingBox;
  end: Vector2;
};

type Updates = Record<string, Portal>;

type Diff = {
  added: Portal[];
  updated: Updates;
  deleted: string[];
};

export default async function updateLinkIndicatorsVisibility(
  obr: Obr,
  linkVisibility: boolean,
) {
  const theme = await obr.theme.getTheme();
  const role = await obr.player.getRole();
  const diff: Diff =
    linkVisibility && role === "GM"
      ? await findDiff(obr)
      : { added: [], updated: {}, deleted: await findIndicatorIds(obr) };

  await Promise.all([
    addIndicators(obr, theme, diff.added),
    updateIndicators(obr, diff.updated),
    deleteIndicators(obr, diff.deleted),
  ]);
}

async function findDiff(obr: Obr): Promise<Diff> {
  const [origins, indicators] = await Promise.all([
    findOrigins(obr),
    findIndicators(obr),
  ]);

  const added: Portal[] = [];
  const updated: Updates = {};
  const destinations: Record<string, Vector2> = {};

  for (let origin of origins) {
    const destination = await findDestination(obr, origin, destinations);
    if (destination === undefined) {
      console.error("unknown destination");
      continue;
    }

    const boundingBox = await obr.scene.items.getItemBounds([origin.id]);
    const portal = {
      originId: origin.id,
      start: boundingBox,
      end: destination,
    };

    const indicator = indicators.find(
      ({ metadata }) => metadata[INDICATOR_ORIGIN_ID_METADATA_ID] === origin.id,
    );
    if (indicator === undefined) {
      added.push(portal);
    } else {
      updated[indicator.id] = portal;
    }
  }

  const deleted = indicators
    .filter(({ id }) => !(id in updated))
    .map(({ id }) => id);

  return { added, updated, deleted };
}

async function findIndicatorIds(obr: Obr): Promise<string[]> {
  const indicators = await findIndicators(obr);
  return indicators.map(({ id }) => id);
}

async function findIndicators(obr: Obr): Promise<Item[]> {
  return obr.scene.local.getItems(isIndicator);
}

export function isIndicator({ metadata }: Item): boolean {
  return metadata[INDICATOR_ORIGIN_ID_METADATA_ID] !== undefined;
}

async function addIndicators(obr: Obr, theme: Theme, portals: Portal[]) {
  if (portals.length === 0) {
    return;
  }

  await obr.scene.local.addItems(
    portals.map((portal) =>
      setIndicatorPosition(
        createIndicator(theme, portal.originId),
        portal.start,
        portal.end,
      ),
    ),
  );
}

async function updateIndicators(obr: Obr, updates: Updates) {
  const keys = Object.keys(updates);
  if (keys.length === 0) {
    return;
  }

  await obr.scene.local.updateItems<Path>(keys, (indicators) => {
    for (let indicator of indicators) {
      const { start, end } = updates[indicator.id];
      setIndicatorPosition(indicator, start, end);
    }
  });
}

async function deleteIndicators(obr: Obr, ids: string[]) {
  if (ids.length === 0) {
    return;
  }

  await obr.scene.local.deleteItems(ids);
}

export async function applyLinkIndicatorVisibility(obr: Obr) {
  const visibility = await getVisibility(obr);
  await updateLinkIndicatorsVisibility(obr, visibility);
}

async function getVisibility(obr: Obr) {
  const metadata = await obr.tool.getMetadata(TOOL_ID);
  if (
    metadata === undefined ||
    metadata[LINK_VISIBILITY_METADATA_ID] === undefined
  ) {
    return DEFAULT_LINK_VISIBILITY;
  }

  return metadata[LINK_VISIBILITY_METADATA_ID] as boolean;
}
