import type React from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ErrorBoundary } from "@/components/error-boundary"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow bg-sidebar border-r border-sidebar-border">
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 md:pl-64">
          <Header />
          <main className="flex-1 p-6">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  )
}
