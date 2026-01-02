"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import CustomTableSearchBar from "../custom/searchBar";
import NotFound from "@/app/lead-crm/not-found";
import LeadCRMTable from "./leadCrmTable";
import LeadCRMSheet from "./leadCrmSheet";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchLeads } from "@/lib/features/lead-crm/leadcrmApi";
import { RootState } from "@/lib/store/store";
import { Lead } from "@/lib/features/lead-crm/leadcrmSlice";

export type HeaderLeadCRM = {
  key: keyof Lead | "actions";
  label: string;
  minW: string;
};

export default function LeadCRM({
  dateRange,
}: {
  dateRange: "past_24_hours" | "past_7_days" | "past_30_days";
}) {

  const dispatch = useAppDispatch();
  const { leads, loading, page, limit, total, totalPages } = useAppSelector(
    (state: RootState) => state.leadcrm
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const headers: HeaderLeadCRM[] = [
    { key: "userName", label: "USER NAME", minW: "min-w-[200px]" },
    { key: "email", label: "EMAIL", minW: "min-w-[160px]" },
    { key: "phoneNumber", label: "PHONE", minW: "min-w-[140px]" },
    { key: "dateTime", label: "DATE & TIME", minW: "min-w-[120px]" },
    { key: "projectId", label: "PROJECT ID", minW: "min-w-[140px]" },
    { key: "status", label: "STATUS", minW: "min-w-[100px]" },
    { key: "actions", label: "ACTIONS", minW: "min-w-[100px]" },
  ];

  const searchKeys = useMemo(
    () =>
      headers
        .filter((column) => column.key !== "actions")
        .map((c) => c.key) as (keyof Lead)[],
    [headers]
  );

  const fetchLeadsData = useCallback(
    (pageNum: number, search?: string) => {
      dispatch(
        fetchLeads({
          page: pageNum,
          limit: 10,
          search,
          dateRange, 
        })
      );
    },
    [dispatch, dateRange]
  );

  useEffect(() => {
    fetchLeadsData(1);
  }, [fetchLeadsData]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const searchValue = searchQuery.trim() !== "" ? searchQuery : undefined;
    fetchLeadsData(pageNumber, searchValue);
  };

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
      const searchValue = query.trim() !== "" ? query : undefined;
      fetchLeadsData(1, searchValue);
    },
    [fetchLeadsData]
  );

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

  const indexOfFirstItem = (currentPage - 1) * limit;
  const indexOfLastItem = Math.min(currentPage * limit, total);

  return (
    <div>
      {/* SEARCH BAR (DESKTOP ONLY) */}
      <div className="hidden md:block">
        <CustomTableSearchBar<Lead>
          data={leads}
          onSearch={handleSearch}
          searchKeys={searchKeys}
          placeholder="Search by user name, email, phone, date, project ID or status"
        />
      </div>

      <LeadCRMTable
        leads={leads}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        getPageNumbers={getPageNumbers}
        dataLength={total}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        onRefreshLeads={() => {
          const searchValue = searchQuery.trim() !== "" ? searchQuery : undefined;
          fetchLeadsData(currentPage, searchValue);
        }}
      />
    </div>
  );
}
