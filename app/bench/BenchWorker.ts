import { BenchConfig, BenchMarkType } from "@/app/bench/BenchSetup"
import { NumberRange } from "@/app/_util/NumberRange"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const roundedPerformance = Object.freeze({
    /** Rounded to 100 microseconds. https://developer.mozilla.org/en-US/docs/Web/API/Performance/now */
    now: () => Math.round(performance.now() * 10_000) * 0.0001,
})

export const runBenchmark = async (
    config: BenchConfig,
    benchType: BenchMarkType,
) => {
    const iterations = NumberRange(0, config.iterations)
    const mutations = NumberRange(
        0,
        Math.round(config.collectionSize * config.mutationFraction),
    )
    let timeStart = -Infinity
    switch (benchType) {
        case "array": {
            let scratch = NumberRange(0, config.collectionSize)
            timeStart = roundedPerformance.now()
            iterations.forEach((i) => {
                scratch = [...scratch]
                mutations.forEach(
                    (i) =>
                        (scratch[Math.floor(Math.random() * scratch.length)] =
                            i),
                )
            })
            break
        }
        default: {
            await sleep((config.collectionSize * config.iterations) / 1000_000)
        }
    }
    return roundedPerformance.now() - timeStart
}
