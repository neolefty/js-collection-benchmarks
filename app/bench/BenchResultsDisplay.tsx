import { BenchMarkTypes, BenchSetup } from "@/app/bench/BenchSetup"
import { Fragment } from "react"

// Rounding via scientific notation brings all the kids to the yard — avoid things like "3.0000004"
// https://medium.com/@borisdedejski/rounding-numbers-on-x-decimal-places-in-javascript-5a4bc26e4149
const round3 = (n: number) => Number(Math.round(n * 1000) + "e-3")

export const BenchResultsDisplay = ({ setup }: { setup: BenchSetup }) =>
    Object.entries(setup.results).length > 0 && (
        <>
            <h2 className="gap-3 col-span-2 mt-4 text-xl font-bold bg-primary text-primary-content w-full text-center py-3">
                Results
            </h2>
            {BenchMarkTypes.map((benchType, i) => {
                const elapsedMs = setup.results[benchType]
                return (
                    <Fragment key={i}>
                        {benchType === "divider" ? (
                            <div className="col-span-2 border-secondary border-b-2 w-full" />
                        ) : (
                            <>
                                <div className="justify-self-end">
                                    {benchType}
                                </div>
                                <div className="justify-self-start">
                                    {elapsedMs === Infinity ||
                                    elapsedMs === undefined ? (
                                        "—"
                                    ) : (
                                        <strong>{round3(elapsedMs)} ms</strong>
                                    )}
                                </div>
                            </>
                        )}
                    </Fragment>
                )
            })}
        </>
    )
