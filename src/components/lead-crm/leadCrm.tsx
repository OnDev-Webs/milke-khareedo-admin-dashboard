"use client";
import { useMemo, useState } from "react";
import CustomTableSearchBar from "../custom/searchBar";
import NotFound from "@/app/lead-crm/not-found";
import LeadCRMTable from "./leadCrmTable";
import LeadCRMSheet from "./leadCrmSheet";

interface ILeadCRM {
  id: number;
  userName: string;
  email: string;
  phone: string;
  date: string;
  projectId: string;
  status: string;
}

export type HeaderLeadCRM = {
  key: keyof ILeadCRM | "actions";
  label: string;
  minW: string;
};

type SortState<T> = {
  key: keyof T | null;
  dir: "asc" | "desc" | null;
};

export default function LeadCRM() {
  const initialData: ILeadCRM[] = [
    {
      id: 1,
      userName: "SK Villas",
      status: "active",
      date: "2 june 2025",
      projectId: "2345678",
      email: "extra@gmail.com",
      phone: "1234567890",
    },
  ];

  const [data, setData] = useState<ILeadCRM[]>(initialData);
  const [sort, setSort] = useState<SortState<ILeadCRM>>({
    key: null,
    dir: null,
  });

  const headers: HeaderLeadCRM[] = [
    { key: "userName", label: "USER NAME", minW: "min-w-[200px]" },
    { key: "email", label: "EMAIL", minW: "min-w-[160px]" },
    { key: "phone", label: "PHONE", minW: "min-w-[140px]" },
    { key: "date", label: "DATE & TIME", minW: "min-w-[120px]" },
    { key: "projectId", label: "PROJECT ID", minW: "min-w-[140px]" },
    { key: "status", label: "STATUS", minW: "min-w-[100px]" },
    { key: "actions", label: "ACTIONS", minW: "min-w-[100px]" },
  ];

  const searchKeys = useMemo(
    () =>
      headers
        .filter((column) => column.key !== "actions")
        .map((c) => c.key) as (keyof ILeadCRM)[],
    [headers]
  );

  return (
    <div>
      <CustomTableSearchBar<ILeadCRM>
        data={initialData}
        setFilteredData={setData}
        searchKeys={searchKeys}
        placeholder="Search by property, developer, city, amount or status"
      />

      <div className="h-179 p-4">
        {/* <NotFound/> */}
        <LeadCRMTable />
      </div>

      <LeadCRMSheet />
    </div>
  );
}
