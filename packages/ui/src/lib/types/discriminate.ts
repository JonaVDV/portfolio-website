export type Discriminate<
	TBase,
	TKey extends keyof TBase,
	TMap extends Record<PropertyKey, object>
> = {
	[K in keyof TMap]: TBase & Record<TKey, K> & TMap[K];
}[keyof TMap];
