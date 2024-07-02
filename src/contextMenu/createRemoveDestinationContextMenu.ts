import {OBR} from "../obr/types";
import {DESTINATION_ID_METADATA_ID, EXTENSION_ID} from "../constants";
import createIconUrl from "../createIconUrl";

export default function createRemoveDestinationContextMenu(obr: OBR) {
  return obr.contextMenu.create({
    id: `${EXTENSION_ID}/contextMenu/remove-destination`,
    icons: [
      {
        icon: createIconUrl("trash-can-regular.svg"),
        label: "Remove Destination",
        filter: {
          roles: ["GM"],
          every: [
            {
              key: ["metadata", DESTINATION_ID_METADATA_ID],
              value: undefined,
              operator: "!=",
            }
          ]
        }
      }
    ],
    onClick(context) {
      obr.scene.items.updateItems(context.items, (items) => {
        for (let item of items) {
          delete item.metadata[DESTINATION_ID_METADATA_ID];
        }
      })
    }
  })
}
