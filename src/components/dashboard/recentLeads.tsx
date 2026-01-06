import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { useState } from "react";
import more from "@/assets/more.png";

type FollowUpItem = {
  _id: string;
  clientName: string;
  phoneNumber: string;
  profileImage?: string | null;
  projectName: string;
  location: string;
  date: string;
  dueTime: string;
  source: string;
  status: "visited" | "follow_up" | "pending" | "not_visited";
  createdAt: string;
  updatedAt: string;
};


export default function RecentLeads() {
  const { recentLeads } = useAppSelector((state: RootState) => state.dashboard);
  const { crmDashboardData } = useAppSelector(
    (state: RootState) => state.leadcrm
  );

  const [followUpFilter, setFollowUpFilter] = useState<
    "today" | "yesterday" | "month"
  >("today");

  const followUps: FollowUpItem[] =
    crmDashboardData?.data?.todaysFollowUps || [];

  const filteredFollowUps = followUps.filter((item: FollowUpItem) => {
    if (followUpFilter === "today") return true;

    const createdAt = new Date(item.createdAt);
    const now = new Date();

    if (followUpFilter === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      return createdAt.toDateString() === yesterday.toDateString();
    }

    if (followUpFilter === "month") {
      return (
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });

  const options = [
    { value: "today", label: `Today’s Follow Ups (${filteredFollowUps.length})` },
    { value: "yesterday", label: `Yesterday’s Follow Ups (${filteredFollowUps.length})` },
    { value: "month", label: `This Month’s Follow Ups (${filteredFollowUps.length})` },
  ];

  const [open, setOpen] = useState(false);


  return <>
    <section className="h-full hidden md:block">
      <div className="h-full rounded-2xl border bg-white px-3 py-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[18px] text-[#000000] font-bold ">Recent Leads</h3>

          <div className="flex items-center gap-4 font-medium text-[17px] text-[#3A59A6]">
            <button>View All</button>
          </div>
        </div>

        <div className="mt-1">
          {recentLeads.map((lead) => (
            <div
              key={lead.id}
              className="grid grid-cols-[2.5fr_1.5fr_2fr_1fr_auto] items-center gap-2 rounded-lg px-1 py-2 hover:bg-gray-50 border-b border-[#E8E8E8] last:border-b-0">
              {/* NAME */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                  {lead?.profileImage ? (
                    <img src={lead.profileImage} className="h-9 w-9 rounded-full" />
                  ) : (
                    <span className="font-bold text-lg text-[#FF765E]">
                      {lead?.name[0]}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[14px] font-semibold truncate text-[#2B2B25]">
                    {lead.name}
                  </p>
                  <p className="text-[13px] text-[#929292] truncate">
                    {lead.dateTime}
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="text-[14px] text-[#929292] truncate">
                {lead.phone}
              </div>

              {/* PROJECT ID */}
              <div className="text-[14px] font-semibold text-[#2B2B25] truncate">
                {lead.projectId}
              </div>

              {/* AMOUNT */}
              <div className="text-[14px] font-semibold text-right text-[#000000]">
                {lead.amount}
              </div>

              {/* MENU */}
              <div className="flex justify-end">
                <button className="h-7 w-7 rounded-full bg-[#EEF0FB] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ================= MOBILE VIEW ================= */}
    <section className="block md:hidden bg-[#F5F5FA] px-1 pb-8 space-y-3">

      {/* FILTER HEADER */}
      <div className="relative w-full">
        {/* LEFT CALENDAR ICON */}
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center z-10">
          <svg className="h-4 w-4 text-[#000000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full bg-[#E6EFFF] text-xs font-semibold text-[#000000]
               pl-10 pr-10 py-2.5 rounded-lg border border-[#D6DDFF]
               flex items-center justify-between"
        >
          <span className="truncate">
            {options.find(o => o.value === followUpFilter)?.label}
          </span>

          {/* RIGHT ARROW */}
          <svg className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-lg shadow z-50">
            {options.map(opt => (
              <div
                key={opt.value}
                onClick={() => {
                  setFollowUpFilter(opt.value as any);
                  setOpen(false);
                }}
                className="px-4 py-2 text-xs text-[#2F3A8F] hover:bg-[#E6EFFF] cursor-pointer"
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOLLOW UP LIST */}
      {filteredFollowUps.map((lead: any) => (
        <div
          key={lead._id}
          className="bg-white rounded-xl p-4 shadow border border-white"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[15px] font-bold text-black">
                {lead.clientName}
              </p>
              <p className="text-[11px] text-[#929292] mt-1">
                {lead.date}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] px-2 py-1 rounded-full font-semibold
                  ${lead.status === "visited"
                    ? "bg-green-100 text-green-700"
                    : lead.status === "follow_up"
                      ? "bg-blue-100 text-blue-700"
                      : lead.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
              >
                {lead.status.replace("_", " ").toUpperCase()}
              </span>

              <button className="h-8 w-8 rounded-full bg-[#EEF0FB] flex items-center justify-center">
                <img
                  src={more.src}
                  alt="notification"
                  width={14}
                  height={14}
                />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-3 text-sm">
            <div>
              <p className="text-[12px] text-[#929292]">Phone</p>
              <p className="text-[13px] text-black">
                {lead.phoneNumber}
              </p>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-[12px] text-[#929292]">Project</p>
                <p className="text-[13px] text-black">
                  {lead.projectName}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[12px] text-[#929292]">Source</p>
                <p className="text-[13px] text-black">
                  {lead.source}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>

  </>
}
