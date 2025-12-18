"use client";
import { useMemo, useState, useEffect } from "react";
import CustomTableSearchBar from "../custom/searchBar";
import NotFound from "@/app/developers/not-found";
import DevelopersTable from "./developersTable";
import DeveloperSheet from "./developersSheet";

type Developer = {
  id: number;
  name: string;
  projectCount: string;
  city: string;
  status: "Active" | "Inactive";
};

type Header = {
  key: keyof Developer | "actions";
  label: string;
  minW: string;
};

type SortState<T> = {
  key: keyof T | null;
  dir: "asc" | "desc" | null;
};

export default function Developers() {
  const initialData: Developer[] = [
    { id: 1, name: "Sisara Dev", projectCount: "00", city: "Rajkot", status: "Active" },
    { id: 2, name: "Godrej Properties", projectCount: "02", city: "Rajkot", status: "Active" },
    { id: 3, name: "Brigade Group", projectCount: "03", city: "Mavdi", status: "Inactive" },
    { id: 4, name: "DLF", projectCount: "00", city: "Navagam", status: "Active" },
    { id: 5, name: "Lodha Group", projectCount: "05", city: "Surat", status: "Active" },
    { id: 6, name: "Avadh Group", projectCount: "06", city: "Ahamdabad", status: "Active" },
    { id: 7, name: "SB Developers", projectCount: "07", city: "Kanpur", status: "Active" },
    { id: 8, name: "Tata Housing", projectCount: "08", city: "Mumbai", status: "Active" },
    { id: 9, name: "Sobha Limited", projectCount: "09", city: "Bangalore", status: "Inactive" },
    { id: 10, name: "Prestige Group", projectCount: "10", city: "Chennai", status: "Active" },
    { id: 11, name: "Kolte Patil", projectCount: "11", city: "Pune", status: "Active" },
    { id: 12, name: "Mahindra Lifespaces", projectCount: "12", city: "Delhi", status: "Active" },
  ];

  const [data, setData] = useState<Developer[]>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sort, setSort] = useState<SortState<Developer>>({
    key: null,
    dir: null,
  });

  const headers: Header[] = [
    { key: "name", label: "DEVELOPER NAME", minW: "min-w-[200px]" },
    { key: "projectCount", label: "PROJECTS", minW: "min-w-[140px]" },
    { key: "city", label: "CITY", minW: "min-w-[140px]" },
    { key: "status", label: "STATUS", minW: "min-w-[120px]" },
    { key: "actions", label: "ACTIONS", minW: "min-w-[100px]" },
  ];

  const searchKeys = useMemo(
    () =>
      headers
        .filter((column) => column.key !== "actions")
        .map((c) => c.key) as (keyof Developer)[],
    [headers]
  );

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
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
      <CustomTableSearchBar<Developer>
        data={initialData}
        setFilteredData={setData}
        searchKeys={searchKeys}
        placeholder="Search by developer name, city or status"
        addButton={{
          buttonName: "Add New Developer",
          url: "",
        }}
      />

      <div className="h-179 p-4">
        {data.length === 0 ? (
          <NotFound />
        ) : (
          <DevelopersTable 
            developers={currentItems}
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

      <DeveloperSheet />
    </div>
  );
}