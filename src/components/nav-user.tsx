"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"
import { useAppDispatch } from "@/lib/store/hooks"
import { resetAuth } from "@/lib/features/auth/adminAuthSlice"
import { useRouter } from "next/navigation"
import homy from "@/assets/homy.png"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    profileImage?: string | null
  }
}) {
  const { isMobile } = useSidebar()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleSignOut = () => {
    // Clear all auth data
    dispatch(resetAuth());
    // Use window.location for immediate redirect (no React state delays)
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className=" flex items-center"
              // className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={user.profileImage && user.profileImage.trim() !== "" ? user.profileImage : homy.src}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name || "User"}</span>
                <span className="truncate text-xs">{user.email || ""}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align={isMobile ? "end" : "start"}
            sideOffset={8}
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">{user.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email || ""}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              variant="destructive"
              className="cursor-pointer"
            >
              <LogOut className="text-destructive" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
