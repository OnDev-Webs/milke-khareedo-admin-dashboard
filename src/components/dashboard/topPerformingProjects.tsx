export default function TopPerformingProjects() {
  type Project = {
    id: string;
    name: string;
    newLeads: number;
  };
  const cardData: Project[] = [
    { id: "1", name: "Project Name", newLeads: 50 },
    { id: "2", name: "Project Name", newLeads: 20 },
    { id: "3", name: "Project Name", newLeads: 10 },
  ];
  return (
    <div className="border rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between mb-6.5">
        <h3 className="text-xl font-bold text-[#474747]">
          Top Performing Projects
        </h3>
        <div className="text-sm text-gray-600">
          <button className="hover:underline">View All</button>
        </div>
      </div>

      <div className="overflow-x-auto md:overflow-visible">
        <div className="flex gap-4 px-2 overflow-x-auto ">
          {cardData.map((proj) => (
            <div
              key={proj.id}
              className="min-w-52  rounded-xl bg-[#f7f5ff] p-4 shadow-sm "
            >
              <div className="rounded-lg p-3">
                <div className="h-28 w-full rounded-md flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-14 w-14 text-[#d7d3eb]"
                    fill="currentColor"
                  >
                    <path d="M21 19l-5.5-7-3.5 4.5-2.5-3L3 19z" />
                  </svg>
                </div>
              </div>

              <div className="mt-3 text-sm flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-800">{proj.name}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {proj.newLeads} New Leads
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
