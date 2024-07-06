import { Player } from "@owlbear-rodeo/sdk";
import { Obr } from "../types";

export default async function getPlayer(obr: Obr): Promise<Player> {
  const [connectionId, role, selection, name, color, syncView, metadata] =
    await Promise.all([
      obr.player.getConnectionId(),
      obr.player.getRole(),
      obr.player.getSelection(),
      obr.player.getName(),
      obr.player.getColor(),
      obr.player.getSyncView(),
      obr.player.getMetadata(),
    ]);

  return {
    id: obr.player.id,
    connectionId,
    role,
    selection,
    name,
    color,
    syncView,
    metadata,
  };
}
