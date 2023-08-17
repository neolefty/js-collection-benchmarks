import {
    Dispatch,
    FormEvent,
    Reducer,
    useCallback,
    useMemo,
    useReducer,
} from "react"
import {
    createResettableMergeReducer,
    MergeReducer,
} from "@/app/_util/MergeReducer"
import { useBenchRunner } from "@/app/bench/BenchRunner"

export type BenchMarkType =
    | "array" // [...a]
    | "array with freeze" // [...a]
    | "object" // {...o}
    | "object with freeze"
    | "Set"
    | "Map"
    | "immutable List" // List.withMutations()
    | "immutable Set" // Set.withMutations()
    | "immutable Map" // Map.withMutations()
    | "immer object" // produce()
    | "immer array" // produce()
    | "structura object" // produce()
    | "structura array" // produce()
    | "overhead only" // only do framework stuff
    | "sleep" // sleep 1ns per operation
    | "divider" // display purposes only

export const BenchMarkTypes: ReadonlyArray<BenchMarkType> = [
    // maps
    "object",
    "object with freeze",
    "Map",
    "immutable Map",
    "immer object",
    "structura object",
    "divider",

    // arrays & lists
    "array",
    "array with freeze",
    "immutable List",
    "immer array",
    "structura array",
    "divider",

    // sets
    "Set",
    "immutable Set",
    "divider",

    // control
    "overhead only",
    "sleep",
]

export interface BenchConfig {
    collectionSize: number // how big is the collection we're operating on
    iterations: number // how many times we loop through
    mutationFraction: number // between 0 and 1 — the fraction of items changed on each loop
}

export const extractConfig = <T extends BenchConfig>(t: T): BenchConfig => ({
    collectionSize: t.collectionSize,
    iterations: t.iterations,
    mutationFraction: t.mutationFraction,
})

export const BenchInputs: ReadonlyArray<keyof BenchConfig> = [
    "collectionSize",
    "iterations",
    "mutationFraction",
]

interface BenchState extends BenchConfig {
    running?: boolean
    start?: boolean
}

const INITIAL_BENCH_STATE: BenchState = {
    collectionSize: 1000,
    iterations: 100,
    mutationFraction: 0.1,
}

export interface BenchSetup extends BenchState {
    onStart: (e?: FormEvent) => void
    onCancel: (e?: FormEvent) => void
    onReset: (e?: FormEvent) => void
    dispatch: Dispatch<Partial<BenchState>>
    onBenchmarkResult: (benchType: BenchMarkType, elapsedMs: number) => void
    results: Partial<Record<BenchMarkType, number>>
}

const DEFAULT_RESULTS: BenchSetup["results"] = {}
const ResultsReducer = createResettableMergeReducer(DEFAULT_RESULTS)

export const useBenchSetup = (): BenchSetup => {
    const [state, dispatch] = useReducer<typeof MergeReducer<BenchState>>(
        MergeReducer,
        INITIAL_BENCH_STATE,
    )
    const [results, resultsDispatch] = useReducer(
        ResultsReducer,
        DEFAULT_RESULTS,
    )

    // Ensure not recreated, to avoid triggering useEffect() in components
    const onBenchmarkResult = useCallback<BenchSetup["onBenchmarkResult"]>(
        (benchType, elapsedMs) => {
            resultsDispatch({ [benchType]: elapsedMs })
        },
        [],
    )
    const onStart = useCallback((e?: FormEvent) => {
        dispatch({ start: true })
        e?.preventDefault()
    }, [])
    const onCancel = useCallback((e?: FormEvent) => {
        dispatch({ start: false })
        e?.preventDefault()
    }, [])
    const onReset = useCallback((e?: FormEvent) => {
        dispatch(INITIAL_BENCH_STATE)
        resultsDispatch(null)
        e?.preventDefault()
    }, [])

    const result = useMemo(
        () => ({
            ...state,
            results,
            dispatch,
            onStart,
            onCancel,
            onReset,
            onBenchmarkResult,
        }),
        [state, results, onStart, onCancel, onReset, onBenchmarkResult],
    )

    useBenchRunner(result)

    return result
}
