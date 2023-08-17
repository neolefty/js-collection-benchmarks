import { BenchMarkTypes, BenchSetup } from "@/app/bench/BenchSetup"
import { Fragment } from "react"
import { nothing } from "immer"

// Rounding via scientific notation brings all the kids to the yard — avoid things like "3.0000004"
// https://medium.com/@borisdedejski/rounding-numbers-on-x-decimal-places-in-javascript-5a4bc26e4149
const round3 = (n: number) => Number(Math.round(n * 1000) + "e-3")

export const BenchResultsDisplay = ({ setup }: { setup: BenchSetup }) => {
    const maxMs = Math.max(
        ...Object.values(setup.results).filter((x) => x !== Infinity && x),
    )
    return (
        Object.entries(setup.results).length > 0 && (
            <>
                <h2 className="gap-3 col-span-2 mt-4 text-xl font-bold bg-primary text-primary-content w-full text-center py-3">
                    Results
                </h2>
                {BenchMarkTypes.map((benchType, i) => {
                    const elapsedMs = setup.results[benchType]
                    const showMs =
                        elapsedMs !== Infinity && elapsedMs !== undefined
                    return (
                        <Fragment key={i}>
                            {benchType === "divider" ? (
                                <div className="col-span-2 border-secondary border-b-2 w-full" />
                            ) : (
                                <>
                                    <div className="relative w-full">
                                        <div>
                                            {showMs && (
                                                <div
                                                    className="bg-accent/50 absolute top-0 left-0"
                                                    style={{
                                                        height: "24px",
                                                        width: `${
                                                            (elapsedMs /
                                                                maxMs) *
                                                            200
                                                        }%`,
                                                    }}
                                                />
                                            )}
                                        </div>
                                        {/*kludge to take space for text; next div displays on top of background bar*/}
                                        <div className="text-right w-full text-base-100/0">
                                            {benchType}
                                        </div>
                                        <div className="absolute right-0 top-0">
                                            {benchType}
                                        </div>
                                    </div>
                                    <div className="justify-self-start relative w-full inline-block">
                                        {showMs ? (
                                            <strong>
                                                {round3(elapsedMs)} ms
                                            </strong>
                                        ) : (
                                            "—"
                                        )}
                                    </div>
                                </>
                            )}
                        </Fragment>
                    )
                })}
            </>
        )
    )
}
