"use client"

import { useBenchSetup } from "@/app/bench/BenchSetup"
import { BenchRunner } from "@/app/bench/BenchRunner"
import { BenchFormControls } from "@/app/bench/BenchFormControls"
import { BenchResultsDisplay } from "@/app/bench/BenchResultsDisplay"

export const BenchPage = () => {
    const setup = useBenchSetup()
    return (
        <>
            <form
                onSubmit={setup.running ? setup.onCancel : setup.onStart}
                action="#"
                className="flex-grow grid content-center justify-items-center items-center gap-3 grid-cols-2"
            >
                <BenchFormControls setup={setup} />
                <div className="justify-self-end">Status</div>
                <div className="justify-self-start">
                    <strong>
                        {[setup.start && "started", setup.running && "running"]
                            .filter(Boolean)
                            .join(", ") || "Not started"}
                    </strong>
                </div>
                <BenchResultsDisplay setup={setup} />
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
