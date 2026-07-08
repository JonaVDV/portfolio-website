export type ConditionalProps<
  TBase,
  TKey extends keyof TBase,
  TValue extends TBase[TKey],
  TTrue,
  TFalse = {},
> =
  | (TBase & Record<TKey, TValue> & TTrue)
  | (TBase & { [K in TKey]?: Exclude<TBase[TKey], TValue> } & TFalse);
