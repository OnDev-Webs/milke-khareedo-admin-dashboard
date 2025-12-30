"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Bot,
  Settings2,
  SquareTerminal,
  FileText,
  Settings,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAppSelector } from "@/lib/store/hooks"
import Image from "next/image"
import logo from "@/assets/logo.png"

const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: SquareTerminal },
  { title: "Properties", url: "/properties", icon: Bot },
  { title: "Developers", url: "/developers", icon: BookOpen },
  { title: "Lead / CRM", url: "/lead-crm", icon: Settings2 },
  { title: "Blogs", url: "/blogs", icon: FileText },
]

const navSetting = [
  { title: "Setting", url: "/settings", icon: Settings },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { name, email, profileImage } = useAppSelector((state) => state.auth)

  const user = {
    name: name || "",
    email: email || "",
    profileImage: profileImage || null,
  }

  const navMainWithActive = navMain.map((item) => ({
    ...item,
    isActive:
      pathname === item.url ||
      pathname.startsWith(item.url + "/"),
  }))

  const navSettingWithActive = navSetting.map((item) => ({
    ...item,
    isActive: pathname.startsWith(item.url),
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Image
          src={logo}
          alt="logo"
          width={136}
          height={56}
          priority
          className="mx-2 object-contain"
        />
      </SidebarHeader>

      <div className="px-3 py-2.5">
        <hr className="border-[#303547]" />
      </div>

      <SidebarContent>
        <NavMain items={navMainWithActive} />
      </SidebarContent>

      <SidebarFooter>
        <NavMain items={navSettingWithActive} />
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
