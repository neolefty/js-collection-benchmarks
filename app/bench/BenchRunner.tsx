"use client"

import { BenchMarkTypes, BenchSetup } from "@/app/bench/BenchSetup"
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
            console.log("Starting")
            // TODO check whether still mounted
            dispatch({ running: true })
            ;(async () => {
                for (const benchType of BenchMarkTypes) {
                    const elapsed = await worker.runBenchmark(setup, benchType)
                    onBenchmarkResult(benchType, elapsed)
                }
                dispatch({ running: false, start: false })
            })()
            console.log("finished")
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
