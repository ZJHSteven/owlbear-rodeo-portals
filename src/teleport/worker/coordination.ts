import { Obr } from "../../obr/types";
import { EXTENSION_ID } from "../../constants";
import { Player } from "@owlbear-rodeo/sdk";
import onItemsMove from "../../obr/scene/items/onItemsMove";
import handleMovement from "./handleMovement";
import { Callback, Unsubscribe } from "../../types";

const WORKER_COORDINATION_CHANNEL_ID = `${EXTENSION_ID}/channel/worker-coordination`;
const ANNOUNCE_ACTIVE_WORKER_CHANNEL_ID = `${EXTENSION_ID}/channel/active-worker/announce`;
const REQUEST_ACTIVE_WORKER_CHANNEL_ID = `${EXTENSION_ID}/channel/active-worker/request`;

type Coordination = {
  type: "SUGGESTION" | "COMMAND";
  workerId: string;
};

let activeWorker: string | null = null;
let unsubscribeOnItemsMove: (() => void) | undefined;

export async function addWorkerCoordinationCallbacks(obr: Obr) {
  const connectionId = await obr.player.getConnectionId();

  obr.broadcast.onMessage(WORKER_COORDINATION_CHANNEL_ID, async ({ data }) => {
    const coordination = data as Coordination;
    if (isBetterCandidate(coordination)) {
      await setWorkerId(obr, coordination.workerId);
      updateListener(obr, connectionId);
    }
  });

  obr.party.onChange(async (players) =>
    balanceWorkers(obr, players, connectionId),
  );

  obr.broadcast.onMessage(REQUEST_ACTIVE_WORKER_CHANNEL_ID, async () => {
    await announceActiveWorker(obr);
  });
}

function isBetterCandidate(coordination: Coordination): boolean {
  return (
    activeWorker === null ||
    coordination.workerId > activeWorker ||
    coordination.type === "COMMAND"
  );
}

async function setWorkerId(obr: Obr, workerId: string | null) {
  activeWorker = workerId;
  await announceActiveWorker(obr);
}

async function announceActiveWorker(obr: Obr) {
  await obr.broadcast.sendMessage(
    ANNOUNCE_ACTIVE_WORKER_CHANNEL_ID,
    { activeWorker },
    { destination: "LOCAL" },
  );
}

export async function getActiveWorker(obr: Obr) {
  return new Promise<string | null>(async (resolve) => {
    const unsubscribe = onAnnounceWorker(obr, (activeWorker) => {
      unsubscribe();
      resolve(activeWorker);
    });

    await obr.broadcast.sendMessage(
      REQUEST_ACTIVE_WORKER_CHANNEL_ID,
      {},
      { destination: "LOCAL" },
    );
  });
}

export function onAnnounceWorker(
  obr: Obr,
  callback: Callback<string | null>,
): Unsubscribe {
  return obr.broadcast.onMessage(
    ANNOUNCE_ACTIVE_WORKER_CHANNEL_ID,
    ({ data }) => {
      callback((data as any).activeWorker);
    },
  );
}

async function balanceWorkers(
  obr: Obr,
  players: Player[],
  connectionId: string,
) {
  if (isWorkerPresent(players, connectionId)) {
    return;
  }

  await setWorkerId(obr, null);
  updateListener(obr, connectionId);
  await suggestWorker(obr, connectionId);
}

function isWorkerPresent(players: Player[], connectionId: string) {
  return (
    players.some(({ connectionId }) => activeWorker === connectionId) ||
    connectionId === activeWorker
  );
}

export async function suggestWorker(obr: Obr, workerId?: string) {
  if (workerId === undefined) {
    workerId = await obr.player.getConnectionId();
  }

  return sendCoordination(obr, {
    type: "SUGGESTION",
    workerId,
  });
}

export async function enforceWorker(obr: Obr, workerId: string) {
  await sendCoordination(obr, {
    type: "COMMAND",
    workerId,
  });
}

async function sendCoordination(obr: Obr, coordination: Coordination) {
  await obr.broadcast.sendMessage(
    WORKER_COORDINATION_CHANNEL_ID,
    coordination,
    { destination: "ALL" },
  );
}

function updateListener(obr: Obr, connectionId: string) {
  if (activeWorker === connectionId) {
    unsubscribeOnItemsMove = onItemsMove(obr, (items) =>
      handleMovement(obr, items),
    );
  } else if (unsubscribeOnItemsMove) {
    unsubscribeOnItemsMove();
    unsubscribeOnItemsMove = undefined;
  }
}
