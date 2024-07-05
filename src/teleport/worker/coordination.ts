import { Obr } from "../../obr/types";
import { EXTENSION_ID } from "../../constants";
import { Player } from "@owlbear-rodeo/sdk";
import onItemsMove from "../../obr/scene/items/onItemsMove";
import handleMovement from "./handleMovement";

const WORKER_COORDINATION_CHANNEL_ID = `${EXTENSION_ID}/channel/worker-coordination`;

let workerId: string | null = null;
let unsubscribeOnItemsMove: (() => void) | undefined;

export async function addWorkerCoordinationCallbacks(obr: Obr) {
  const connectionId = await obr.player.getConnectionId();

  obr.broadcast.onMessage(WORKER_COORDINATION_CHANNEL_ID, async ({ data }) => {
    const candidateId: string = (data as any).workerId;
    if (isBetterCandidate(candidateId)) {
      workerId = candidateId;
      updateListener(obr, connectionId);
    }
  });

  obr.party.onChange(async (players) =>
    balanceWorkers(obr, players, connectionId),
  );
}

function isBetterCandidate(candidateId: string): boolean {
  return workerId === null || candidateId > workerId;
}

async function balanceWorkers(
  obr: Obr,
  players: Player[],
  connectionId: string,
) {
  if (isWorkerPresent(players, connectionId)) {
    return;
  }

  workerId = null;
  updateListener(obr, connectionId);
  await suggestWorker(obr, connectionId);
}

function isWorkerPresent(players: Player[], connectionId: string) {
  return (
    players.some(({ connectionId }) => workerId === connectionId) ||
    connectionId === workerId
  );
}

export async function suggestWorker(obr: Obr, workerId?: string) {
  if (workerId === undefined) {
    workerId = await obr.player.getConnectionId();
  }

  return obr.broadcast.sendMessage(
    WORKER_COORDINATION_CHANNEL_ID,
    { workerId },
    { destination: "ALL" },
  );
}

function updateListener(obr: Obr, connectionId: string) {
  if (workerId === connectionId) {
    unsubscribeOnItemsMove = onItemsMove(obr, handleMovement);
  } else if (unsubscribeOnItemsMove) {
    unsubscribeOnItemsMove();
    unsubscribeOnItemsMove = undefined;
  }
}
