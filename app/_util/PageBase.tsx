"use client"

import { PropsWithChildren, ReactNode } from "react"
import { usePathname } from "next/navigation"

export const PageBase = ({ children }: PropsWithChildren) => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow flex flex-col">{children}</main>
        </div>
    )
}

export const NavBar = () => (
    <header className="w-screen flex flex-row  justify-between text-xl border-b-4 border-green-300 dark:border-green-700  bg-amber-400 dark:bg-amber-900 gap-1 px-2">
        <h1 className="flex items-end font-bold px-2 py-1">
            JS Collection Benchmarks
        </h1>
        <Nav route="bench">Benchmarks</Nav>
        <Nav route="next">Next.js Guide</Nav>
    </header>
)

const Nav = ({ route, children }: { route: string; children: ReactNode }) => {
    const path = usePathname()
    const isCurrent = path.toLowerCase().indexOf(route) >= 0
    return isCurrent ? (
        <nav className="flex-grow text-center bg-green-300 dark:bg-green-700 px-2 py-1 mt-2 rounded-t-lg">
            {children}
        </nav>
    ) : (
        <a
            href={`/${route}`}
            className="flex-grow text-center bg-green-500 dark:bg-green-900 px-2 py-1 mt-2 rounded-t-lg"
        >
            {children}
        </a>
    )
}
