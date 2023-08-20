"use client"

import { useBenchSetup } from "@/app/bench/BenchSetup"
import { BenchForm } from "@/app/bench/BenchForm"
import { BenchResultsDisplay } from "@/app/bench/BenchResultsDisplay"
import { BenchDebug } from "@/app/bench/BenchDebug"
import { useEffect, useReducer, useState } from "react"
import { BenchmarkHeader2 } from "@/app/_util/BenchmarkHeader"

export const BenchPage = ({
    showDebug,
    autoRun,
    briefTitle,
    defaultShowSettings,
}: {
    showDebug?: boolean
    autoRun?: boolean
    className?: string
    briefTitle?: boolean
    defaultShowSettings?: boolean
}) => {
    const setup = useBenchSetup()
    const [autoRan, setAutoRan] = useState(false)
    // noinspection PointlessBooleanExpressionJS
    const [showSettings, toggleSettings] = useReducer(
        (x) => !x,
        !!defaultShowSettings,
    )
    useEffect(() => {
        if (autoRun && !autoRan && !setup.start) {
            setAutoRan(true)
            setup.onStart()
        }
    }, [autoRan, autoRun, setup])
    return (
        <>
            <div className="collapse rounded-none">
                <input
                    type="checkbox"
                    defaultChecked={showSettings}
                    className="hidden"
                />
                <div className="collapse-content p-0">
                    <BenchForm setup={setup} />
                </div>
            </div>
            <BenchResultsDisplay
                setup={setup}
                onToggleSettings={toggleSettings}
                briefTitle={briefTitle}
            />
            {showDebug && <BenchDebug setup={setup} />}
        </>
    )
}
