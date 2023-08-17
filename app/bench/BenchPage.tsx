"use client"

import { useBenchSetup } from "@/app/bench/BenchSetup"
import { BenchFormControls } from "@/app/bench/BenchFormControls"
import { BenchResultsDisplay } from "@/app/bench/BenchResultsDisplay"
import { BenchDebug } from "@/app/bench/BenchDebug"
import { useEffect, useState } from "react"

export const BenchPage = ({
    showDebug,
    autoRun,
}: {
    showDebug?: boolean
    autoRun?: boolean
}) => {
    const setup = useBenchSetup()
    const [autoRan, setAutoRan] = useState(false)
    useEffect(() => {
        if (autoRun && !autoRan && !setup.start) {
            setAutoRan(true)
            setup.onStart()
        }
    }, [autoRan, autoRun, setup])
    return (
        <>
            <form
                onSubmit={setup.running ? setup.onCancel : setup.onStart}
                action="#"
                className="grid justify-items-center items-center gap-3 grid-cols-2 pt-6"
            >
                <BenchFormControls setup={setup} />
                <BenchResultsDisplay setup={setup} />
                {showDebug && <BenchDebug setup={setup} />}
            </form>
        </>
    )
}
