import { PropsWithChildren } from "react"

export const BenchmarkHeader2 = ({
    children,
    className,
}: PropsWithChildren<{ className?: string }>) => (
    <h2
        className={
            "gap-3 col-span-2 text-xl font-bold bg-primary text-primary-content w-full text-center py-3 " +
                className || ""
        }
    >
        {children}
    </h2>
)
