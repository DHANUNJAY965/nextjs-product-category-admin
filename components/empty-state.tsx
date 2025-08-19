"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 ">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">{description}</p>
        {action && (
          <Button onClick={action.onClick} size="lg" className="">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
