import { BenchConfig, BenchInputs, BenchSetup } from "@/app/bench/BenchSetup"
import { Fragment } from "react"
import { capitalCase } from "change-case"
import { BenchmarkHeader2 } from "@/app/_util/BenchmarkHeader"

export const BenchForm = ({ setup }: { setup: BenchSetup }) => (
    <>
        <BenchmarkHeader2>Settings</BenchmarkHeader2>
        <form
            aria-label="inputs"
            className="grid gap-3 grid-cols-2 justify-items-center items-center pt-4"
            onSubmit={setup.running ? setup.onCancel : setup.onStart}
            action="#"
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
                        min={0}
                        max={max(name)}
                        value={setup[name]}
                        step={step(name)}
                        formNoValidate
                        disabled={setup.start || setup.running}
                    />
                </Fragment>
            ))}
            <section
                aria-label="actions"
                className="flex gap-3 col-span-2 mt-4"
            >
                <button
                    className="btn btn-primary"
                    disabled={setup.start !== setup.running}
                >
                    {setup.running ? "Stop" : "Run"}
                </button>
                <button
                    disabled={setup.start || setup.running}
                    className="btn btn-secondary"
                    onClick={setup.onReset}
                >
                    Reset
                </button>
            </section>
        </form>
    </>
)

const fix = (n: number, name: keyof BenchConfig): number =>
    name === "mutationFraction"
        ? Math.min(Math.max(0, n), 10)
        : Math.max(0, Math.floor(n))

const step = (name: keyof BenchConfig) =>
    name === "mutationFraction" ? 0.1 : 100

const max = (name: keyof BenchConfig) =>
    name === "mutationFraction" ? 10 : undefined
