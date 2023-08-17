import { BenchSetup } from "@/app/bench/BenchSetup"
import { Fragment } from "react"

const round3 = (n: number) => 0.001 * Math.round(n * 1000)

export const BenchResultsDisplay = ({ setup }: { setup: BenchSetup }) =>
    Object.entries(setup.results).length > 0 && (
        <>
            <h2 className="gap-3 col-span-2 mt-4 text-xl font-bold bg-amber-400 dark:bg-amber-900 w-full text-center py-3">
                Results
            </h2>
            {Object.entries(setup.results).map(([benchType, elapsedMs]) => (
                <Fragment key={benchType}>
                    <div className="justify-self-end">{benchType}</div>
                    <div className="justify-self-start">
                        {elapsedMs === Infinity ? (
                            "—"
                        ) : (
                            <strong>{round3(elapsedMs)} ms</strong>
                        )}
                    </div>
                </Fragment>
            ))}
        </>
    )
