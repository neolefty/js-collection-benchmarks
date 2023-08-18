import { BenchPage } from "@/app/bench/BenchPage"
import { BenchmarkHeader2 } from "@/app/_util/BenchmarkHeader"

export default function UnframedBenchPage() {
    return (
        <main className="min-h-screen">
            <BenchmarkHeader2>Settings</BenchmarkHeader2>
            <BenchPage autoRun className="pt-4" />
        </main>
    )
}
