"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Package, Tag, Settings, Menu, ChevronLeft, Plus, BarChart3 } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Tag,
  },
  // {
  //   name: "Analytics",
  //   href: "/analytics",
  //   icon: BarChart3,
  // },
  // {
  //   name: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  // },
]

const quickActions = [
  {
    name: "Add Product",
    href: "/products/new",
    icon: Plus,
  },
  {
    name: "Add Category",
    href: "/categories/new",
    icon: Plus,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn("text-lg font-semibold tracking-tight", collapsed && "sr-only")}>Admin Panel</h2>
            <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </Button>
          </div>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed && "justify-center px-2",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                    {!collapsed && item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        {/* {!collapsed && (
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight text-muted-foreground">Quick Actions</h3>
            <div className="space-y-1">
              {quickActions.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <div className="bg-sidebar border-r">
          <Sidebar />
        </div>
      </SheetContent>
    </Sheet>
  )
}
