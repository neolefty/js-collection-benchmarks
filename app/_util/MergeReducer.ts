export const MergeReducer = <T extends {}>(
    state: Readonly<T>,
    action: Partial<Readonly<T>>,
): T => ({ ...state, ...action })

/** A MergeReducer, except that you can reset it by sending an action of null. */
type ResettableMergeReducer<T extends {}> = (
    state: Readonly<T>,
    action: Partial<Readonly<T>> | null,
) => T

/** A MergeReducer, except that you can reset it by sending an action of null. */
export const createResettableMergeReducer =
    <T extends {}>(defaultValue: T): ResettableMergeReducer<T> =>
    (state, action) =>
        action === null ? defaultValue : MergeReducer(state, action)
