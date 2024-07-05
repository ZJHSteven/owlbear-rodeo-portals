import { Obr } from "../../obr/types";
import { resize } from "./popover";

export default function addResizeCallbacks(obr: Obr) {
  const resizeObserver = new ResizeObserver(async () => resize(obr));
  resizeObserver.observe(document.body);
}
