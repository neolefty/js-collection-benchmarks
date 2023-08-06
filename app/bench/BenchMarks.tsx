"use client"

import {
    Dispatch,
    FormEvent,
    Fragment,
    useCallback,
    useEffect,
    useReducer,
} from "react"
import { MergeReducer } from "@/app/_util/MergeReducer"
import { capitalCase, headerCase } from "change-case"

interface BenchConfig {
    collectionSize: number // how big is the collection we're operating on
    iterations: number // how many times we loop through
    mutationFraction: number // between 0 and 1 — the fraction of items changed on each loop
}

const BenchInputs: ReadonlyArray<keyof BenchConfig> = [
    "collectionSize",
    "iterations",
    "mutationFraction",
]

interface BenchState extends BenchConfig {
    running?: boolean
}

const INITIAL_BENCH_STATE: BenchState = {
    collectionSize: 1000,
    iterations: 1000,
    mutationFraction: 0.1,
}

export const BenchMarks = () => {
    const [state, dispatch] = useReducer<typeof MergeReducer<BenchState>>(
        MergeReducer,
        INITIAL_BENCH_STATE,
    )
    const handleReset = useCallback(() => dispatch(INITIAL_BENCH_STATE), [])
    const handleStart = useCallback((e: FormEvent) => {
        dispatch({ running: true })
        e.preventDefault()
    }, [])
    const handleCancel = useCallback((e: FormEvent) => {
        dispatch({ running: false })
        e.preventDefault()
    }, [])
    const { running } = state
    useEffect(() => {
        if (state.running) console.log("start")
    }, [state.running])
    return (
        <form
            onSubmit={running ? handleCancel : handleStart}
            action="#"
            className="flex-grow grid content-center justify-items-center items-center gap-3 grid-cols-2"
        >
            {BenchInputs.map((name) => (
                <Fragment key={name}>
                    <label htmlFor={name} className="justify-self-end">
                        {capitalCase(name)}
                    </label>
                    <input
                        name={name}
                        type="number"
                        className="input justify-self-start"
                        onChange={(e) =>
                            dispatch({
                                [name]: fix(Number(e.target.value), name),
                            })
                        }
                        value={state[name]}
                        disabled={state.running}
                    />
                </Fragment>
            ))}
            <button className="btn col-span-2">
                {running ? "Cancel" : "Start"}
            </button>
        </form>
    )
}

const fix = (n: number, name: keyof BenchConfig): number =>
    name === "mutationFraction"
        ? Math.min(Math.max(0, n), 1)
        : Math.max(0, Math.floor(n))
