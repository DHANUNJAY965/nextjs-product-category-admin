// import type React from "react"
// import { Header } from "@/components/header"
// import { Sidebar } from "@/components/sidebar"
// import { ErrorBoundary } from "@/components/error-boundary"

// interface DashboardLayoutProps {
//   children: React.ReactNode
// }

// export function DashboardLayout({ children }: DashboardLayoutProps) {
//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <div className="flex flex-1">
//         {/* Desktop Sidebar */}
//         <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
//           <div className="flex flex-col flex-grow bg-sidebar border-r border-sidebar-border">
//             <Sidebar />
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex flex-col flex-1 md:pl-64">
//           <Header />
//           <main className="flex-1 p-6">
//             <ErrorBoundary>{children}</ErrorBoundary>
//           </main>
//         </div>
//       </div>
//     </div>
//   )
// }
import type React from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ErrorBoundary } from "@/components/error-boundary"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Desktop Sidebar - Now responsive with proper width management */}
        <div className="hidden lg:block relative">
          <div className="h-full bg-sidebar border-r border-sidebar-border">
            <Sidebar />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Header with proper spacing */}
          <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
            <Header />
          </div>

          {/* Main Content with proper padding and scrolling */}
          <main className="flex-1 overflow-y-auto bg-muted/30">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
              <ErrorBoundary>{children}</ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}