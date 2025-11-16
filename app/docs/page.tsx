import { Header } from "@/components/header"
import { FooterSection } from "@/components/footer-section"
import { DocsSidebar } from "@/components/docs/sidebar"
import { DocsContent } from "@/components/docs/content"

export const metadata = {
    title: "Documentation | Pointer",
    description: "Complete documentation and guides for Pointer AI platform.",
}

export default function DocsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 gap-8 py-8">
                {/* Sidebar */}
                <DocsSidebar />

                {/* Main Content */}
                <DocsContent />
            </div>
            <FooterSection />
        </div>
    )
}
