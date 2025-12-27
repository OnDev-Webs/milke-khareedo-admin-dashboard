"use client";
import { useMemo, useState, useEffect } from "react";
import CustomTableSearchBar from "../custom/searchBar";
import NotFound from "@/app/developers/not-found";
import DevelopersTable from "./developersTable";
import DeveloperSheet, { SheetMode } from "./developersSheet";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDevelopers } from "@/lib/features/developers/developerApi";
import { RootState } from "@/lib/store/store";
import { Developer } from "@/lib/features/developers/developerSlice";

interface IDeveloper extends Developer { }

type Header = {
  key: keyof IDeveloper | "actions";
  label: string;
  minW: string;
};

export default function Developers() {
  const dispatch = useAppDispatch();
  const { developers } = useAppSelector((state: RootState) => state.developers);

  const [data, setData] = useState<IDeveloper[]>(developers);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [open, setOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<SheetMode>("create");

  useEffect(() => {
    dispatch(fetchDevelopers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const headers: Header[] = [
    { key: "developerName", label: "DEVELOPER NAME", minW: "min-w-[200px]" },
    { key: "totalProjects", label: "PROJECTS", minW: "min-w-[140px]" },
    { key: "city", label: "CITY", minW: "min-w-[140px]" },
    { key: "actions", label: "ACTIONS", minW: "min-w-[100px]" },
  ];

  const searchKeys = useMemo(
    () =>
      headers
        .filter((column) => column.key !== "actions")
        .map((c) => c.key) as (keyof IDeveloper)[],
    [headers]
  );

  const totalPages = Math.ceil(data?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

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
      <CustomTableSearchBar<IDeveloper>
        data={developers}
        setFilteredData={setData}
        searchKeys={searchKeys}
        placeholder="Search by developer name, city or status"
        addButton={{
          buttonName: "Add New Developer",
          url: "",
        }}
        setSheetOpen={setOpen}
        mode={mode}
      />

      <div className="h-179 p-4">
        {data?.length === 0 ? (
          <NotFound />
        ) : (
          <DevelopersTable
            developers={currentItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            getPageNumbers={getPageNumbers}
            dataLength={data?.length}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
          />
        )}
      </div>

      <DeveloperSheet mode={mode} open={open} setOpen={setOpen} />
    </div>
  );
}
