import { useContext } from "react";
import { obrContext } from "../../obr/ObrContextProvider";
import useListenExternalStore from "../../react/hook/useListenExternalStore";
import { getActiveWorker, onAnnounceWorker } from "./coordination";

export default function useWorkerId(): string | null | undefined {
  const obr = useContext(obrContext);

  return useListenExternalStore(
    (callback) => onAnnounceWorker(obr, callback),
    () => getActiveWorker(obr),
    undefined,
  );
}
