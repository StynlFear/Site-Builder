"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileCode, MessageSquare, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    name: "Page Editor",
    href: "/dashboard",
    icon: FileCode,
  },
  {
    name: "Conversation",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Live Preview",
    href: "/preview",
    icon: Eye,
  },
]

export function TopBar() {
  const pathname = usePathname()

  return (
    <div className="flex h-14 items-center justify-between border-b px-4 bg-background">
      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant={pathname === item.href ? "secondary" : "ghost"}
            size="sm"
            className={cn("gap-2", pathname === item.href ? "bg-secondary" : "")}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Coffee Shop Landing Page</span>
      </div>
    </div>
  )
}
