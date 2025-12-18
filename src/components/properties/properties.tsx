"use client";
import { useMemo, useState, useEffect } from "react";
import CustomTableSearchBar from "../custom/searchBar";
import NotFound from "@/app/properties/not-found";
import PropertiesTable from "./propertyTable";

type Iproperties = {
  id: number;
  propertyName: string;
  developer: string;
  city: string;
  groupCount: string;
  amount: number;
  status: string;
};

type Header = {
  key: keyof Iproperties | "actions";
  label: string;
  minW: string;
};

type SortState<T> = {
  key: keyof T | null;
  dir: "asc" | "desc" | null;
};

export default function Properties() {
  const initialData: Iproperties[] = [
    {
      id: 1,
      propertyName: "SK Villas",
      developer: "SB developers",
      city: "Kanpur",
      groupCount: "3",
      amount: 1000,
      status: "active",
    },
    {
      id: 2,
      propertyName: "Sisara Dev",
      developer: "Mohal Hasm",
      city: "Ahamdabad",
      groupCount: "00",
      amount: 2000,
      status: "Active",
    },
    {
      id: 3,
      propertyName: "Godrej Properties",
      developer: "Rogue",
      city: "Rajkot",
      groupCount: "02",
      amount: 3000,
      status: "Active",
    },
    {
      id: 4,
      propertyName: "Brigade Group",
      developer: "Nomad",
      city: "Mavdi",
      groupCount: "03",
      amount: 4000,
      status: "Inactive",
    },
    {
      id: 5,
      propertyName: "DLF",
      developer: "Adrian",
      city: "Navagam",
      groupCount: "00",
      amount: 5000,
      status: "Active",
    },
    {
      id: 6,
      propertyName: "Lodha Group",
      developer: "Barrett",
      city: "Surat",
      groupCount: "05",
      amount: 6000,
      status: "Active",
    },
    {
      id: 7,
      propertyName: "Avadh Group",
      developer: "Cedric",
      city: "Ahamdabad",
      groupCount: "06",
      amount: 7000,
      status: "Active",
    },
    {
      id: 8,
      propertyName: "Avadh Group 2",
      developer: "Cedric",
      city: "Ahamdabad",
      groupCount: "06",
      amount: 8000,
      status: "Active",
    },
    {
      id: 9,
      propertyName: "Avadh Group 3",
      developer: "Cedric",
      city: "Ahamdabad",
      groupCount: "06",
      amount: 9000,
      status: "Inactive",
    },
    {
      id: 10,
      propertyName: "Avadh Group 4",
      developer: "Cedric",
      city: "Ahamdabad",
      groupCount: "06",
      amount: 10000,
      status: "Active",
    },
    {
      id: 11,
      propertyName: "Avadh Group 5",
      developer: "Cedric",
      city: "Ahamdabad",
      groupCount: "06",
      amount: 11000,
      status: "Active",
    },
    {
      id: 12,
      propertyName: "Avadh Group 6",
      developer: "Cedric",
      city: "Mumbai",
      groupCount: "06",
      amount: 12000,
      status: "Active",
    },
  ];

  const [data, setData] = useState<Iproperties[]>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sort, setSort] = useState<SortState<Iproperties>>({
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
        .map((c) => c.key) as (keyof Iproperties)[],
    [headers]
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div>
      <CustomTableSearchBar<Iproperties>
        data={initialData}
        setFilteredData={setData}
        searchKeys={searchKeys}
        placeholder="Search by property, developer, city, amount or status"
        addButton={{
          buttonName: "Add New Property",
          url: "/properties/add-property",
        }}
      />

      <div className="h-179 p-4">
        {data.length === 0 ? (
          <NotFound />
        ) : (
          <PropertiesTable 
            properties={currentItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            getPageNumbers={getPageNumbers}
            dataLength={data.length}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
          />
        )}
      </div>
    </div>
  );
}