"use client";
import { ChevronDown, ChevronDownCircle, ChevronRight } from "lucide-react";
import { useState } from "react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  project: string;
  price: string;
};

const data: Lead[] = [
  {
    id: "1",
    name: "Hello, John Deo!",
    email: "Email address",
    phone: "+91 695 265 2651",
    date: "12 dec 2025",
    project: "Project name",
    price: "₹ 20.00 Cr",
  },
  {
    id: "2",
    name: "Hello, John Deo!",
    email: "Email address",
    phone: "+91 695 265 2651",
    date: "12 dec 2025",
    project: "Project name",
    price: "₹ 20.00 Cr",
  },
  {
    id: "3",
    name: "Hello, John Deo!",
    email: "Email address",
    phone: "+91 695 265 2651",
    date: "12 dec 2025",
    project: "Project name",
    price: "₹ 20.00 Cr",
  },
  {
    id: "4",
    name: "Hello, John Deo!",
    email: "Email address",
    phone: "+91 695 265 2651",
    date: "12 dec 2025",
    project: "Project name",
    price: "₹ 20.00 Cr",
  },
];

const arr = [
  {
    id: 1,
    title: "Today",
  },
  {
    id: 2,
    title: "Yesterday",
  },
];

export default function Leads() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState("Select");
  const handleClose = () => setIsOpen(false);
  return (
    <section>
      <div className="rounded-2xl border bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-[#474747]">Leads</h3>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="relative w-32">
              <div
                onClick={() => setIsOpen((pre) => !pre)}
                className="border  rounded-md px-4 py-1 flex items-center justify-between"
              >
                {current}
                <ChevronDown
                  className={`size-4 transition-transform ease-in-out ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {isOpen && (
                <div className="absolute w-full top-8 border px-4 space-y-1 rounded-md bg-[#F9F9F9]">
                  {arr?.map((row) => (
                    <div
                      onClick={() => {
                        setCurrent(row?.title);
                        handleClose();
                      }}
                      className="py-1"
                    >
                      {row?.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="hover:underline">View All</button>
            <button className="hover:underline">Export Data</button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <tbody>
              {data.map((lead) => (
                <tr key={lead.id} className=" ">
                  <td className=" ">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 text-gray-500"
                          fill="currentColor"
                        >
                          <path d="M12 12a4 4 0 10-4-4 4 4 0 004 4zm0 2c-3.33 0-6 1.34-6 3v1h12v-1c0-1.66-2.67-3-6-3z" />
                        </svg>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {lead.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {lead.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 text-sm text-gray-700">{lead.phone}</td>
                  <td className="px-4 text-sm text-gray-700">{lead.date}</td>

                  <td className="px-4 text-sm font-medium text-gray-800">
                    {lead.project}
                  </td>
                  <td className="px-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-900">
                        {lead.price}
                      </div>

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 text-gray-500"
                          fill="currentColor"
                        >
                          <path d="M21 19l-5.5-7-3.5 4.5-2.5-3L3 19z" />
                        </svg>
                      </div>
                    </div>
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
