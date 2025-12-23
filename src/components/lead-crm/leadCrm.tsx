"use client";
import { useMemo, useState, useEffect } from "react";
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
      userName: "Mohal Hasm",
      email: "mohal@gmail.com",
      phone: "+91 98765 43210",
      date: "12 Sep 2025, 10:30 AM",
      projectId: "PRJ-001",
      status: "active",
    },
    {
      id: 2,
      userName: "Rogue Dev",
      email: "rogue@gmail.com",
      phone: "+91 91234 56789",
      date: "13 Sep 2025, 02:15 PM",
      projectId: "PRJ-002",
      status: "inactive",
    },
    {
      id: 3,
      userName: "Nomad Singh",
      email: "nomad@gmail.com",
      phone: "+91 99887 66554",
      date: "14 Sep 2025, 09:00 AM",
      projectId: "PRJ-003",
      status: "active",
    },
    {
      id: 4,
      userName: "Adrian Smith",
      email: "adrian@gmail.com",
      phone: "+91 98765 12345",
      date: "15 Sep 2025, 11:45 AM",
      projectId: "PRJ-004",
      status: "active",
    },
    {
      id: 5,
      userName: "Barrett Lee",
      email: "barrett@gmail.com",
      phone: "+91 91234 56789",
      date: "16 Sep 2025, 03:30 PM",
      projectId: "PRJ-005",
      status: "inactive",
    },
    {
      id: 6,
      userName: "Cedric Brown",
      email: "cedric@gmail.com",
      phone: "+91 99876 54321",
      date: "17 Sep 2025, 01:15 PM",
      projectId: "PRJ-006",
      status: "active",
    },
    {
      id: 7,
      userName: "David Wilson",
      email: "david@gmail.com",
      phone: "+91 98765 43210",
      date: "18 Sep 2025, 10:00 AM",
      projectId: "PRJ-007",
      status: "active",
    },
    {
      id: 8,
      userName: "Ethan Miller",
      email: "ethan@gmail.com",
      phone: "+91 91234 56789",
      date: "19 Sep 2025, 02:45 PM",
      projectId: "PRJ-008",
      status: "inactive",
    },
    {
      id: 9,
      userName: "Frank Thomas",
      email: "frank@gmail.com",
      phone: "+91 99887 66554",
      date: "20 Sep 2025, 09:30 AM",
      projectId: "PRJ-009",
      status: "active",
    },
    {
      id: 10,
      userName: "George Davis",
      email: "george@gmail.com",
      phone: "+91 98765 12345",
      date: "21 Sep 2025, 11:15 AM",
      projectId: "PRJ-010",
      status: "active",
    },
    {
      id: 11,
      userName: "Henry Martin",
      email: "henry@gmail.com",
      phone: "+91 91234 56789",
      date: "22 Sep 2025, 03:00 PM",
      projectId: "PRJ-011",
      status: "inactive",
    },
    {
      id: 12,
      userName: "Ian Clark",
      email: "ian@gmail.com",
      phone: "+91 99876 54321",
      date: "23 Sep 2025, 12:45 PM",
      projectId: "PRJ-012",
      status: "active",
    },
  ];

  const [data, setData] = useState<ILeadCRM[]>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
      <CustomTableSearchBar<ILeadCRM>
        data={initialData}
        setFilteredData={setData}
        searchKeys={searchKeys}
        placeholder="Search by user name, email, phone, date, project ID or status"
      />

      <div className="h-179 p-4">
        {data.length === 0 ? (
          <NotFound />
        ) : (
          <LeadCRMTable
            leads={currentItems}
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

      <LeadCRMSheet mode="" open={false} setOpen={()=>{}} />
    </div>
  );
}