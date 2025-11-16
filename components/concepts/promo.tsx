import { Zap, Check } from 'lucide-react'

export function ConceptsPromo() {
    const features = [
        { text: 'Comprehensive tutorials' },
        { text: 'Code examples' },
        { text: 'Research papers' },
        { text: 'Implementation guides' },
        { text: 'Best practices' },
    ]

    return (
        <div className="space-y-4">
            <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Master AI Concepts</h3>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                    Level up your understanding of cutting-edge AI and machine learning concepts
                </p>

                <ul className="space-y-2 mb-6">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            {feature.text}
                        </li>
                    ))}
                </ul>

                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
                    Explore All Concepts
                </button>
            </div>

            {/* <div className="rounded-lg bg-card border border-border p-4">
                <h4 className="font-semibold text-foreground mb-3 text-sm">Popular Topics</h4>
                <div className="space-y-2">
                    {['LLMs', 'Vision', 'Embeddings', 'Agents'].map((topic) => (
                        <a
                            key={topic}
                            href={`#topic-${topic}`}
                            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                        >
                            {topic}
                        </a>
                    ))}
                </div>
            </div> */}
        </div>
    )
}
