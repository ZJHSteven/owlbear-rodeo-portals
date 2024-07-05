import createUrl from "../extension/createUrl";

export default function createIconUrl(fileName: string): string {
  return createUrl(`font-awesome/svgs/${fileName}`);
}
