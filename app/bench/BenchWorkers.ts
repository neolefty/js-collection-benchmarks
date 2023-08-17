import { BenchWorker } from "@/app/bench/BenchWorker"
import { BenchMarkType } from "@/app/bench/BenchSetup"
import { it } from "node:test"
import { List as ImList, Map as ImMap, Set as ImSet } from "immutable"
import { produce } from "immer"

const ArrayWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = [...basis]
    iterations.forEach(() => {
        scratch = [...scratch]
        mutations.forEach(
            (i) => (scratch[Math.floor(Math.random() * scratch.length)] = i),
        )
    })
    if (debugLabel) console.log({ [debugLabel]: scratch })
}

const ImmerArrayWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = [...basis]
    iterations.forEach(() => {
        scratch = produce(scratch, (draft) => {
            mutations.forEach(
                (i) => (draft[Math.floor(Math.random() * draft.length)] = i),
            )
        })
    })
    if (debugLabel) console.log({ [debugLabel]: scratch })
}

const ObjectWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = Object.fromEntries(basis.entries())
    iterations.forEach(() => {
        scratch = { ...scratch }
        mutations.forEach(
            (i) => (scratch[Math.floor(Math.random() * basis.length)] = i),
        )
    })
    if (debugLabel) console.log({ [debugLabel]: scratch })
}

const ImmerObjectWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = Object.fromEntries(basis.entries())
    iterations.forEach(() => {
        scratch = produce(scratch, (draft) => {
            mutations.forEach(
                (i) => (draft[Math.floor(Math.random() * basis.length)] = i),
            )
        })
    })
    if (debugLabel) console.log({ [debugLabel]: scratch })
}

const FrozenObjectWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = Object.fromEntries(basis.entries())
    iterations.forEach(() => {
        scratch = { ...scratch }
        mutations.forEach(
            (i) => (scratch[Math.floor(Math.random() * basis.length)] = i),
        )
        scratch = Object.freeze(scratch)
    })
    if (debugLabel) console.log({ [debugLabel]: scratch })
}

const ImmutableListWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = ImList(basis)
    iterations.forEach(() => {
        scratch = scratch.withMutations((mutable) =>
            mutations.forEach((i) =>
                mutable.set(Math.floor(Math.random() * scratch.size), i),
            ),
        )
    })
    if (debugLabel) console.log({ [debugLabel]: scratch.toArray() })
}

const ImmutableMapWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = ImMap(basis.entries())
    iterations.forEach(() => {
        scratch = scratch.withMutations((mutable) =>
            mutations.forEach((i) =>
                mutable.set(Math.floor(Math.random() * scratch.size), i),
            ),
        )
    })
    if (debugLabel) console.log({ [debugLabel]: scratch.toObject() })
}

const ImmutableSetWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = ImSet(basis)
    iterations.forEach(() => {
        scratch = scratch.withMutations((mutable) =>
            mutations.forEach(() =>
                mutable.delete(mutable.first()).add(Math.random()),
            ),
        )
    })
    if (debugLabel) console.log({ [debugLabel]: scratch.toArray() })
}

const MapWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = new Map(basis.entries())
    iterations.forEach(() => {
        scratch = new Map(scratch.entries())
        mutations.forEach((i) =>
            scratch.set(Math.floor(Math.random() * scratch.size), i),
        )
    })
    if (debugLabel) console.log({ [debugLabel]: scratch })
}

const SetWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = new Set(basis)
    iterations.forEach(() => {
        scratch = new Set(scratch.values())
        if (mutations.length)
            mutations.forEach(() => {
                const deleted = scratch.delete(scratch.values().next().value)
                if (deleted || scratch.size === 0) scratch.add(Math.random())
                else console.log("Oops, deletion failed")
            })
    })
    if (debugLabel) console.log({ [debugLabel]: scratch })
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const SleepWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    const ms = basis.length * iterations.length * 0.000001
    await sleep(ms)
    if (debugLabel) console.log({ [debugLabel]: `Slept ${ms} ms` })
}

const OverheadOnlyWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    const scratch = [...basis]
    iterations.forEach(() => {
        // no copying, just mutating
        mutations.forEach(
            (i) => (scratch[Math.floor(Math.random() * scratch.length)] = i),
        )
    })
    if (debugLabel) console.log({ [debugLabel]: "Overhead only" })
}

export const BenchWorkers: Partial<Record<BenchMarkType, BenchWorker>> = {
    array: ArrayWorker,
    object: ObjectWorker,
    "immer array": ImmerObjectWorker,
    "immer object": ImmerObjectWorker,
    "object with freeze": FrozenObjectWorker,
    "immutable List": ImmutableListWorker,
    "immutable Map": ImmutableMapWorker,
    "immutable Set": ImmutableSetWorker,
    Map: MapWorker,
    Set: SetWorker,
    sleep: SleepWorker,
    "overhead only": OverheadOnlyWorker,
}
