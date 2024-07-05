import { Obr } from "../../obr/types";
import { LATEST_TELEPORT_IDS_METADATA_ID } from "../worker/handleMovement";
import updateView from "./updateView";

export default async function addTeleportIdsCallbacks(obr: Obr) {
  obr.scene.onMetadataChange(async (metadata) => {
    await updateView(
      obr,
      metadata[LATEST_TELEPORT_IDS_METADATA_ID] as string[],
    );
  });
}
