import createUrl from "./createUrl";

export default function createIconUrl(fileName: string): string {
  return createUrl(`font-awesome/svgs/${fileName}`);
}
