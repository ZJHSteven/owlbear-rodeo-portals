import {Obr} from "../../obr/types";
import {DESTINATION_ID_METADATA_ID, EXTENSION_ID} from "../../constants";
import createIconUrl from "../../fontAwesome/createIconUrl";
import removeDestinations from "../../crud/delete/destination/removeDestinations";

export default async function createContextMenu(obr: Obr) {
  await obr.contextMenu.create({
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
    async onClick(context) {
      await removeDestinations(obr, context.items);
    }
  })
}
