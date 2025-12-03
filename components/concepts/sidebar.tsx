import { ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface ConceptsSidebarProps {
    selectedCategory: string
    onSelectCategory: (category: string) => void
}

const baseCategories = [
    { id: 'all', label: 'All Concepts' },
    { id: 'user-management', label: 'User Management' },
    { id: 'social', label: 'Social' },
    { id: 'content', label: 'Content' },
    { id: 'interaction', label: 'Interaction' },
]

export function ConceptsSidebar({ selectedCategory, onSelectCategory }: ConceptsSidebarProps) {
    const { isAuthenticated } = useAuth()
    const categories = isAuthenticated
        ? [...baseCategories, { id: 'liked', label: 'Liked Concepts' }]
        : baseCategories
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Categories</h3>
                <div className="space-y-2">
                    {categories.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSelectCategory(item.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${selectedCategory === item.id
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground hover:bg-muted'
                                }`}
                            disabled={item.id === 'liked' && !isAuthenticated}
                        >
                            <span>{item.label}</span>
                            {selectedCategory === item.id && <ChevronRight className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
