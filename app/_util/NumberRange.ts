export const NumberRange = (a: number, b: number): number[] =>
    Array.from(Array(b - a), (_, i) => i + a)

export const ReadonlyNumberRange = (
    a: number,
    b: number,
): ReadonlyArray<number> => Object.freeze(NumberRange(a, b))
