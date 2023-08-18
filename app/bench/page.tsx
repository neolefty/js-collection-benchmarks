import { PageBase } from "@/app/_util/PageBase"
import { BenchPage } from "@/app/bench/BenchPage"
import { useBenchSetup } from "@/app/bench/BenchSetup"

const Benchmarks = () => {
    return (
        <PageBase>
            <BenchPage showDebug autoRun className="pt-6" />
        </PageBase>
    )
}

export default Benchmarks
