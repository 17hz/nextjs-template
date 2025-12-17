"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Mail, Lock, Trash2, Camera, AlertCircle, Check, ArrowLeft, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback  } from "@/components/ui/avatar"
import {
  useSession,
  updateUser,
  changePassword,
  changeEmail,
  deleteUser,
  signOut,
} from "@/lib/auth-client"

type TabKey = "profile" | "email" | "password" | "danger"

const tabs: { key: TabKey; label: string; icon: React.ReactNode; danger?: boolean }[] = [
  { key: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { key: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { key: "password", label: "Password", icon: <Lock className="h-4 w-4" /> },
  { key: "danger", label: "Delete Account", icon: <Trash2 className="h-4 w-4" />, danger: true },
]

function ProfilePanel() {
  const { data: session, refetch } = useSession()
  const [name, setName] = useState(session?.user?.name || "")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpdateName = async () => {
    if (!name.trim()) return
    setIsLoading(true)
    setMessage(null)

    const result = await updateUser({ name })
    if (result.error) {
      setMessage({ type: "error", text: result.error.message || "Failed to update name" })
    } else {
      setMessage({ type: "success", text: "Name updated successfully" })
      refetch()
    }
    setIsLoading(false)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 1MB" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      const result = await updateUser({ image: base64 })
      if (result.error) {
        setMessage({ type: "error", text: result.error.message || "Failed to update avatar" })
      } else {
        setMessage({ type: "success", text: "Avatar updated successfully" })
        refetch()
      }
      setIsLoading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your public profile information
        </p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className="animate-in fade-in-50">
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="group relative">
            <Avatar size="xl" className="shadow-xl ring-4 ring-background">
              <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "Avatar"} />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                {/* {getInitials(session?.user?.name || "U")} */}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              disabled={isLoading}
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="font-medium">{session?.user?.name}</p>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-sm font-medium text-primary hover:underline"
              disabled={isLoading}
            >
              Change avatar
            </button>
          </div>
        </div>

        <div className="h-px bg-border" />

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Display Name</FieldLabel>
            <FieldDescription>This is how others will see you</FieldDescription>
            <div className="mt-2 flex gap-3">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={isLoading}
                className="max-w-sm"
              />
              <Button onClick={handleUpdateName} disabled={isLoading || !name.trim()}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </div>
    </div>
  )
}

function EmailPanel() {
  const { data: session, refetch } = useSession()
  const [newEmail, setNewEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChangeEmail = async () => {
    if (!newEmail.trim()) return
    setIsLoading(true)
    setMessage(null)

    const result = await changeEmail({ newEmail })
    if (result.error) {
      setMessage({ type: "error", text: result.error.message || "Failed to change email" })
    } else {
      setMessage({ type: "success", text: "Email updated successfully" })
      setNewEmail("")
      refetch()
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Email Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your email address
        </p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className="animate-in fade-in-50">
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm font-medium">Current Email</p>
          <p className="mt-1 text-lg">{session?.user?.email}</p>
        </div>

        <div className="h-px bg-border" />

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="newEmail">New Email Address</FieldLabel>
            <FieldDescription>Enter your new email address</FieldDescription>
            <div className="mt-2 flex gap-3">
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@example.com"
                disabled={isLoading}
                className="max-w-sm"
              />
              <Button onClick={handleChangeEmail} disabled={isLoading || !newEmail.trim()}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </div>
    </div>
  )
}

function PasswordPanel() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    const result = await changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    })

    if (result.error) {
      setMessage({ type: "error", text: result.error.message || "Failed to change password" })
    } else {
      setMessage({ type: "success", text: "Password changed successfully" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your password to keep your account secure
        </p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className="animate-in fade-in-50">
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <FieldGroup className="max-w-md space-y-4">
        <Field>
          <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isLoading}
            className="mt-2"
          />
        </Field>

        <div className="h-px bg-border" />

        <Field>
          <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
          <FieldDescription>At least 8 characters</FieldDescription>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            className="mt-2"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            className="mt-2"
          />
        </Field>
        <Field>
          <Button
            onClick={handleChangePassword}
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="mt-2"
          >
            {isLoading ? "Changing..." : "Change Password"}
          </Button>
        </Field>
      </FieldGroup>
    </div>
  )
}

function DangerPanel() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") return

    setIsLoading(true)
    setError("")

    const result = await deleteUser()
    if (result.error) {
      setError(result.error.message || "Failed to delete account")
      setIsLoading(false)
    } else {
      await signOut()
      router.push("/")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-destructive">Danger Zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Irreversible and destructive actions
        </p>
      </div>

      <Card className="border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium">Delete Account</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers.
                </DialogDescription>
              </DialogHeader>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <FieldLabel htmlFor="confirmDelete">
                  Type <span className="font-mono font-bold text-destructive">DELETE</span> to confirm
                </FieldLabel>
                <Input
                  id="confirmDelete"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  disabled={isLoading}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={confirmText !== "DELETE" || isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>("profile")

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    router.push("/signin")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="rounded-full p-2 transition-colors hover:bg-white/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <Settings className="h-6 w-6" />
                Settings
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Main Content - Left/Right Layout */}
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="w-56 shrink-0">
            <nav className="sticky top-8 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all",
                    activeTab === tab.key
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-white/60 hover:text-foreground",
                    tab.danger && activeTab === tab.key && "text-destructive",
                    tab.danger && activeTab !== tab.key && "hover:text-destructive"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Content */}
          <main className="min-w-0 flex-1">
            <Card className="p-8 shadow-sm">
              {activeTab === "profile" && <ProfilePanel />}
              {activeTab === "email" && <EmailPanel />}
              {activeTab === "password" && <PasswordPanel />}
              {activeTab === "danger" && <DangerPanel />}
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
