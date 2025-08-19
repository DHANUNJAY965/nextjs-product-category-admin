"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { MobileSidebar } from "@/components/sidebar"
import { GlobalSearch } from "@/components/global-search"
import { Bell, User, Search, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifications] = useState(3) // Mock notification count

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 sm:h-16 items-center px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left Section: Mobile Menu + Logo/Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Mobile Sidebar Toggle */}
          <MobileSidebar />
          
          {/* Logo/Brand - Hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-3 min-w-0">
           
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold truncate">
                Product Manager
              </h1>
              <p className="hidden lg:block text-xs text-muted-foreground truncate">
                Manage your inventory efficiently
              </p>
            </div>
          </div>

          {/* Mobile-only compact title */}
          <div className="sm:hidden min-w-0">
            <h1 className="text-base font-semibold truncate">Dashboard</h1>
          </div>
        </div>

        {/* Right Section: Search + Actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 lg:w-80 h-9 pl-10 bg-muted/50 border-0 focus:bg-background focus:ring-1 focus:ring-ring"
              />
            </div>
          </div> */}

          {/* Mobile Search */}
          {/* <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-9 w-9 p-0"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Open search</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-20">
              <SheetHeader className="sr-only">
                <SheetTitle>Search</SheetTitle>
                <SheetDescription>Search for products and categories</SheetDescription>
              </SheetHeader>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products, categories..."
                  className="w-full h-12 pl-10 text-base"
                  autoFocus
                />
              </div>
            </SheetContent>
          </Sheet> */}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 p-0 cursor-pointer"
              >
                <Bell className="h-4 w-4 " />
                {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center "
                  >
                    {notifications > 99 ? '99+' : notifications}
                  </Badge>
                )}
                <span className="sr-only">
                  {notifications > 0 ? `${notifications} notifications` : 'No notifications'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 sm:w-96"
            >
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {notifications > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {notifications} new
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {notifications > 0 ? (
                <>
                  <DropdownMenuItem className="flex flex-col items-start p-4">
                    <div className="text-sm font-medium">New product added</div>
                    <div className="text-xs text-muted-foreground">2 minutes ago</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-4">
                    <div className="text-sm font-medium">Category updated</div>
                    <div className="text-xs text-muted-foreground">1 hour ago</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-4">
                    <div className="text-sm font-medium">Low stock alert</div>
                    <div className="text-xs text-muted-foreground">3 hours ago</div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-sm text-primary">
                    View all notifications
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className="text-center text-sm text-muted-foreground p-4">
                  No new notifications
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 hover:bg-accent focus:bg-accent cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/diverse-user-avatars.png" alt="User avatar" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    AD
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 sm:w-64 "
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@company.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Quick Actions Bar - Optional */}
      <div className="sm:hidden border-t bg-muted/30 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Welcome back, Admin</span>
          <Badge variant="outline" className="text-xs">
            Online
          </Badge>
        </div>
      </div>
    </header>
  )
}