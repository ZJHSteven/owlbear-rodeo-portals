import { Obr } from "../types";
import { Item } from "@owlbear-rodeo/sdk";
import gotoItemPosition from "./gotoItemPosition";

export default async function gotoItem(obr: Obr, item: Item) {
  await gotoItemPosition(obr, item.position);
}
