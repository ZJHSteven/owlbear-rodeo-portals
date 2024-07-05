import { Obr } from "../obr/types";
import applyTheme from "./applyTheme";

export default async function addThemeCallbacks(obr: Obr) {
  obr.theme.onChange(applyTheme);
}
