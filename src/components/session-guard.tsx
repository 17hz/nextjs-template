"use client"

import { useSession } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"

function FullScreenSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { isPending } = useSession()

  if (isPending) {
    return <FullScreenSpinner />
  }

  return <>{children}</>
}
