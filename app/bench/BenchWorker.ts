import { BenchConfig, BenchMarkType } from "@/app/bench/BenchSetup"
import { ReadonlyNumberRange } from "@/app/_util/NumberRange"
import { BenchWorkers } from "@/app/bench/BenchWorkers"

/**
 * Runs a benchmark using a particular type of collection.
 * @param basis data to create container instances from
 * @param iterations number of times to run a benchmark step (which is probably copying the collection)
 * @param mutations within each step, how many mutations to make to the collection
 * @param debugLabel if present, print out debug info, with this label
 */
export type BenchWorker = (
    basis: ReadonlyArray<number>,
    iterations: ReadonlyArray<number>,
    mutations: ReadonlyArray<number>,
    debugLabel?: string,
) => Promise<void>

const roundedPerformance = Object.freeze({
    /** Rounded to 100 microseconds. https://developer.mozilla.org/en-US/docs/Web/API/Performance/now */
    now: () => Math.round(performance.now() * 10_000) * 0.0001,
})

export const runBenchmark = async (
    config: BenchConfig,
    benchType: BenchMarkType,
) => {
    const printDebug = config.collectionSize <= 100
    const iterations = ReadonlyNumberRange(0, config.iterations)
    const mutations = ReadonlyNumberRange(
        0,
        Math.round(config.collectionSize * config.mutationFraction),
    )
    const basis = ReadonlyNumberRange(0, config.collectionSize)
    let timeStart = roundedPerformance.now()
    const worker = BenchWorkers[benchType]
    if (worker)
        await worker(
            basis,
            iterations,
            mutations,
            printDebug ? benchType : undefined,
        )
    else timeStart = -Infinity
    return roundedPerformance.now() - timeStart
}
