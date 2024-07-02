import {OBR} from "../../obr/types";
import {TOOL_ID} from "../createPortalTool";
import createIconUrl from "../../createIconUrl";
import {findPortals} from "../../findPortals";
import {Vector2} from "@owlbear-rodeo/sdk";
import createIndicator from "../../obr/scene/items/createIndicator";
import {getDestination} from "../../getDestination";
import setIndicatorPosition from "../../obr/scene/items/setIndicatorPosition";

export const LINK_VISIBILITY_METADATA_ID = "links-visible";

export default async function createToggleLinkVisibilityAction(obr: OBR) {
  let indicatorIds: string[] = [];
  async function showIndicators() {
    const portals = await findPortals(obr);
    const destinations: Record<string, Vector2> = {};
    const indicators = await Promise.all(portals.map(async (portal) => {
      const destination = await getDestination(obr, portal, destinations);
      return setIndicatorPosition(createIndicator(obr), portal.position, destination);
    }));

    await obr.scene.local.addItems(indicators);
    indicatorIds = indicators.map(({id}) => id);
  }

  async function hideIndicators() {
    return obr.scene.local.deleteItems(indicatorIds);
  }

  return obr.tool.createAction({
    id: `${TOOL_ID}/action/toggle-link-visibility`,
    icons: [
      {
        icon: createIconUrl("eye-slash-regular.svg"),
        label: "Show Links",
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
          metadata: [
            {
              key: LINK_VISIBILITY_METADATA_ID,
              value: false,
              coordinator: "||"
            }
          ]
        }
      },
      {
        icon: createIconUrl("eye-regular.svg"),
        label: "Hide Links",
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
          metadata: [
            {
              key: LINK_VISIBILITY_METADATA_ID,
              value: true
            }
          ]
        }
      },
    ],
    async onClick(context) {
      const newVisibility = !context.metadata[LINK_VISIBILITY_METADATA_ID];
      await obr.tool.setMetadata(context.activeTool, {[LINK_VISIBILITY_METADATA_ID]: newVisibility});

      if (newVisibility) {
        return showIndicators();
      }

      return hideIndicators();
    }
  })
}
