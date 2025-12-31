"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
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
import clsx from "clsx"

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
  const router = useRouter()
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

  const mobileNavItems = [
    { title: "Dashboard", url: "/dashboard", icon: SquareTerminal },
    { title: "Lead / CRM", url: "/lead-crm", icon: Settings2 },
    { title: "Setting", url: "/settings", icon: Settings },
  ]

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="hidden lg:flex"
        {...props}
      >
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

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t overflow-x-hidden">
        <div className="flex items-center h-14">
          {mobileNavItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.url ||
              pathname.startsWith(item.url + "/")

            return (
              <button
                key={item.title}
                onClick={() => router.push(item.url)}
                className={clsx(
                  "flex-1 flex flex-col items-center justify-center text-xs gap-1",
                  isActive ? "text-black" : "text-gray-400"
                )}
              >
                <Icon size={20} />
                {item.title}
              </button>
            )
          })}
        </div>
      </div>

    </>
  )
}
