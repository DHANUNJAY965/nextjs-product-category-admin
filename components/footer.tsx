import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Code, Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-12 border-t bg-muted/30">
      <div className="container mx-auto px-6 py-8">
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About */}
              <div>
                <h3 className="font-semibold mb-3">Product & Category Manager</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A professional admin dashboard built with modern technologies for efficient product and category
                  management.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Next.js 14
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    TypeScript
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    ShadCN UI
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Tailwind CSS
                  </Badge>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <Zap className="h-3 w-3 mr-2 text-primary" />
                    Full CRUD Operations
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-3 w-3 mr-2 text-primary" />
                    Advanced Search & Filtering
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-3 w-3 mr-2 text-primary" />
                    Dark/Light Theme Support
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-3 w-3 mr-2 text-primary" />
                    Responsive Design
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-3 w-3 mr-2 text-primary" />
                    Form Validation
                  </li>
                </ul>
              </div>

              {/* Technical Details */}
              <div>
                <h3 className="font-semibold mb-3">Technical Stack</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• React Hook Form + Zod validation</li>
                  <li>• DummyJSON API integration</li>
                  <li>• Local storage for categories</li>
                  <li>• Responsive mobile-first design</li>
                  <li>• Accessible UI components</li>
                </ul>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Code className="h-4 w-4 mr-2" />
                Built with modern web technologies
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for technical excellence
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  )
}
