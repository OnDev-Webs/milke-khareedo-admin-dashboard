"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Settings2,
  SquareTerminal,
  FileText,
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

import logo from "@/assets/logo.png"
import img from "@/assets/loginImg.jpg"
import Image from "next/image"

const data = {
  user: {
    name: "Yash",
    email: "m@example.com",
    avatar: img,
  },
  navMain: [
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
