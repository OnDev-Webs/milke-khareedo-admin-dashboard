"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, useSidebar, } from "@/components/ui/sidebar"
import { useAppSelector } from "@/lib/store/hooks"
import Image from "next/image"
import logo from "@/assets/logo.svg"
import sidebarLogo from "@/assets/sidebarLogo.svg";
import clsx from "clsx"
import dashboard from "@/assets/dashboard.svg"
import property from "@/assets/property.svg"
import developer from "@/assets/developer.svg"
import leadCRM from "@/assets/leadCRM.svg"
import blog from "@/assets/blog.svg"
import setting from "@/assets/setting.svg"
import CRMDashboard from "@/assets/crmDashboard.svg";
import CRMLead from "@/assets/crmLead.svg";
import CRMSetting from "@/assets/crmSetting.svg";
import { RootState } from "@/lib/store/store"
import { PERMISSIONS } from "@/lib/permissions/permissionKeys"
import { hasPermission } from "@/lib/permissions/hasPermission"

function SidebarLogo() {
  const { state } = useSidebar()

  return (
    <div className="flex items-center justify-center h-14">
      {state === "expanded" ? (
        <Image
          src={logo}
          alt="logo"
          width={136}
          height={56}
          priority
          className="-ms-8 mt-2 object-contain"
        />
      ) : (
        <Image
          src={sidebarLogo}
          alt="logo icon"
          width={36}
          height={36}
          priority
          className="object-contain"
        />
      )}
    </div>
  )
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const isSuperAdmin = useAppSelector(
    (state: RootState) => state.auth.name === "Super Admin"
  );

  const { name, email, profileImage } = useAppSelector((state) => state.auth);

  const canViewProperty = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.PROPERTY.VIEW)
  );

  const canViewDeveloper = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.DEVELOPER.VIEW)
  );

  const canViewCRM = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.CRM.VIEW)
  );

  const canViewBlogs = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.BLOGS.VIEW)
  );

  const canViewTeam = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.TEAM.VIEW)
  );


  const user = {
    name: name || "",
    email: email || "",
    profileImage: profileImage || null,
  }

  const navMainWithActive = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <Image src={dashboard} alt="Dashboard" width={18} height={18} />,
      allow: isSuperAdmin,
    },
    {
      title: "Properties",
      url: "/properties",
      icon: <Image src={property} alt="Properties" width={18} height={18} />,
      allow: canViewProperty,
    },
    {
      title: "Developers",
      url: "/developers",
      icon: <Image src={developer} alt="Developers" width={18} height={18} />,
      allow: canViewDeveloper,
    },
    {
      title: "Lead / CRM",
      url: "/lead-crm",
      icon: <Image src={leadCRM} alt="Lead CRM" width={18} height={18} />,
      allow: canViewCRM,
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: <Image src={blog} alt="Blogs" width={18} height={18} />,
      allow: canViewBlogs,
    },
  ]
    .filter(item => item.allow)
    .map(item => ({
      ...item,
      isActive:
        pathname === item.url ||
        pathname.startsWith(item.url + "/"),
    }));

  const navSetting = [
    {
      title: "Setting",
      url: "/settings",
      icon: <Image src={setting} alt="Setting" width={18} height={18} />,
      allow: canViewTeam || isSuperAdmin,
    },
  ].filter(item => item.allow);

  const navSettingWithActive = navSetting.map((item) => ({
    ...item,
    isActive: pathname.startsWith(item.url),
  }))

  const mobileNavItems = [
    ...(isSuperAdmin
      ? [{ title: "Dashboard", url: "/dashboard", icon: CRMDashboard, noInvert: true }]
      : []),

    ...(canViewCRM
      ? [{ title: "Lead / CRM", url: "/lead-crm", icon: CRMLead }]
      : []),

    ...(canViewTeam || isSuperAdmin
      ? [{ title: "Setting", url: "/settings", icon: CRMSetting }]
      : []),
  ];


  return (
    <>
      <Sidebar
        collapsible="icon"
        className="hidden lg:flex"
        {...props}>
        <SidebarHeader>
          <SidebarLogo />
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
            const isActive = pathname === item.url || pathname.startsWith(item.url + "/")

            return (
              <button
                key={item.title}
                onClick={() => router.push(item.url)}
                className="flex-1 flex flex-col items-center justify-center gap-1 text-[11px]">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={20}
                  height={20}
                  className={clsx(
                    "object-contain transition",
                    item.noInvert
                      ? isActive
                        ? "opacity-100 scale-110"
                        : "opacity-50"
                      : isActive
                        ? "invert-0 brightness-0 opacity-100 scale-110"
                        : "invert opacity-50"
                  )}
                />
                <span className={isActive ? "text-black" : "text-gray-400"}>
                  {item.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
