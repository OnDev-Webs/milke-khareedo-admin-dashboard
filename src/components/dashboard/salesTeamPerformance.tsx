"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";

export default function SalesTeamPerformance() {
  const { salesTeamPerformance } = useAppSelector((state: RootState) => state.dashboard);

  return (
    <section>
      <div className="rounded-2xl border bg-white py-2 px-3">
        <h3 className="mb-2 text-[18px] font-bold">
          Sales Team Performance
        </h3>

        <div className="overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="block">
              <tr className="table w-full table-fixed rounded-lg bg-[#F4F6FF] text-left font-medium text-gray-600">
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3 text-center">Total Lead</th>
                <th className="px-4 py-3 text-center">Lead Contacted</th>
                <th className="px-4 py-3 text-center">Response Time</th>
              </tr>
            </thead>

            <tbody className="block max-h-[220px] overflow-y-auto hide-scrollbar">
              {salesTeamPerformance.map((row) => (
                <tr
                  key={row.userId}
                  className="table w-full table-fixed border-b last:border-none">
                  <td className="px-4 py-1">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#F4F6FF] flex items-center justify-center overflow-hidden">
                        {row.profileImage ? (
                          <img src={row.profileImage} alt="img" />
                        ) : (
                          <span className="font-bold text-lg text-[#FF765E]">
                            {row.userName[0]}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-gray-900 truncate">
                        {row.userName}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-2 text-center text-gray-800">
                    {row.totalLead}
                  </td>

                  <td className="px-4 py-2 text-center font-semibold text-red-500">
                    {row.leadContacted}
                  </td>

                  <td className="px-4 py-2 text-center text-gray-800">
                    {row.responseTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
