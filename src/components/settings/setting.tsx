"use client";
import SettingsHeader from "./settingsBannner";
import ProfileSettings from "./profile-setting/profileSetting";
import UserAndRoles from "./user-roles/userAndRoles";
import AccessControl from "./access-control/accessControl";
import { useState } from "react";
import acSvg from "@/assets/notification-status.svg";
import Image from "next/image";
import user from "@/assets/user.svg";
import userRole from "@/assets/userRole.svg";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";

function ACSVG({ active }: { active: boolean }) {
  return (
    <img
      src={acSvg.src}
      alt="access"
      className={`w-4 h-4 transition ${active ? "invert brightness-200" : "opacity-70"
        }`}
    />
  );
}

function TabIcon({
  src,
  active,
}: {
  src: string;
  active: boolean;
}) {
  return (
    <Image
      src={src}
      alt="tab-icon"
      width={16}
      height={16}
      className={`transition ${active
          ? "brightness-0 invert"
          : "brightness-0"
        }`}
    />
  );
}

export default function Settings() {
  const roleName = useAppSelector((state: RootState) => state.auth.role?.name);

  const settingTab = [
    {
      id: 1,
      title: "Profile Setting",
      icon: (active: boolean) => (
        <TabIcon src={user.src} active={active} />
      ),
      component: <ProfileSettings />,
      allow: true,
    },
    {
      id: 2,
      title: "Access Control",
      icon: (active: boolean) => <ACSVG active={active} />,
      component: <AccessControl />,
      allow: roleName === "Super Admin", 
    },
    {
      id: 3,
      title: "User & Roles",
      icon: (active: boolean) => (
        <TabIcon src={userRole.src} active={active} />
      ),
      component: <UserAndRoles />,
      allow: true,
    },
  ].filter(tab => tab.allow); 

  const [activeTabId, setActiveTabId] = useState<number>(1);

  const currentTab = settingTab.find((item) => item.id === activeTabId);

  return (
    <div className="h-full overflow-hidden">
      <div className="hidden md:block">
        <SettingsHeader />
      </div>

      <div className="flex md:border h-full ">
        <div className="hidden md:flex md:w-1/6 flex-col bg-[#F3F6FF] p-4">
          {settingTab.map((tab) => {
            const isActive = tab.id === activeTabId;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`relative flex items-center gap-2 p-4 text-sm font-normal
                  ${isActive
                    ? "bg-black rounded-lg text-white after:absolute after:right-2 after:w-0.5 after:h-5 after:bg-white after:rounded-xl"
                    : "text-black hover:bg-[#F4F8FF]"
                  }`}

              >
                <span className="w-4 h-4 flex items-center justify-center">
                  {typeof tab.icon === "function" ? tab.icon(isActive) : tab.icon}
                </span>
                <span className="whitespace-nowrap">{tab.title}</span>
              </button>
            );
          })}
        </div>
        <div className="p-4 w-full md:w-5/6">{currentTab?.component}</div>
      </div>

    </div>
  );
}
