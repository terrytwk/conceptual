"use client"

import { Header } from "@/components/header"
import { FooterSection } from "@/components/footer-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { LogOut, User, Edit2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { getProfile, setProfile } from "@/lib/profile"

// Initial user data structure
const initialUserData = {
  name: "",
  username: "",
  bio: "",
  avatarUrl: "",
}

// Get user initials (first and last name) for avatar
const getInitials = (name: string) => {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export default function ProfilePage() {
  const { userId, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState(initialUserData)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: initialUserData.name,
    username: initialUserData.username,
    bio: initialUserData.bio,
    avatarUrl: initialUserData.avatarUrl,
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Fetch user profile when authenticated
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !isAuthenticated) {
        setIsLoadingProfile(false)
        return
      }

      try {
        setIsLoadingProfile(true)
        const profile = await getProfile(userId)
        setUserData({
          name: profile.displayName || "",
          username: profile.username || "",
          bio: profile.bio || "",
          avatarUrl: profile.avatarUrl || "",
        })
        setEditForm({
          name: profile.displayName || "",
          username: profile.username || "",
          bio: profile.bio || "",
          avatarUrl: profile.avatarUrl || "",
        })
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        // Keep default empty values on error
      } finally {
        setIsLoadingProfile(false)
      }
    }

    if (isAuthenticated && userId) {
      fetchProfile()
    }
  }, [userId, isAuthenticated])

  const handleDialogOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (open) {
      // Initialize form with current data when dialog opens
      setEditForm({
        name: userData.name,
        username: userData.username,
        bio: userData.bio,
        avatarUrl: userData.avatarUrl,
      })
    }
  }

  const handleSave = async () => {
    if (!userId) return

    try {
      setIsSaving(true)
      await setProfile(userId, {
        displayName: editForm.name,
        username: editForm.username,
        bio: editForm.bio,
        avatarUrl: editForm.avatarUrl,
      })
      
      // Update local state
      setUserData({
        ...userData,
        name: editForm.name,
        username: editForm.username,
        bio: editForm.bio,
        avatarUrl: editForm.avatarUrl,
      })
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Failed to save profile:", error)
      alert(error instanceof Error ? error.message : "Failed to save profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditForm({
      name: userData.name,
      username: userData.username,
      bio: userData.bio,
      avatarUrl: userData.avatarUrl,
    })
    setIsEditDialogOpen(false)
  }

  if (isLoading || isLoadingProfile) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
        <FooterSection />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex-1 px-4 py-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            {/* Profile Header with Photo */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 pb-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Profile Photo */}
                {userData.avatarUrl ? (
                  <div className="w-32 h-32 rounded-full border-4 border-background shadow-lg ring-2 ring-primary/30 overflow-hidden">
                    <img
                      src={userData.avatarUrl}
                      alt={userData.name || userData.username || "Profile"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<span class="text-5xl font-semibold text-primary flex items-center justify-center w-full h-full bg-primary/20">${getInitials(userData.name || userData.username || "")}</span>`
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-4 border-background shadow-lg ring-2 ring-primary/30">
                    <span className="text-5xl font-semibold text-primary">
                      {getInitials(userData.name || userData.username || "")}
                    </span>
                  </div>
                )}
                
                {/* Name and Username */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        {userData.name || userData.username || "User"}
                      </h1>
                      {userData.username && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span className="text-lg">@{userData.username}</span>
                        </div>
                      )}
                    </div>
                    <Dialog open={isEditDialogOpen} onOpenChange={handleDialogOpenChange}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                          <DialogDescription>
                            Update your profile information. Changes will be saved immediately.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-foreground">
                              Full Name
                            </label>
                            <Input
                              id="name"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              placeholder="Enter your full name"
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-foreground">
                              Username
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">@</span>
                              <Input
                                id="username"
                                value={editForm.username}
                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                placeholder="username"
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="avatarUrl" className="text-sm font-medium text-foreground">
                              Avatar URL
                            </label>
                            <Input
                              id="avatarUrl"
                              value={editForm.avatarUrl}
                              onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                              placeholder="https://example.com/avatar.jpg"
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="bio" className="text-sm font-medium text-foreground">
                              Bio
                            </label>
                            <textarea
                              id="bio"
                              value={editForm.bio}
                              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                              placeholder="Tell us about yourself"
                              rows={4}
                              className={cn(
                                "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                              )}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-8 space-y-8">
              {/* Bio Section - Only show if bio exists */}
              {userData.bio && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">About</h2>
                  <p className="text-foreground leading-relaxed text-base whitespace-pre-wrap">
                    {userData.bio}
                  </p>
                </div>
              )}

              {/* Logout Button */}
              <div className={`pt-6 border-t border-border ${userData.bio ? '' : 'mt-0'}`}>
                <Button
                  onClick={logout}
                  variant="destructive"
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  )
}

