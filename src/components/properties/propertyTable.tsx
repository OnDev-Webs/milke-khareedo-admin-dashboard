import {
  ChevronLeft,
  ChevronRight,
  Dot,
  EllipsisVerticalIcon,
  ListIcon,
} from "lucide-react";

export default function PropertiesTable() {
  const properties = [
    {
      name: "Sisara Dev",
      developer: "Mohal Hasm",
      city: "Ahamdabad",
      count: "00",
      status: "Active",
    },
    {
      name: "Godrej Properties",
      developer: "Rogue",
      city: "Rajkot",
      count: "02",
      status: "Active",
    },
    {
      name: "Brigade Group",
      developer: "Nomad",
      city: "Mavdi",
      count: "03",
      status: "Inactive",
    },
    {
      name: "DLF",
      developer: "Adrian",
      city: "Navagam",
      count: "00",
      status: "Active",
    },
    {
      name: "Lodha Group",
      developer: "Barrett",
      city: "Surat",
      count: "05",
      status: "Active",
    },
    {
      name: "Avadh Group",
      developer: "Cedric",
      city: "Ahamdabad",
      count: "06",
      status: "Active",
    },
    {
      name: "Avadh Group",
      developer: "Cedric",
      city: "Ahamdabad",
      count: "06",
      status: "Active",
    },
    {
      name: "Avadh Group",
      developer: "Cedric",
      city: "Ahamdabad",
      count: "06",
      status: "Active",
    },
    {
      name: "Avadh Group",
      developer: "Cedric",
      city: "Ahamdabad",
      count: "06",
      status: "Active",
    },
    {
      name: "Avadh Group",
      developer: "Cedric",
      city: "Ahamdabad",
      count: "06",
      status: "Active",
    },
  ];

  const max = 10;
  return (
    <div className="w-full bg-white">
      <div className="w-full rounded-xl border bg-white overflow-x-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f3f6ff] text-left text-gray-700">
              <tr>
                <th className="px-4 py-3 font-bold text-sm">Property Name</th>
                <th className="px-4 py-3 font-bold text-sm">Developer</th>
                <th className="px-4 py-3 font-bold text-sm">City</th>
                <th className="px-4 py-3 font-bold text-sm text-center">Group’s Count</th>
                <th className="px-4 py-3 font-bold text-sm text-center">Status</th>
                <th className="px-4 py-3 font-bold text-sm text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {properties.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="min-h-8 min-w-8 rounded-full bg-gray-200" />
                      <span className="font-semibold text-sm text-gray-800">
                        {row.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-semibold text-sm text-gray-600">
                    {row.developer}
                  </td>

                  <td className=" px-4 py-3 font-semibold text-sm text-gray-600">
                    {row.city}
                  </td>

                  <td className="px-4 py-3 text-gray-400 flex items-center justify-center">
                    <div><span className="font-semibold text-sm text-gray-700">
                      {row.count}
                    </span>{" "}
                    / 10</div>
                  </td>

                  <td className="px-2 py-3">
                    <div className="flex items-center justify-center">
                      <div
                      className={`rounded-full flex  px-2 py-1 font-semibold text-sm ${
                        row.status === "Active"
                          ? "bg-[#BCE288] text-[#2E6B2B]"
                          : "bg-[#FAA2A4] text-[#B44445]"
                      }`}
                    >
                      <Dot /> <span className="pr-3">{row.status}</span>
                    </div>
                    </div>
                  </td>

                  <td className="relative px-4 py-3 mx-auto w-8
                   ">
                    <div className="flex items-center justify-center">
                      <button className="rounded-full bg-gray-100 w-7 h-7 flex items-center justify-center">
                      <EllipsisVerticalIcon size={16} />
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-2 border-t p-4 text-sm text-gray-600">
          <button className=" border rounded-full px-3 py-1 flex items-center justify-center gap-2">
            <ChevronLeft size={16} /> Back
          </button>
          <button className="rounded-full bg-gray-100 w-7 h-7 flex items-center justify-center">
            1
          </button>
          <button className="rounded-full bg-black w-7 h-7 flex items-center justify-center text-white">
            2
          </button>
          <button className="rounded-full bg-gray-100 w-7 h-7 flex items-center justify-center">
             <EllipsisVerticalIcon size={16} className="rotate-90" />
          </button>
          <button className="rounded-full bg-gray-100 w-7 h-7 flex items-center justify-center">
            4
          </button>
          <button className="rounded-full bg-gray-100 w-7 h-7 flex items-center justify-center">
            5
          </button>
          <button className="border rounded-full px-3 py-1 flex items-center justify-center gap-2">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
