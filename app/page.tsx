import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Tag, TrendingUp, Users, ArrowUpRight, Activity } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h2>
        <p className="text-muted-foreground">Here's what's happening with your products and categories today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">194</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              +2 new this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              +0.3 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,429</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Product Management
            </CardTitle>
            <CardDescription>Manage your product catalog with full CRUD operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Link href="/products">
                <Button className="w-full justify-start cursor-pointer" variant="default">
                  <Package className="mr-2 h-4 w-4" />
                  View All Products
                </Button>
              </Link>
              {/* <Link href="/products/new">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  Add New Product
                </Button>
              </Link> */}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              Category Management
            </CardTitle>
            <CardDescription>Organize your products with custom categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Link href="/categories">
                <Button className="w-full justify-start cursor-pointer" variant="default">
                  <Tag className="mr-2 h-4 w-4" />
                  View All Categories
                </Button>
              </Link>
              {/* <Link href="/categories/new">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  Add New Category
                </Button>
              </Link> */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates to your products and categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New product "Wireless Headphones" added</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Category "Electronics" updated</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Product "Smartphone Case" deleted</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
