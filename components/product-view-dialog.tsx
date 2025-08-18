"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star, Package } from "lucide-react"
import type { Product } from "@/types"

interface ProductViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

export function ProductViewDialog({ open, onOpenChange, product }: ProductViewDialogProps) {
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>{product.title}</span>
          </DialogTitle>
          <DialogDescription>Product details and information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          {product.thumbnail && (
            <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
              <img
                src={product.thumbnail || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Price</h3>
              <p className="text-2xl font-bold text-primary">${product.price}</p>
              {product.discountPercentage && (
                <p className="text-sm text-green-600">{product.discountPercentage}% discount</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Category</h3>
              <Badge variant="outline" className="text-sm">
                {product.category}
              </Badge>
            </div>

            {product.rating && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Rating</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">/ 5</span>
                </div>
              </div>
            )}

            {product.stock !== undefined && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Stock</h3>
                <Badge variant={product.stock > 10 ? "default" : "destructive"}>{product.stock} units</Badge>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Description</h3>
            <p className="text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Brand */}
          {product.brand && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Brand</h3>
              <p className="text-sm">{product.brand}</p>
            </div>
          )}

          {/* Additional Images */}
          {product.images && product.images.length > 1 && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Additional Images</h3>
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(1, 4).map((image, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-md overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
