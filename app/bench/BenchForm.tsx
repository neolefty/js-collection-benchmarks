"use client"

import { Fragment } from "react"
import { capitalCase } from "change-case"
import { BenchConfig, BenchInputs, useBenchSetup } from "@/app/bench/BenchSetup"

export const BenchForm = () => {
    const machine = useBenchSetup()
    return (
        <form
            onSubmit={machine.running ? machine.onCancel : machine.onStart}
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
                            machine.dispatch({
                                [name]: fix(Number(e.target.value), name),
                            })
                        }
                        value={machine[name]}
                        disabled={machine.running}
                    />
                </Fragment>
            ))}
            <section aria-label="actions" className="flex gap-2 col-span-2">
                <button className="btn">
                    {machine.running ? "Cancel" : "Start"}
                </button>
                <button className="btn btn-secondary" onClick={machine.onReset}>
                    Reset
                </button>
            </section>
        </form>
    )
}

const fix = (n: number, name: keyof BenchConfig): number =>
    name === "mutationFraction"
        ? Math.min(Math.max(0, n), 1)
        : Math.max(0, Math.floor(n))
