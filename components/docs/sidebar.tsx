"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from 'lucide-react'

export function DocsSidebar() {
    const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started"])

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
                { label: "Introduction", href: "#introduction" },
                { label: "Installation", href: "#installation" },
                { label: "Quick Start", href: "#quick-start" },
            ],
        },
        {
            id: "features",
            title: "Features",
            items: [
                { label: "Code Reviews", href: "#code-reviews" },
                { label: "Integrations", href: "#integrations" },
                { label: "Real-time Previews", href: "#previews" },
            ],
        },
        {
            id: "guides",
            title: "Guides",
            items: [
                { label: "Authentication", href: "#authentication" },
                { label: "API Setup", href: "#api-setup" },
                { label: "Deployment", href: "#deployment" },
            ],
        },
        {
            id: "api",
            title: "API Reference",
            items: [
                { label: "Endpoints", href: "#endpoints" },
                { label: "Authentication", href: "#api-auth" },
                { label: "Error Handling", href: "#errors" },
            ],
        },
        {
            id: "faq",
            title: "FAQ",
            items: [
                { label: "Common Questions", href: "#questions" },
                { label: "Troubleshooting", href: "#troubleshooting" },
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
