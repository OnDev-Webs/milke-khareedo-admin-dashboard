"use client";
import { useMemo, useState } from "react";
import CustomTableSearchBar from "../custom/searchBar";
import NotFound from "@/app/developers/not-found";
import DevelopersTable from "./developersTable";
import DeveloperSheet from "./developersSheet";

type IDevelopers = {
  id: number;
  propertyName: string;
  developer: string;
  city: string;
  groupCount: string;
  amount: number;
  status: string;
};

type Header = {
  key: keyof IDevelopers | "actions";
  label: string;
  minW: string;
};

type SortState<T> = {
  key: keyof T | null;
  dir: "asc" | "desc" | null;
};

export default function Developers() {
  const initialData: IDevelopers[] = [
    {
      id: 1,
      propertyName: "SK Villas",
      developer: "SB developers",
      city: "Kanpur",
      groupCount: "3",
      amount: 1000,
      status: "active",
    },
  ];

  const [data, setData] = useState<IDevelopers[]>(initialData);
  const [sort, setSort] = useState<SortState<IDevelopers>>({
    key: null,
    dir: null,
  });

  const headers: Header[] = [
    { key: "propertyName", label: "PROPERTY", minW: "min-w-[200px]" },
    { key: "developer", label: "DEVELOPER", minW: "min-w-[160px]" },
    { key: "city", label: "CITY", minW: "min-w-[140px]" },
    { key: "groupCount", label: "GROUPS", minW: "min-w-[120px]" },
    { key: "amount", label: "AMOUNT", minW: "min-w-[140px]" },
    { key: "status", label: "STATUS", minW: "min-w-[100px]" },
    { key: "actions", label: "ACTIONS", minW: "min-w-[100px]" },
  ];

  const searchKeys = useMemo(
    () =>
      headers
        .filter((column) => column.key !== "actions")
        .map((c) => c.key) as (keyof IDevelopers)[],
    [headers]
  );

  return (
    <div>
      <CustomTableSearchBar<IDevelopers>
        data={initialData}
        setFilteredData={setData}
        searchKeys={searchKeys}
        placeholder="Search by property, developer, city, amount or status"
        addButton={{
            buttonName:"Add New Developer",
            url:""
        }}
      />

      <div className="h-179 p-4">
        {/* <NotFound/> */}
        <DevelopersTable/>
      </div>

      <DeveloperSheet/>
    </div>
  );
}
