import { useEffect } from "react";

export default function usePromise<T>(
  promise: () => Promise<T>,
  then: (data: T) => void,
) {
  useEffect(() => {
    let ignore = false;
    (async () => {
      const data = await promise();
      if (ignore) {
        return;
      }

      then(data);
    })();

    return () => {
      ignore = true;
    };
  }, []);
}
