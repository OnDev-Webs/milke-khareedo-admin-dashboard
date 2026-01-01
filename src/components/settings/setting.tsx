"use client";
import { User, Users } from "lucide-react";
import SettingsHeader from "./settingsBannner";
import ProfileSettings from "./profile-setting/profileSetting";
import UserAndRoles from "./user-roles/userAndRoles";
import AccessControl from "./access-control/accessControl";
import { useState } from "react";
import acSvg from "@/assets/notification-status.svg";
import UserAndRolesSheet from "./user-roles/userRoleSheet";

function ACSVG() {
  return <img src={acSvg.src} alt="acces" className="" />;
}

export default function Settings() {
  const settingTab = [
    {
      id: 1,
      title: "Profile Setting",
      isActive: true,
      icon: <User />,
      component: <ProfileSettings />,
    },
    {
      id: 2,
      title: "Access Control",
      isActive: true,
      icon: <Users />,
      component: <AccessControl />,
    },
    {
      id: 3,
      title: "User & Roles",
      isActive: true,
      icon: <ACSVG />,
      component: <UserAndRoles />,
    },
  ];

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
                className={`relative cursor-pointer  flex items-center gap-2 p-4  text-sm font-normal 
                    ${isActive
                    ? "bg-black rounded-lg text-white after:absolute after:right-2 after:w-0.5 after:h-5 after:bg-white after:rounded-xl"
                    : "text-[#7B7B7B] border-transparent hover:bg-[#F4F8FF]"
                  }
                `}
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  {tab.icon}
                </span>
                {tab.title}
              </button>
            );
          })}
        </div>

        <div className="p-4 w-full md:w-5/6">{currentTab?.component}</div>
      </div>
      
    </div>
  );
}
