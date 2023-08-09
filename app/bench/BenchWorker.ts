import { BenchConfig, BenchMarkType } from "@/app/bench/BenchSetup"
import { ReadonlyNumberRange } from "@/app/_util/NumberRange"
import { List as ImList, Map as ImMap } from "immutable"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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
    const contents = ReadonlyNumberRange(0, config.collectionSize)
    let timeStart = roundedPerformance.now()
    switch (benchType) {
        case "array": {
            let scratch = [...contents]
            iterations.forEach(() => {
                scratch = [...scratch]
                mutations.forEach(
                    (i) =>
                        (scratch[Math.floor(Math.random() * scratch.length)] =
                            i),
                )
            })
            if (printDebug) console.log({ [benchType]: scratch })
            break
        }
        case "object": {
            let scratch = Object.fromEntries(contents.entries())
            iterations.forEach(() => {
                scratch = { ...scratch }
                mutations.forEach(
                    (i) =>
                        (scratch[
                            Math.floor(Math.random() * config.collectionSize)
                        ] = i),
                )
            })
            if (printDebug) console.log({ [benchType]: scratch })
            break
        }
        case "immutable list": {
            let scratch = ImList(contents)
            iterations.forEach(() => {
                scratch = scratch.withMutations((mutable) =>
                    mutations.forEach((i) =>
                        mutable.set(
                            Math.floor(Math.random() * scratch.size),
                            i,
                        ),
                    ),
                )
            })
            if (printDebug) console.log({ [benchType]: scratch.toArray() })
            break
        }
        case "immutable map": {
            let scratch = ImMap(contents.entries())
            iterations.forEach(() => {
                scratch = scratch.withMutations((mutable) =>
                    mutations.forEach((i) =>
                        mutable.set(
                            Math.floor(Math.random() * scratch.size),
                            i,
                        ),
                    ),
                )
            })
            if (printDebug) console.log({ [benchType]: scratch.toObject() })
            break
        }
        case "sleep": {
            await sleep(config.collectionSize * config.iterations * 0.000001)
            break
        }
        case "overhead only": {
            const scratch = [...contents]
            iterations.forEach(() => (scratch[0] = 0))
            break
        }
        default:
            timeStart = -Infinity
    }
    return roundedPerformance.now() - timeStart
}
