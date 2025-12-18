"use client";

type Performance = {
  id: string;
  name: string;
  totalLead: number;
  contacted: string;
  responseTime: string;
};

const data: Performance[] = [
  {
    id: "1",
    name: "John Deo",
    totalLead: 26,
    contacted: "80%",
    responseTime: "6H",
  },
  {
    id: "2",
    name: "Simran Jose",
    totalLead: 26,
    contacted: "50%",
    responseTime: "6H",
  },
  {
    id: "3",
    name: "Dusyant Singh",
    totalLead: 26,
    contacted: "80%",
    responseTime: "6H",
  },
  {
    id: "4",
    name: "Chirag Trada",
    totalLead: 26,
    contacted: "80%",
    responseTime: "6H",
  },
];

export default function SalesTeamPerformance() {
  return (
    <section>
      <div className="rounded-2xl border bg-white p-5">
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          Sales Team Performance
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="rounded-lg bg-[#F4F6FF] text-left font-medium text-gray-600">
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3 text-center">Total Lead</th>
                <th className="px-4 py-3 text-center">
                  Lead Contacted
                </th>
                <th className="px-4 py-3 text-center">
                  Response Time
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b last:border-none"
                >
                  <td className="px-4 py-1">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                      <span className="font-medium text-gray-900">
                        {row.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center text-gray-800">
                    {row.totalLead}
                  </td>

                  <td className="px-4 py-3 text-center font-semibold text-red-500">
                    {row.contacted}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-800">
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