export function optionalOne<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }

  if (array.length > 1) {
    console.warn(`expected 1, got ${array.length}}`);
  }

  return array[0];
}
