'use client';

import { AppSidebar } from "@/components/app-side"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Dashboard } from "@/components/dashboard"
import { useLiff } from "@/contexts/LiffContext"

export default function Page() {
  const { items, isLoggedIn, profile, error } = useLiff()

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!isLoggedIn || !profile) {
    return <div>Loading LIFF or waiting for login...</div>
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <Dashboard items={items} />
        </main>
      </div>
    </SidebarProvider>
  )
}
