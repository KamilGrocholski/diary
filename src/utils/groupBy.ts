type Obj = Record<string, unknown>

export function groupBy<A extends Obj, B extends PropertyKey>(
    extractKey: (o: A) => B,
    data: A[]
): Record<B, A[]>

export function groupBy<A extends Obj, B extends PropertyKey, C>(
    extractKey: (o: A) => B,
    data: A[],
    transformer: (o: A) => C
): Record<B, C[]>

export function groupBy<A extends Obj, B extends PropertyKey, C>(
    extractKey: (o: A) => B,
    data: A[],
    transformer?: (o: A) => C
) {
    return data.reduce<Partial<Record<B, (A | C)[]>>>(
        (acc, cur) => ({
            ...acc,
            [extractKey(cur)]: (acc[extractKey(cur)] ?? []).concat(
                transformer?.(cur) ?? cur
            ),
        }),
        {}
    )
}
