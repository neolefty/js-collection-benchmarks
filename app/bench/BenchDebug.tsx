import { BenchSetup } from "@/app/bench/BenchSetup"

export const BenchDebug = ({ setup }: { setup: BenchSetup }) => (
    <details className="col-span-2 w-full bg-accent text-accent-content mt-4 py-2">
        <summary className="text-center">State (debug)</summary>
        <p className="text-center py-3">
            Status:{" "}
            <strong>
                {[setup.start && "started", setup.running && "running"]
                    .filter(Boolean)
                    .join(", ") || "Not started"}
            </strong>
        </p>
        <code>
            {JSON.stringify(setup).replaceAll(":", ": ").replaceAll(",", ", ")}
        </code>
    </details>
)