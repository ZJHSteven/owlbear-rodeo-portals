import { Obr } from "../../types";
import { Item } from "@owlbear-rodeo/sdk/lib/types/items/Item";
import { Vector2 } from "@owlbear-rodeo/sdk";
import { EXTENSION_ID } from "../../../constants";

const WORKER_COORDINATION_CHANNEL_ID = `${EXTENSION_ID}/channel/worker-coordination`;

export default async function onItemsMove(
  obr: Obr,
  callback: (obr: Obr, items: Item[]) => void,
) {
  const connectionId = await obr.player.getConnectionId();
  let worker: string | undefined = undefined;

  obr.broadcast.onMessage(WORKER_COORDINATION_CHANNEL_ID, async (event) => {
    const candidate: string = (event.data as any).worker;
    if (worker === undefined || candidate >= worker) {
      worker = candidate;
      return;
    }

    if (connectionId === worker) {
      await announceWorker(obr, worker);
    }
  });

  obr.party.onChange(async (players) => {
    if (players.some(({ connectionId }) => worker === connectionId)) {
      return;
    }

    if (connectionId === worker) {
      return;
    }

    worker = undefined;
    await announceWorker(obr, connectionId);
  });

  await announceWorker(obr, connectionId);

  let positions: Record<string, Vector2> = {};
  return obr.scene.items.onChange((items) => {
    if (worker !== connectionId) {
      return;
    }

    const moved = items.filter((item) => {
      const position = positions[item.id];
      if (position === undefined) {
        return false;
      }

      return position.x !== item.position.x || position.y !== item.position.y;
    });

    positions = {};
    for (let item of items) {
      positions[item.id] = item.position;
    }

    callback(obr, moved);
  });
}

async function announceWorker(obr: Obr, worker: string) {
  return obr.broadcast.sendMessage(
    WORKER_COORDINATION_CHANNEL_ID,
    { worker },
    { destination: "ALL" },
  );
}
