import {
  ChevronLeft,
  ChevronRight,
  Dot,
  EllipsisVerticalIcon,
} from "lucide-react";
import { HeaderLeadCRM } from "./leadCrm";

type Lead = {
  userName: string;
  email: string;
  phone: string;
  date: string;
  projectId: string;
  status: "Active" | "Inactive";
};

const headers: HeaderLeadCRM[] = [
  { key: "userName", label: "USER NAME", minW: "min-w-[200px]" },
  { key: "email", label: "EMAIL", minW: "min-w-[160px]" },
  { key: "phone", label: "PHONE", minW: "min-w-[140px]" },
  { key: "date", label: "DATE & TIME", minW: "min-w-[160px]" },
  { key: "projectId", label: "PROJECT ID", minW: "min-w-[140px]" },
  { key: "status", label: "STATUS", minW: "min-w-[120px]" },
  { key: "actions", label: "ACTIONS", minW: "min-w-[100px]" },
];

const leads: Lead[] = [
  {
    userName: "Mohal Hasm",
    email: "mohal@gmail.com",
    phone: "+91 98765 43210",
    date: "12 Sep 2025, 10:30 AM",
    projectId: "PRJ-001",
    status: "Active",
  },
  {
    userName: "Rogue Dev",
    email: "rogue@gmail.com",
    phone: "+91 91234 56789",
    date: "13 Sep 2025, 02:15 PM",
    projectId: "PRJ-002",
    status: "Inactive",
  },
  {
    userName: "Nomad Singh",
    email: "nomad@gmail.com",
    phone: "+91 99887 66554",
    date: "14 Sep 2025, 09:00 AM",
    projectId: "PRJ-003",
    status: "Active",
  },
];

export default function LeadCRMTable() {
  return (
    <div className="w-full bg-white">
      <div className="w-full rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f3f6ff] text-gray-700">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    className={`px-4 py-3  text-sm font-bold ${header.minW} ${
                      header?.key == "status" || header?.key == "actions"
                        ? " text-center"
                        : "text-left"
                    }`}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {leads.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                      <span className="font-semibold">
                        {row.userName}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-semibold">{row.email}</td>

                  <td className="px-4 py-3 font-semibold">{row.phone}</td>

                  <td className="px-4 py-3 font-semibold">{row.date}</td>

                  <td className="px-4 py-3 font-semibold">{row.projectId}</td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <span
                        className={`flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                          row.status === "Active"
                            ? "bg-[#BCE288] text-[#2E6B2B]"
                            : "bg-[#FAA2A4] text-[#B44445]"
                        }`}
                      >
                        <Dot />
                        {row.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center">
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

        <div className="flex items-center justify-center gap-2 border-t p-4 text-sm text-gray-600">
          <button className="flex items-center gap-2 rounded-full border px-3 py-1">
            <ChevronLeft size={16} /> Back
          </button>

          <button className="h-7 w-7 rounded-full bg-gray-100">1</button>
          <button className="h-7 w-7 rounded-full bg-black text-white">
            2
          </button>
          <button className="h-7 w-7 rounded-full bg-gray-100">3</button>

          <button className="flex items-center gap-2 rounded-full border px-3 py-1">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
