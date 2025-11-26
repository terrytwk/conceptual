"use client"

import { Header } from "@/components/header"
import { FooterSection } from "@/components/footer-section"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
  const { userId, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
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

  // Get user initial for avatar
  const getInitial = (username: string | null) => {
    if (!username) return "?"
    return username.charAt(0).toUpperCase()
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h1 className="text-3xl font-semibold mb-8 text-foreground">Profile</h1>
            
            <div className="space-y-6">
              {/* Profile Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                  <span className="text-3xl font-semibold text-primary">
                    {getInitial(userId)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    {userId || "User"}
                  </h2>
                  <p className="text-muted-foreground">Member since today</p>
                </div>
              </div>

              {/* User Information */}
              <div className="space-y-4 pt-6 border-t border-border">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Username
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-md border border-border">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{userId || "N/A"}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    User ID
                  </label>
                  <div className="px-4 py-3 bg-muted rounded-md border border-border">
                    <span className="text-foreground font-mono text-sm">{userId || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="pt-6 border-t border-border">
                <Button
                  onClick={logout}
                  variant="destructive"
                  className="w-full flex items-center justify-center gap-2"
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

