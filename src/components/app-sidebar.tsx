"use client"

import * as React from "react"
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

import logo from "@/assets/logo.png"
import Image from "next/image"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: SquareTerminal,
    isActive: true,
  },
  {
    title: "Properties",
    url: "/properties",
    icon: Bot,
  },
  {
    title: "Developers",
    url: "/developers",
    icon: BookOpen,
  },
  {
    title: "Lead / CRM",
    url: "/lead-crm",
    icon: Settings2,
  },
  {
    title: "Blogs",
    url: "/blogs",
    icon: FileText,
  },
]

const navSetting = [
  {
    title: "Setting",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { name, email, profileImage } = useAppSelector((state) => state.auth);

  // Create user object from Redux state
  const user = {
    name: name || "",
    email: email || "",
    profileImage: profileImage || null,
  };

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
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavMain items={navSetting}/>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
