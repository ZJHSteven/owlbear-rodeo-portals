import { Obr } from "../../../obr/types";
import { TOOL_ID } from "../createTool";
import createIconUrl from "../../../fontAwesome/createIconUrl";
import { DIRECTION_METADATA_ID } from "../createToolModes";
import { Direction } from "../../../crud/create/link";

export default async function createToggleDirectionAction(obr: Obr) {
  await obr.tool.createAction({
    id: `${TOOL_ID}/action/toggle-direction`,
    icons: [
      {
        label: "Enable Two-Way Mode",
        icon: createIconUrl("arrow-right-solid.svg"),
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
          metadata: [
            {
              key: DIRECTION_METADATA_ID,
              value: Direction.ONE_WAY,
            },
          ],
        },
      },
      {
        icon: createIconUrl("arrows-left-right-solid.svg"),
        label: "Enable One-Way Mode",
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
          metadata: [
            {
              key: DIRECTION_METADATA_ID,
              value: Direction.TWO_WAY,
            },
          ],
        },
      },
    ],
    async onClick(context) {
      const direction =
        context.metadata[DIRECTION_METADATA_ID] === Direction.ONE_WAY
          ? Direction.TWO_WAY
          : Direction.ONE_WAY;

      await obr.tool.setMetadata(TOOL_ID, {
        [DIRECTION_METADATA_ID]: direction,
      });
    },
  });
}
