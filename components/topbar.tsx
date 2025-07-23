"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileCode, MessageSquare, Eye, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const { user, logout, isLoggedIn } = useAuth()

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

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Site Builder</span>
        {isLoggedIn && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                {user?.name || 
                 (user?.email ? user.email.split('@')[0] : "User")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled className="text-muted-foreground">
                {user?.email || "No email"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
