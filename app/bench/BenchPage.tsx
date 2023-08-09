"use client"

import { Fragment } from "react"
import { capitalCase } from "change-case"
import { BenchConfig, BenchInputs, useBenchSetup } from "@/app/bench/BenchSetup"
import { BenchRunner } from "@/app/bench/BenchRunner"

const round3 = (n: number) => 0.001 * Math.round(n * 1000)

export const BenchPage = () => {
    const setup = useBenchSetup()
    return (
        <>
            <form
                onSubmit={setup.running ? setup.onCancel : setup.onStart}
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
                                setup.dispatch({
                                    [name]: fix(Number(e.target.value), name),
                                })
                            }
                            value={setup[name]}
                            step={step(name)}
                            disabled={setup.start || setup.running}
                        />
                    </Fragment>
                ))}
                <section
                    aria-label="actions"
                    className="flex gap-3 col-span-2 mt-4"
                >
                    <button
                        className="btn"
                        disabled={setup.start !== setup.running}
                    >
                        {setup.running ? "Cancel" : "Start"}
                    </button>
                    <button
                        disabled={setup.start || setup.running}
                        className="btn dark:bg-green-900 bg-green-300"
                        onClick={setup.onReset}
                    >
                        Reset
                    </button>
                </section>
                <div className="justify-self-end">Status</div>
                <div className="justify-self-start">
                    <strong>
                        {[setup.start && "started", setup.running && "running"]
                            .filter(Boolean)
                            .join(", ") || "Not started"}
                    </strong>
                </div>
                {Object.entries(setup.results).length > 0 && (
                    <>
                        <h2 className="gap-3 col-span-2 mt-4 text-xl font-bold bg-amber-400 dark:bg-amber-900 w-full text-center py-3">
                            Results
                        </h2>
                        {Object.entries(setup.results).map(
                            ([benchType, elapsedMs]) => (
                                <Fragment key={benchType}>
                                    <div className="justify-self-end">
                                        {benchType}
                                    </div>
                                    <div className="justify-self-start">
                                        {elapsedMs === Infinity ? (
                                            "—"
                                        ) : (
                                            <strong>
                                                {round3(elapsedMs)} ms
                                            </strong>
                                        )}
                                    </div>
                                </Fragment>
                            ),
                        )}
                    </>
                )}
                <details className="col-span-2 w-full border-amber-700 py-2 border-y-2">
                    <summary className="text-center">State (debug)</summary>
                    <code>
                        {JSON.stringify(setup)
                            .replaceAll(":", ": ")
                            .replaceAll(",", ", ")}
                    </code>
                </details>
                <BenchRunner setup={setup} />
            </form>
        </>
    )
}

const fix = (n: number, name: keyof BenchConfig): number =>
    name === "mutationFraction"
        ? Math.min(Math.max(0, n), 1)
        : Math.max(0, Math.floor(n))

const step = (name: keyof BenchConfig) =>
    name === "mutationFraction" ? 0.1 : 100
