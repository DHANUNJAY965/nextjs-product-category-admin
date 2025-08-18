"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggleCard } from "@/components/theme-toggle-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Bell, Shield, Database, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theme Settings */}
          <div className="space-y-6">
            <ThemeToggleCard />

            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Admin User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Administrator" disabled />
                </div>
                <Button className="w-full">Update Profile</Button>
              </CardContent>
            </Card>
          </div>

          {/* Application Settings */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Configure your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Product Updates</p>
                    <p className="text-sm text-muted-foreground">Get notified when products are added or updated</p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Category Changes</p>
                    <p className="text-sm text-muted-foreground">Notifications for category modifications</p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Alerts</p>
                    <p className="text-sm text-muted-foreground">Important system notifications</p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full bg-transparent">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Enable Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  View Login History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>Manage your application data and exports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-center space-y-2">
                  <Download className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-medium">Export Products</h3>
                  <p className="text-sm text-muted-foreground">Download all product data as CSV</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Export
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-center space-y-2">
                  <Download className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-medium">Export Categories</h3>
                  <p className="text-sm text-muted-foreground">Download category data as CSV</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Export
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-center space-y-2">
                  <Settings className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-medium">Backup Settings</h3>
                  <p className="text-sm text-muted-foreground">Create a backup of your settings</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Backup
                  </Button>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
