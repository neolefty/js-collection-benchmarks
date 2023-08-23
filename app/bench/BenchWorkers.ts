import { BenchWorker } from "@/app/bench/BenchWorker"
import { BenchMarkType } from "@/app/bench/BenchSetup"
import { List as ImList, Map as ImMap, Set as ImSet } from "immutable"
import { produce as immerProduce } from "immer"
import { produce as structuraProduce } from "structurajs"

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

const FrozenArrayWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = Object.freeze([...basis])
    iterations.forEach(() => {
        const draft = [...scratch]
        mutations.forEach(
            (i) => (draft[Math.floor(Math.random() * draft.length)] = i),
        )
        scratch = Object.freeze(draft)
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
        scratch = immerProduce(scratch, (draft) => {
            mutations.forEach(
                (i) => (draft[Math.floor(Math.random() * draft.length)] = i),
            )
        })
    })
    if (debugLabel) console.log({ [debugLabel]: scratch })
}

const StructuraArrayWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch: ReadonlyArray<number> = [...basis]
    iterations.forEach(() => {
        scratch = structuraProduce(scratch, (draft) => {
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

const ObjectAssignWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch: Record<number, number> = Object.assign({})
    iterations.forEach(() => {
        scratch = Object.assign({})
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
        scratch = immerProduce(scratch, (draft) => {
            mutations.forEach(
                (i) => (draft[Math.floor(Math.random() * basis.length)] = i),
            )
        })
    })
    if (debugLabel) console.log({ [debugLabel]: scratch })
}

const StructuraObjectWorker: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = Object.fromEntries(basis.entries())
    iterations.forEach(() => {
        scratch = structuraProduce(scratch, (draft) => {
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

const MapIterator: BenchWorker = async (
    basis,
    iterations,
    mutations,
    debugLabel,
) => {
    let scratch = new Map(basis.entries())
    iterations.forEach(() => {
        const tmp = new Map()
        for (const entry of scratch.entries()) tmp.set(entry[0], entry[1])
        scratch = tmp
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

const SleepWorker: BenchWorker = async (basis, iterations, _, debugLabel) => {
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
    "object spread": ObjectWorker,
    "object.assign": ObjectAssignWorker,
    "object with freeze": FrozenObjectWorker,
    "immer object": ImmerObjectWorker,
    "structura object": StructuraObjectWorker,
    "immutable Map": ImmutableMapWorker,
    Map: MapWorker,
    "Map from iterator": MapIterator,

    array: ArrayWorker,
    "immer array": ImmerArrayWorker,
    "structura array": StructuraArrayWorker,
    "array with freeze": FrozenArrayWorker,
    "immutable List": ImmutableListWorker,

    "immutable Set": ImmutableSetWorker,
    Set: SetWorker,

    sleep: SleepWorker,
    "overhead only": OverheadOnlyWorker,
}
