"use client"

import { type ReactNode } from "react"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import clsx from "clsx"

type NavItem = {
  title: string
  url: string
  icon?: ReactNode
  isActive?: boolean
}

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={item.isActive}
              className={clsx(
                "group bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent",
                "data-[active=true]:bg-transparent data-[state=open]:bg-transparent",
                "text-white hover:text-white active:text-white focus:text-white",
                "data-[active=true]:text-white",
                item.isActive &&
                "relative after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-6 after:w-[3px] after:bg-white after:rounded-l"
              )}
            >
              <Link href={item.url} className="flex items-center gap-3 px-3">
                {item.icon && (
                  <span
                    className={clsx(
                      "h-5 w-5 flex items-center justify-center",
                      "text-white",
                      "group-data-[collapsible=icon]:text-white"
                    )}
                  >
                    {item.icon}
                  </span>
                )}
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
