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



export default function DashboardKPI() {
  const { overview } = useAppSelector((state: RootState) => state.dashboard);
  const dispatch = useAppDispatch();

  const [dateRange, setDateRange] = useState<
    "past_24_hours" | "past_7_days" | "past_30_days"
  >("past_24_hours");

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
    <section className="block md:hidden bg-[#F5F5FA] px-3 pt-3 space-y-4">

      {/* HEADER ROW */}
      <div className="flex items-center gap-2 w-full">
        <div className="w-4/4">
          <select
            value={dateRange}
            onChange={(e) =>
              setDateRange(e.target.value as typeof dateRange)
            }
            className="w-full text-[13px] font-semibold border border-white rounded-lg px-3 py-3 bg-white"
          >
            <option value="past_24_hours">Past 24 Hours</option>
            <option value="past_7_days">Past 7 Days</option>
            <option value="past_30_days">Past 30 Days</option>
          </select>
        </div>
        <div className="w-1/8 flex justify-end">
          <button className="h-9 w-9 flex items-center justify-center rounded-full bg-white border">
            <img
              src={notification.src}
              alt="notification"
              width={16}
              height={16}
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

  </>

}
