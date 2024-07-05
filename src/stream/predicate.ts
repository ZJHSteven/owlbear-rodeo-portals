type Predicate<T> = (item: T) => boolean;

export function not<T>(predicate: Predicate<T>): Predicate<T> {
  return (item: T) => !predicate(item);
}
