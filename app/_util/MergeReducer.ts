export const MergeReducer = <T extends {}>(
    state: Readonly<T>,
    action: Partial<Readonly<T>>,
): T => ({ ...state, ...action })
