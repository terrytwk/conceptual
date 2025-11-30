"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { reserveConceptName, publishConceptVersion } from "@/lib/concepts"
import { useAuth } from "@/contexts/auth-context"
import { Plus } from "lucide-react"

interface AddConceptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddConceptDialog({ open, onOpenChange, onSuccess }: AddConceptDialogProps) {
  const { userId } = useAuth()
  const [uniqueName, setUniqueName] = useState("")
  const [semver, setSemver] = useState("1.0.0")
  const [artifactUrl, setArtifactUrl] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!userId) {
      setError("You must be logged in to register a concept")
      return
    }

    if (!uniqueName.trim()) {
      setError("Concept name is required")
      return
    }

    if (!semver.trim()) {
      setError("Version is required")
      return
    }

    if (!artifactUrl.trim()) {
      setError("Artifact URL is required")
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Reserve the concept name
      const conceptId = await reserveConceptName(uniqueName.trim(), userId)

      // Step 2: Publish the version
      await publishConceptVersion(conceptId, semver.trim(), artifactUrl.trim())

      // Reset form
      setUniqueName("")
      setSemver("1.0.0")
      setArtifactUrl("")
      setDescription("")
      
      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register concept. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setUniqueName("")
      setSemver("1.0.0")
      setArtifactUrl("")
      setDescription("")
      setError("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Concept</DialogTitle>
          <DialogDescription>
            Register a new concept to make it available in the registry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="uniqueName" className="text-sm font-medium text-foreground">
              Concept Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="uniqueName"
              type="text"
              placeholder="MyAwesomeConcept"
              value={uniqueName}
              onChange={(e) => setUniqueName(e.target.value)}
              required
              disabled={isLoading}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Unique identifier for your concept (e.g., MyAwesomeConcept)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="semver" className="text-sm font-medium text-foreground">
              Version <span className="text-destructive">*</span>
            </label>
            <Input
              id="semver"
              type="text"
              placeholder="1.0.0"
              value={semver}
              onChange={(e) => setSemver(e.target.value)}
              required
              disabled={isLoading}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Semantic version (e.g., 1.0.0, 2.1.3)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="artifactUrl" className="text-sm font-medium text-foreground">
              Artifact URL <span className="text-destructive">*</span>
            </label>
            <Input
              id="artifactUrl"
              type="url"
              placeholder="https://example.com/concepts/myconcept-v1.0.0.ts"
              value={artifactUrl}
              onChange={(e) => setArtifactUrl(e.target.value)}
              required
              disabled={isLoading}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              URL to the concept artifact file
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Brief description of what this concept does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              Optional description (not yet stored in backend)
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "Registering..." : "Register Concept"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


