"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import {  SheetTitle, SheetDescription } from "@/components/ui/sheet"

import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Settings, 
  Menu, 
  ChevronLeft, 
  ChevronRight,
  Plus, 
  BarChart3,
  X
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
]

interface SidebarProps {
  className?: string
  isMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ className, isMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const previousPathname = useRef(pathname)

  const handleToggleCollapse = () => {
    setIsAnimating(true)
    setCollapsed(!collapsed)
    setTimeout(() => setIsAnimating(false), 300)
  }

  // Only close mobile sidebar when pathname actually changes (not on initial mount)
  useEffect(() => {
    if (isMobile && onClose && previousPathname.current !== pathname) {
      onClose()
    }
    previousPathname.current = pathname
  }, [pathname, isMobile, onClose])

  const sidebarWidth = collapsed ? 'w-16' : 'w-64'

  return (
    <div className={cn(
      "relative h-full transition-all duration-300 ease-in-out",
      sidebarWidth,
      isMobile && "w-72",
      className
    )}>
      {/* Sidebar Content */}
      <div className="flex flex-col h-full bg-sidebar">
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold tracking-tight truncate">
                  Admin Panel
                </h2>
                <p className="text-xs text-muted-foreground truncate">
                  v1.0.0
                </p>
              </div>
            </div>
          )}
          
          {collapsed && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
            </div>
          )}

          {/* Toggle Button - Desktop Only */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleCollapse}
              className={cn(
                "h-8 w-8 p-0 shrink-0 hover:bg-sidebar-accent cursor-pointer",
                collapsed && "mx-auto mt-2"
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4 cursor-pointer" />
              ) : (
                <ChevronLeft className="h-4 w-4 cursor-pointer" />
              )}
            </Button>
          )}

          {/* Close Button - Mobile Only - Removed since Sheet provides its own close button */}
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {!collapsed && (
              <div className="px-3 pb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Navigation
                </p>
              </div>
            )}
            
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href} className="block">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size={collapsed ? "sm" : "default"}
                    className={cn(
                      "w-full transition-all duration-200 cursor-pointer",
                      collapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "justify-start h-10",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm",
                      !isActive && "hover:bg-sidebar-accent/50"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 shrink-0",
                      !collapsed && "mr-3"
                    )} />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate">{item.name}</span>
                    )}
                    {!collapsed && isActive && (
                      <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Section */}
        {!collapsed && (
          <div className="p-3 border-t border-sidebar-border mt-auto">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                Online
              </Badge>
              <span>System Ready</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden h-9 w-9 p-0 hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent 
        side="left" 
        className="p-0 w-72 border-r"
      >
        <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Sidebar navigation links for mobile view
        </SheetDescription>

        <Sidebar isMobile onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}