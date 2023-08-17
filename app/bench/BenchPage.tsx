"use client"

import { useBenchSetup } from "@/app/bench/BenchSetup"
import { useBenchRunner } from "@/app/bench/BenchRunner"
import { BenchFormControls } from "@/app/bench/BenchFormControls"
import { BenchResultsDisplay } from "@/app/bench/BenchResultsDisplay"
import { BenchDebug } from "@/app/bench/BenchDebug"

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
                <BenchDebug setup={setup} />
            </form>
        </>
    )
}
