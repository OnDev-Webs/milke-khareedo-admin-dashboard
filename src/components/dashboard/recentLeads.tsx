type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  price: string;
};

const data: Lead[] = [
  {
    id: "1",
    name: "John Deo",
    email: "johndeo@gmail.com",
    phone: "+91 695 265 2651",
    project: "Sisara Projects",
    price: "₹ 20.00 Cr",
  },
  {
    id: "2",
    name: "John Deo",
    email: "johndeo@gmail.com",
    phone: "+91 695 265 2651",
    project: "Sisara Projects",
    price: "₹ 20.00 Cr",
  },
  {
    id: "3",
    name: "John Deo",
    email: "johndeo@gmail.com",
    phone: "+91 695 265 2651",
    project: "Sisara Projects",
    price: "₹ 20.00 Cr",
  },
  {
    id: "4",
    name: "John Deo",
    email: "johndeo@gmail.com",
    phone: "+91 695 265 2651",
    project: "Sisara Projects",
    price: "₹ 20.00 Cr",
  },
];

export default function RecentLeads() {
  return (
    <section className="h-full">
      <div className="h-full rounded-2xl border bg-white px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-600">Recent Leads</h3>

          <div className="flex items-center gap-4  font-medium text-blue-600">
            <button>Export Data</button>
            <button>View All</button>
          </div>
        </div>

        <div className="mt-4">
          {data.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gray-200" />

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
                {lead.project}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">
                  {lead.price}
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