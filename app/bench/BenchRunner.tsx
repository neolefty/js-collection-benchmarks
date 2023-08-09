"use client"

import {
    BenchConfig,
    BenchMarkTypes,
    BenchSetup,
    extractConfig,
} from "@/app/bench/BenchSetup"
import { useEffect } from "react"
import {
    createWorkerFactory,
    terminate,
    useWorker,
} from "@shopify/react-web-worker"

const createWorker = createWorkerFactory(() => import("./BenchWorker"))

export const BenchRunner = ({ setup }: { setup: BenchSetup }) => {
    const worker = useWorker(createWorker)
    const { start, running, dispatch, onBenchmarkResult } = setup
    useEffect(() => {
        // start
        if (start && !running) {
            // TODO check whether still mounted
            dispatch({ running: true })
            ;(async () => {
                for (const benchType of BenchMarkTypes) {
                    console.log(`Running ${benchType} ...`)
                    const elapsed = await worker.runBenchmark(
                        extractConfig(setup),
                        benchType,
                    )
                    onBenchmarkResult(benchType, elapsed)
                }
                dispatch({ running: false, start: false })
            })()
        }
        // cancel
        if (!start && running) {
            console.log("Terminating ...")
            const terminated = terminate(worker)
            console.log({ terminated })
            if (terminated) dispatch({ running: false })
        }
    }, [worker, start, running, dispatch, onBenchmarkResult])

    return [
        setup.start ? "Start" : undefined,
        setup.running ? "Running" : undefined,
    ]
}
