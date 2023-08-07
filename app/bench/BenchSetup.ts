import {
    Dispatch,
    FormEvent,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
} from "react"
import { MergeReducer } from "@/app/_util/MergeReducer"

export interface BenchConfig {
    collectionSize: number // how big is the collection we're operating on
    iterations: number // how many times we loop through
    mutationFraction: number // between 0 and 1 — the fraction of items changed on each loop
}

export const BenchInputs: ReadonlyArray<keyof BenchConfig> = [
    "collectionSize",
    "iterations",
    "mutationFraction",
]

interface BenchState extends BenchConfig {
    running?: boolean
}

interface BenchSetup extends BenchState {
    onStart: (e: FormEvent) => void
    onCancel: (e: FormEvent) => void
    onReset: (e: FormEvent) => void
    dispatch: Dispatch<Partial<BenchState>>
}

export const useBenchSetup = (): BenchSetup => {
    const [state, dispatch] = useReducer<typeof MergeReducer<BenchState>>(
        MergeReducer,
        INITIAL_BENCH_STATE,
    )

    return useMemo(
        () => ({
            ...state,
            dispatch,
            onStart: (e: FormEvent) => {
                dispatch({ running: true })
                e.preventDefault()
            },
            onCancel: (e: FormEvent) => {
                dispatch({ running: false })
                e.preventDefault()
            },
            onReset: (e: FormEvent) => {
                dispatch(INITIAL_BENCH_STATE)
                e.preventDefault()
            },
        }),
        [state],
    )
}
const INITIAL_BENCH_STATE: BenchState = {
    collectionSize: 1000,
    iterations: 1000,
    mutationFraction: 0.1,
}
