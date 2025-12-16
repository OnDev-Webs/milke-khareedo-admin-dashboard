import {
  ChevronLeft,
  ChevronRight,
  Dot,
  EllipsisVerticalIcon,
} from "lucide-react";

type Developer = {
  name: string;
  projectCount: string;
  city: string;
  status: "Active" | "Inactive";
};

const MAX_COUNT = 10;

const TABLE_HEADERS = [
  { key: "name", label: "Developer Name" },
  { key: "projectCount", label: "No of Projects" },
  { key: "city", label: "City" },
  // { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
] as const;

const developers: Developer[] = [
  { name: "Sisara Dev", projectCount: "00", city: "Rajkot", status: "Active" },
  {
    name: "Godrej Properties",
    projectCount: "02",
    city: "Rajkot",
    status: "Active",
  },
  {
    name: "Brigade Group",
    projectCount: "03",
    city: "Mavdi",
    status: "Inactive",
  },
  { name: "DLF", projectCount: "00", city: "Navagam", status: "Active" },
  { name: "Lodha Group", projectCount: "05", city: "Surat", status: "Active" },
];

export default function DevelopersTable() {
  return (
    <div className="w-full bg-white">
      <div className="w-full rounded-xl border bg-white overflow-x-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* TABLE HEADER */}
            <thead className="bg-[#f3f6ff] text-left text-gray-700">
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header.key}
                    className={`px-4 py-3 text-sm font-bold ${
                      header.key == "actions" ? "text-center" : ""
                    }`}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y">
              {developers.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {/* NAME */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                      <span className="font-semibold text-gray-800">
                       <div> {row.name}</div>
                      </span>
                    </div>
                  </td>

                  {/* COUNT */}
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-semibold text-gray-700">
                        {row?.projectCount ? row.projectCount : "-"}
                      </span>
                    </div>
                  </td>

                  {/* CITY */}
                  <td className="px-4 py-3 font-medium text-gray-600">
                    <div>{row.city}</div>
                  </td>

                  <td className=" px-4 py-3">
                    <div className="flex items-center justify-center">
                      <button className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                        <EllipsisVerticalIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-2 border-t p-4 text-sm text-gray-600">
          <button className="flex items-center gap-2 rounded-full border px-3 py-1">
            <ChevronLeft size={16} /> Back
          </button>

          {[1, 2, "...", 4, 5].map((page, i) => (
            <button
              key={i}
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
                page === 2 ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {page === "..." ? (
                <EllipsisVerticalIcon size={16} className="rotate-90" />
              ) : (
                page
              )}
            </button>
          ))}

          <button className="flex items-center gap-2 rounded-full border px-3 py-1">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
