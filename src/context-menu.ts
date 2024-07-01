"use strict";

import OBR, {buildLine, Item, Line, Math2, Vector2} from "@owlbear-rodeo/sdk";
import {EXTENSION_ID} from "./constants";
import createIconUrl from "./createIconUrl";

if (location.hostname === "localhost") {
  (window as any).OBR = OBR;
}

const TOOL_ID = `${EXTENSION_ID}/tool`;
const START_MODE_ID = `${EXTENSION_ID}/tool/start`;
const ENTER_MODE_ID = `${EXTENSION_ID}/tool/enter`;

const OTHER_ID_METADATA_ID = `${EXTENSION_ID}/link/otherId`;
const JUST_TELEPORTED_METADATA_ID = `${EXTENSION_ID}/just/teleported`;

let startId: string | null = null;
let indicatorId: string | null = null;
let enterIds: string[];

type StringToVector2 = {
  [key: string]: Vector2 | undefined
};

let knownPositions: StringToVector2 = {};

OBR.onReady(() => {
  OBR.contextMenu.create({
    id: `${EXTENSION_ID}/context-menu/start`,
    icons: [
      {
        icon: createIconUrl("dungeon-solid.svg"),
        label: "Create Portal Link",
        filter: {
          min: 1,
          max: 1,
        },
      },
    ],
    onClick(context) {
      OBR.tool.activateTool(TOOL_ID);
      OBR.tool.activateMode(TOOL_ID, START_MODE_ID);

      startId = context.items[0].id;

      const position = context.selectionBounds.center;
      const indicator = buildLine()
        .layer("POPOVER")
        .strokeDash([5, 5])
        .strokeWidth(2)
        .startPosition(position)
        .endPosition(position)
        .disableHit(true)
        .build();

      indicatorId = indicator.id;

      OBR.scene.local.addItems([indicator]);
      OBR.player.deselect();
    },
  });

  OBR.contextMenu.create({
    id: `${EXTENSION_ID}/context-menu/`,
    icons: [
      {
        icon: createIconUrl("arrow-right-to-bracket-solid.svg"),
        label: "Enter Portal",
      }
    ],
    onClick(context) {
      OBR.tool.activateTool(TOOL_ID);
      OBR.tool.activateMode(TOOL_ID, ENTER_MODE_ID);

      enterIds = context.items.map(({id}) => id);

      OBR.player.deselect();
    }
  })

  OBR.tool.create({
    id: TOOL_ID,
    icons: [
      {
        icon: createIconUrl("dungeon-solid.svg"),
        label: "Portals",
      }
    ],
  });

  OBR.tool.createMode({
    id: ENTER_MODE_ID,
    icons: [
      {
        icon: createIconUrl("arrow-right-to-bracket-solid.svg"),
        label: "Enter Portal",
        filter: {
          activeTools: [TOOL_ID],
        }
      }
    ],
    cursors: [
      {
        cursor: "crosshair"
      }
    ],
    onToolClick(context, event) {
      if (event.target === undefined) {
        return;
      }

      const targetId = event.target.metadata[OTHER_ID_METADATA_ID] as string;
      if (targetId === undefined) {
        console.log("no target id");
        return;
      }

      const sourcePosition = event.target.position;
      OBR.scene.items.getItems([targetId])
        .then((items) => {
          const targetPosition = items[0].position;
          const movement = {
            x: targetPosition.x - sourcePosition.x,
            y: targetPosition.y - sourcePosition.y,
          }

          OBR.scene.items.updateItems(enterIds, (items) => {
            for (let item of items) {
              item.position = {
                x: item.position.x + movement.x,
                y: item.position.y + movement.y,
              }
            }
          })
        });
    }
  })

  OBR.tool.createMode({
    id: START_MODE_ID,
    icons: [
      {
        icon: createIconUrl("plus-solid.svg"),
        label: "Create Portal Link",
        filter: {
          activeTools: [TOOL_ID],
        }
      },
    ],
    onToolMove(context, event) {
      if (indicatorId === null) {
        return;
      }

      OBR.scene.local.updateItems<Line>(
        [indicatorId],
        (items) => {
          for (let item of items) {
            item.endPosition = event.pointerPosition;
          }
        },
        true
      );
    },
    onToolClick(context, event) {
      if (indicatorId === null || startId === null) {
        return;
      }

      if (event.target === undefined) {
        OBR.scene.local.deleteItems([indicatorId]);
        return;
      }

      OBR.scene.items.updateItems(
        [event.target],
        (items) => {
          for (let item of items) {
            item.metadata[OTHER_ID_METADATA_ID] = startId;
          }
        }
      );

      const targetId = event.target.id;
      OBR.scene.items.updateItems<Item>(
        [startId],
        (items) => {
          for (let item of items) {
            item.metadata[OTHER_ID_METADATA_ID] = targetId;
          }
        }
      )

      OBR.scene.local.deleteItems([indicatorId]);
      startId = null;
      indicatorId = null;
    },
    onDeactivate() {
      if (indicatorId === null) {
        return;
      }

      OBR.scene.local.deleteItems([indicatorId]);
    }
  });

  OBR.scene.items.onChange((items) => {
    const teleportedIds = items
      .filter(({metadata}) => metadata[JUST_TELEPORTED_METADATA_ID])
      .map(({id}) => id);

    OBR.scene.items.updateItems(teleportedIds, (items) => {
      for (let item of items) {
        delete item.metadata[JUST_TELEPORTED_METADATA_ID];
      }
    });

    const movedItems = items.filter(({id, position, metadata}) => {
      if (metadata[OTHER_ID_METADATA_ID] !== undefined || teleportedIds.includes(id)) {
        return false;
      }

      const knownPosition = knownPositions[id];
      if (knownPosition === undefined) {
        return false;
      }

      const distance = Math2.distance(position, knownPosition);
      return distance !== 0;
    });

    knownPositions = {};
    items.forEach(({id, position}) => knownPositions[id] = position);

    if (movedItems.length === 0) {
      return;
    }

    OBR.scene.items
      .getItems((item): boolean => item.metadata[OTHER_ID_METADATA_ID] !== undefined)
      .then(portals => Promise.all(portals.map((portal) => OBR.scene.items.getItemBounds([portal.id]).then(bounds => ({
        portal,
        bounds
      })))))
      .then(all => {
        movedItems.forEach(item => {
          const collision = all.find(({portal, bounds}) =>
            bounds.min.x <= item.position.x && item.position.x <= bounds.max.x &&
            bounds.min.y <= item.position.y && item.position.y <= bounds.max.y
          );

          if (collision === undefined) {
            return;
          }

          const targetId = collision.portal.metadata[OTHER_ID_METADATA_ID] as string;
          OBR.scene.items.getItems([targetId])
            .then(items => {
              const targetPosition = items[0].position;
              OBR.scene.items.updateItems([item], (items) => {
                for (let item of items) {
                  item.metadata[JUST_TELEPORTED_METADATA_ID] = true;
                  item.position = targetPosition;
                }
              })
            });
        })
      });
  });
});
