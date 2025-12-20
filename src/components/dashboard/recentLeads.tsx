import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";


export default function RecentLeads() {
  const { recentLeads } = useAppSelector((state: RootState) => state.dashboard);

  return (
    <section className="h-full">
      <div className="h-full rounded-2xl border bg-white px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold ">Recent Leads</h3>

          <div className="flex items-center gap-4  font-medium text-blue-600">
            <button>Export Data</button>
            <button>View All</button>
          </div>
        </div>

        <div className="mt-4">
          {recentLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 w-50">
                <div className="overflow-hidden flex items-center justify-center min-h-9 min-w-9 rounded-full bg-gray-200">
                  {lead?.profileImage ? (
                    <img src={lead.profileImage!} alt="img" className="h-9 w-9" />
                  ) : (
                    <span className="h-9 w-9 flex items-center justify-center font-bold text-lg text-[#FF765E]">
                      {lead?.name[0]}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {lead.name}
                  </p>
                  <p className=" text-gray-500">{lead.email}</p>
                </div>
              </div>

              <div className="hidden md:block text-sm text-gray-600">
                {lead.phone}
              </div>

              <div className="hidden lg:block text-sm font-medium text-gray-900">
                {lead.projectName}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">
                  {lead.amount}
                </span>

                <button className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-200">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-gray-500"
                    fill="currentColor"
                  >
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
  );
}
