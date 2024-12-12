interface ObjectConstructor {
  entries<TKey extends PropertyKey, TVal>(o: Record<TKey, TVal>): [TKey, TVal][];
  keys<TKey extends PropertyKey>(obj: Record<TKey, any>): TKey[];
}
