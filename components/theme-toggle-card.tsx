"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, Palette } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ThemeToggleCard() {
  const { theme, setTheme, systemTheme } = useTheme()

  const themes = [
    {
      name: "Light",
      value: "light",
      icon: Sun,
      description: "Clean and bright interface",
    },
    {
      name: "Dark",
      value: "dark",
      icon: Moon,
      description: "Easy on the eyes",
    },
    {
      name: "System",
      value: "system",
      icon: Monitor,
      description: "Follows your system preference",
    },
  ]

  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="mr-2 h-5 w-5" />
          Theme Preferences
        </CardTitle>
        <CardDescription>
          Choose your preferred theme. Current theme:{" "}
          <Badge variant="secondary" className="ml-1">
            {theme === "system" ? `System (${systemTheme})` : theme}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon
            const isActive = theme === themeOption.value

            return (
              <Button
                key={themeOption.value}
                variant={isActive ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setTheme(themeOption.value)}
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{themeOption.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{themeOption.description}</div>
                </div>
              </Button>
            )
          })}
        </div>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            The theme preference is automatically saved and will be remembered across sessions. System theme
            automatically switches between light and dark based on your device settings.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
