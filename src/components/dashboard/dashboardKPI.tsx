type Stat = {
  id: string;
  label: string;
  value: string | number;
  avatarCount?: number;
};

const stat: Stat[] = [
  { id: "1", label: "Total Developers", value: "00" },
  { id: "2", label: "Total Projects", value: "00" },
  { id: "3", label: "Live Projects", value: "00" },
  { id: "4", label: "Total Leads", value: "00" },
];

export default function DashboardKPI({ stats = stat }: { stats?: Stat[] }) {
  return (
    <section className="w-full">
      <div className="mx-auto rounded-2xl bg-white p-6 border border-gray-200">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Dashboard</h3>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#f7f5ff] p-4"
              aria-labelledby={`stat-${s.id}-label`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="h-44 w-full rounded-lg p-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-full w-full text-[#d7d3eb]"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M21 19l-5.5-7-3.5 4.5-2.5-3L3 19z" />
                  </svg>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p
                    id={`stat-${s.id}-label`}
                    className="mb-2 text-base font-medium text-gray-600"
                  >
                    {s.label}
                  </p>
                  <div className="text-xl font-semibold text-gray-900">
                    {s.value}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}