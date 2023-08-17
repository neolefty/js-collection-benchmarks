import { BenchConfig, BenchInputs, BenchSetup } from "@/app/bench/BenchSetup"
import { Fragment } from "react"
import { capitalCase } from "change-case"

export const BenchFormControls = ({ setup }: { setup: BenchSetup }) => (
    <>
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
                    min={0}
                    max={max(name)}
                    value={setup[name]}
                    step={step(name)}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowUp") {
                            e.preventDefault()
                            setup.dispatch({
                                [name]: fix(setup[name] + keyStep(name), name),
                            })
                        }
                        if (e.key === "ArrowDown") {
                            e.preventDefault()
                            setup.dispatch({
                                [name]: fix(setup[name] - keyStep(name), name),
                            })
                        }
                    }}
                    formNoValidate
                    disabled={setup.start || setup.running}
                />
            </Fragment>
        ))}
        <section aria-label="actions" className="flex gap-3 col-span-2 mt-4">
            <button className="btn" disabled={setup.start !== setup.running}>
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
    </>
)

const fix = (n: number, name: keyof BenchConfig): number =>
    name === "mutationFraction"
        ? Math.min(Math.max(0, n), 10)
        : Math.max(0, Math.floor(n))

// legal values
const step = (name: keyof BenchConfig) =>
    name === "mutationFraction" ? 0.01 : 1

// amount to increment/decrement on keyboard arrow press
const keyStep = (name: keyof BenchConfig) =>
    name === "mutationFraction" ? 0.1 : 100

const max = (name: keyof BenchConfig) =>
    name === "mutationFraction" ? 10 : undefined
