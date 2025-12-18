import cardImg from "@/assets/KPIImg.svg";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import Image from "next/image";
import totaldeveloperImg from "@/assets/totaldeveloper.png";
import totalLeadImg from "@/assets/totalLeads.png";
import totalbooking from "@/assets/totalbooking.png";
import totalLiveProjectImg from "@/assets/liveproject.png";



export default function DashboardKPI() {
  const { overview } = useAppSelector((state: RootState) => state.dashboard);


  return (
    <section className="w-full">
      <div className="mx-auto rounded-2xl bg-white p-6 border border-gray-200">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Dashboard</h3>

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
  );
}
