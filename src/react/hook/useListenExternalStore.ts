import { useEffect, useState } from "react";
import { Callback, Unsubscribe } from "../../types";

type Subscribe<Snapshot> = (callback: Callback<Snapshot>) => Unsubscribe;
type GetSnapshot<Snapshot> = (() => Promise<Snapshot>) | (() => Snapshot);

export default function useListenExternalStore<Snapshot, InitialState>(
  subscribe: Subscribe<Snapshot | InitialState>,
  getSnapshot: GetSnapshot<Snapshot | InitialState>,
  initialState: InitialState,
): Snapshot | InitialState {
  const [snapshot, setSnapshot] = useState<Snapshot | InitialState>(
    initialState,
  );

  useEffect(() => subscribe(setSnapshot), []);
  useEffect(() => {
    let active = true;

    (async () => {
      const snapshot = await getSnapshot();
      if (active) {
        setSnapshot(snapshot);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return snapshot;
}
