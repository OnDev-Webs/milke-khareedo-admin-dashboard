import cardImg from "@/assets/KPIImg.svg";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import Image from "next/image";
import totaldeveloperImg from "@/assets/totaldeveloper.png";
import totalLeadImg from "@/assets/totalLeads.png";
import totalbooking from "@/assets/totalbooking.png";
import totalLiveProjectImg from "@/assets/liveproject.png";
import { useEffect, useState } from "react";
import { fetchCRMDashboard } from "@/lib/features/lead-crm/leadcrmApi";
import notification from "@/assets/notification.png"
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";


const DATE_RANGE_OPTIONS = [
  { label: "Past 24 Hours", value: "past_24_hours" },
  { label: "Past 7 Days", value: "past_7_days" },
  { label: "Past 30 Days", value: "past_30_days" },
];

export default function DashboardKPI() {
  const { overview } = useAppSelector((state: RootState) => state.dashboard);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [dateRange, setDateRange] = useState<
    "past_24_hours" | "past_7_days" | "past_30_days"
  >("past_24_hours");

  const [tempDateRange, setTempDateRange] = useState<
    "past_24_hours" | "past_7_days" | "past_30_days"
  >(dateRange);

  const [dateRangeSheetOpen, setDateRangeSheetOpen] = useState(false);

  useEffect(() => {
    if (dateRangeSheetOpen) {
      setTempDateRange(dateRange);
    }
  }, [dateRangeSheetOpen, dateRange]);


  const { crmDashboardLoading, crmDashboardData } = useAppSelector(
    (state: RootState) => state.leadcrm
  );

  const kpis = crmDashboardData?.data?.kpis;

  useEffect(() => {
    dispatch(
      fetchCRMDashboard({
        dateRange,
        page: 1,
        limit: 10,
      })
    );
  }, [dateRange, dispatch]);


  return <>

    <section className="w-full hidden md:block">
      <div className="mx-auto rounded-2xl bg-white p-6 border border-gray-200">
        <h3 className="mb-4 text-xl font-bold">Dashboard</h3>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* cards */}
          <div
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-b from-card via-card to-transparent p-4"
          >
            <div className="mb-4 flex items-start justify-end">
              <div className="h-44 w-48 rounded-lg overflow-hidden">
                <Image
                  src={totaldeveloperImg}
                  alt="totaldeveloperImg"
                  className="h-full w-full object-cover [mask-image:linear-gradient(to_top,transparent,black_40%)] [-webkit-mask-image:linear-gradient(to_top,transparent,black_40%)]"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <div className="text-4xl font-bold text-orange-500">
                  {overview?.totalDevelopers}
                </div>
                <p
                  className="mb-2 text-2xl font-medium text-gray-600"
                >
                  Total Developers
                </p>
              </div>
            </div>
          </div>

          <div
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-b from-card via-card to-transparent p-4"
          >
            <div className="mb-4 flex items-start justify-end">
              <div className="h-44 w-48 rounded-lg overflow-hidden">
                <Image
                  src={totalLiveProjectImg}
                  alt="totalLiveProjectImg"
                  className="h-full w-full object-cover [mask-image:linear-gradient(to_top,transparent,black_40%)] [-webkit-mask-image:linear-gradient(to_top,transparent,black_40%)]"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <div className="text-4xl font-bold text-orange-500">
                  {overview?.liveProjects}
                </div>
                <p
                  className="mb-2 text-2xl font-medium text-gray-600"
                >
                  live Projects
                </p>
              </div>
            </div>
          </div>

          <div
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-b from-card via-card to-transparent p-4"
          >
            <div className="mb-4 flex items-start justify-end">
              <div className="h-44 w-48 rounded-lg overflow-hidden">
                <Image
                  src={totalLeadImg}
                  alt="totalLeadImg"
                  className="h-full w-full object-cover [mask-image:linear-gradient(to_top,transparent,black_40%)] [-webkit-mask-image:linear-gradient(to_top,transparent,black_40%)]"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <div className="text-4xl font-bold text-orange-500">
                  {overview?.totalLeads}
                </div>
                <p
                  className="mb-2 text-2xl font-medium text-gray-600"
                >
                  Total Leads
                </p>
              </div>
            </div>
          </div>


          <div
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-b from-card via-card to-transparent p-4"
          >
            <div className="mb-4 flex items-start justify-end">
              <div className="h-44 w-48 rounded-lg overflow-hidden">
                <Image
                  src={totalbooking}
                  alt="totalbooking"
                  className="h-full w-full object-cover [mask-image:linear-gradient(to_top,transparent,black_40%)] [-webkit-mask-image:linear-gradient(to_top,transparent,black_40%)]"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <div className="text-4xl font-bold text-orange-500">
                  {overview?.totalBookingsThisMonth}
                </div>
                <p
                  className="mb-2 text-2xl font-medium text-gray-600"
                >
                  Total Booking <span className="text-xs">{"(This month)"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ================= MOBILE UI ================= */}
    <section className="block md:hidden bg-[#F5F5FA] px-1 pt-3 space-y-4">

      {/* HEADER ROW */}
      <div className="flex items-center gap-2 w-full">
        <div className="w-full">
          <button
            onClick={() => setDateRangeSheetOpen(true)}
            className="w-full flex items-center justify-between rounded-lg bg-white px-3 py-3 border text-[14px] font-medium"
          >
            <span>
              {dateRange === "past_24_hours" && "Past 24 Hours"}
              {dateRange === "past_7_days" && "Past 7 Days"}
              {dateRange === "past_30_days" && "Past 30 Days"}
            </span>

            {/* DROPDOWN ICON */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="w-1/8 flex justify-end">
          <button onClick={() => router.push("/notification")} className="p-2.5 rounded-full border border-white bg-white">
            <img
              src={notification.src}
              alt="notification"
              width={12}
              height={12}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 text-center shadow">
          <p className="text-[14px] text-black font-bold">Leads Received</p>
          <p className="text-[16px] font-bold text-black">
            {kpis?.leadsReceived ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-xl p-3 text-center shadow">
          <p className="text-[14px] font-bold text-[#BF8009]">Leads Contacted</p>
          <p className="text-[16px] font-bold text-[#BF8009]">
            {kpis?.leadsContacted ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-xl p-3 text-center shadow">
          <p className="text-[14px] font-bold text-[#A83436]">Response Time</p>
          <p className="text-[16px] font-bold text-[#A83436]">
            {kpis?.responseTime ?? "0H"}
          </p>
        </div>
      </div>
    </section>

    <Sheet open={dateRangeSheetOpen} onOpenChange={setDateRangeSheetOpen}>
      <SheetContent side="bottom" className="rounded-t-2xl p-4">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <SheetTitle className="text-[17px] font-bold">
            Date Range Options
          </SheetTitle>

          <button
            onClick={() => setDateRangeSheetOpen(false)}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* OPTIONS */}
        <div className="space-y-2">
          {DATE_RANGE_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => setTempDateRange(option.value as any)}
              className="w-full px-4 py-3 rounded-lg border bg-[#F5F5FA] text-[#3A59A6] text-left text-[16px] font-medium flex items-center justify-between"
            >
              <span>
                {option.label}
              </span>

              {/* CHECK ICON */}
              {tempDateRange === option.value && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#3A59A6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>

          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              setDateRange(tempDateRange);
              setDateRangeSheetOpen(false);
            }}
            className="flex-1 bg-black text-white py-3 rounded-lg font-medium"
          >
            Save
          </button>
        </div>


      </SheetContent>
    </Sheet>

  </>

}
