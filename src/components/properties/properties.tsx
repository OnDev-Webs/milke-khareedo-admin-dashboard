"use client";
import { useMemo, useState, useEffect } from "react";
import CustomTableSearchBar from "../custom/searchBar";
import NotFound from "@/app/properties/not-found";
import PropertiesTable from "./propertyTable";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { Property } from "@/lib/features/properties/propertiesSlice";
import { fetchProperties } from "@/lib/features/properties/propertiesApi";
import Loader from "../ui/loader";

type Iproperties = {
  id: number | string;
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

  const {PropertiesList,totalPages,loading,} = useAppSelector((state: RootState) => state.properties);

  const [filteredData, setFilteredData] = useState<Property[]>([]);

  useEffect(() => {
    setFilteredData(PropertiesList);
  }, [PropertiesList]);

  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProperties({ page: currentPage, limit: 10 }));
  }, [currentPage, dispatch]);

  const headers: Header[] = [
    { key: "propertyName", label: "PROPERTY", minW: "min-w-[200px]" },
    { key: "developer", label: "DEVELOPER", minW: "min-w-[160px]" },
    { key: "city", label: "CITY", minW: "min-w-[140px]" },
    { key: "groupCount", label: "GROUPS", minW: "min-w-[120px]" },
    // { key: "amount", label: "AMOUNT", minW: "min-w-[140px]" },
    { key: "status", label: "STATUS", minW: "min-w-[100px]" },
    { key: "actions", label: "ACTIONS", minW: "min-w-[100px]" },
  ];

  const searchKeys = useMemo(
    () =>
      headers
        .filter((column) => column.key !== "actions")
        .map((c) => c.key) as (keyof Property)[],
    [headers]
  );

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
      <CustomTableSearchBar<Property>
        data={PropertiesList}
        setFilteredData={setFilteredData}
        searchKeys={searchKeys}
        placeholder="Search by property, developer, city, amount or status"
        addButton={{
          buttonName: "Add New Property",
          url: "/properties/add-property",
        }}
      />

      <div className="h-full p-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="text-sm text-gray-500"><Loader /></span>
          </div>
        ) : filteredData.length === 0 ? (
          <NotFound />
        ) : (
          <PropertiesTable
            properties={filteredData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            getPageNumbers={getPageNumbers}
          />
        )}
      </div>
    </div>
  );
}