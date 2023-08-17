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
                className="grid justify-items-center items-center gap-3 grid-cols-2 pt-6"
            >
                <BenchFormControls setup={setup} />
                <BenchResultsDisplay setup={setup} />
                <details className="col-span-2 w-full bg-accent text-accent-content mt-4 py-2">
                    <summary className="text-center">State (debug)</summary>
                    <p className="text-center py-3">
                        Status:{" "}
                        <strong>
                            {[
                                setup.start && "started",
                                setup.running && "running",
                            ]
                                .filter(Boolean)
                                .join(", ") || "Not started"}
                        </strong>
                    </p>
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
