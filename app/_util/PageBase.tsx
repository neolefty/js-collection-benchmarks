"use client"

import { PropsWithChildren, ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

export const PageBase = ({ children }: PropsWithChildren) => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow flex flex-col">{children}</main>
        </div>
    )
}

export const NavBar = () => (
    <header className="w-screen flex flex-row  justify-between text-xl border-b-8 border-primary bg-accent gap-2 px-2">
        <h1 className="flex items-end font-bold px-2 py-1 text-accent-content">
            JS Collection Benchmarks
        </h1>
        <Nav route="bench">Benchmarks</Nav>
        <Nav route="next">Next.js Guide</Nav>
    </header>
)

const Nav = ({ route, children }: { route: string; children: ReactNode }) => {
    const path = usePathname()
    const pathElements = path.split("/")
    const leaf = pathElements[pathElements.length - 1]
    const isCurrent = leaf.toLowerCase() === route
    return isCurrent ? (
        <nav className="flex-grow flex place-content-center items-center bg-primary text-primary-content px-2 pb-1 pt-2 mt-2 rounded-t-lg">
            {children}
        </nav>
    ) : (
        <Link
            href={`/${route}`}
            className="flex-grow flex place-content-center items-center bg-secondary text-secondary-content px-2 pb-1 pt-2 mt-2 rounded-t-lg"
        >
            {children}
        </Link>
    )
}
