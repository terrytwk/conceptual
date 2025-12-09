"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from 'lucide-react'

export function DocsSidebar() {
    const [expandedSections, setExpandedSections] = useState<string[]>([
        "getting-started",
        "concept-design",
        "specifications",
        "implementation",
        "synchronizations",
        "testing"
    ])

    const toggleSection = (id: string) => {
        setExpandedSections((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        )
    }

    const sections = [
        {
            id: "getting-started",
            title: "Getting Started",
            items: [
                { label: "Running the Server", href: "#running-server" },
                { label: "Running Tests", href: "#running-tests" },
            ],
        },
        {
            id: "concept-design",
            title: "Concept Design",
            items: [
                { label: "Overview", href: "#concept-design-overview" },
                { label: "What is a concept?", href: "#what-is-a-concept" },
                { label: "Independence", href: "#concept-independence" },
                { label: "Separation of Concerns", href: "#separation-of-concerns" },
                { label: "Composition", href: "#composition-by-synchronization" },
            ],
        },
        {
            id: "specifications",
            title: "Specifications",
            items: [
                { label: "Structure", href: "#spec-structure" },
                { label: "Purpose", href: "#spec-purpose" },
                { label: "Principle", href: "#spec-principle" },
                { label: "State", href: "#spec-state" },
                { label: "Actions", href: "#spec-actions" },
                { label: "Queries", href: "#spec-queries" },
            ],
        },
        {
            id: "implementation",
            title: "Implementation",
            items: [
                { label: "Overview", href: "#impl-overview" },
                { label: "Managing IDs", href: "#impl-ids" },
                { label: "State & Actions", href: "#impl-state-actions" },
                { label: "Dictionaries", href: "#impl-dictionaries" },
                { label: "Setup", href: "#impl-setup" },
            ],
        },
        {
            id: "synchronizations",
            title: "Synchronizations",
            items: [
                { label: "Overview", href: "#sync-overview" },
                { label: "Example", href: "#sync-example" },
                { label: "Frames", href: "#sync-frames" },
                { label: "Pattern Matching", href: "#sync-pattern-matching" },
                { label: "Common Pitfalls", href: "#sync-pitfalls" },
            ],
        },
        {
            id: "testing",
            title: "Testing",
            items: [
                { label: "Approach", href: "#testing-approach" },
                { label: "Implementation", href: "#testing-implementation" },
            ],
        },
    ]

    return (
        <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
                {sections.map((section) => (
                    <div key={section.id} className="space-y-2">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="flex items-center justify-between w-full text-foreground font-semibold hover:text-primary transition-colors"
                        >
                            {section.title}
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.includes(section.id) ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {expandedSections.includes(section.id) && (
                            <nav className="flex flex-col gap-2 ml-2">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    )
}
