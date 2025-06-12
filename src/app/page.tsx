import { AppSidebar } from "@/components/app-side"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Dashboard } from "@/components/dashboard"

export default function Page() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <Dashboard items={[]} />
        </main>
      </div>
    </SidebarProvider>
  )
}
