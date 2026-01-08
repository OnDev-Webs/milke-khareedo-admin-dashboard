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
import { hasPermission } from "@/lib/permissions/hasPermission";
import { PERMISSIONS } from "@/lib/permissions/permissionKeys";

interface IDeveloper extends Developer { }

type Header = {
  key: keyof IDeveloper | "actions";
  label: string;
  minW: string;
};

export default function Developers() {
  const dispatch = useAppDispatch();
  const { developers, page, total, loading } = useAppSelector((state: RootState) => state.developers);

  const [data, setData] = useState<IDeveloper[]>(developers);
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

  const loadMore = () => {
    if (developers.length < total && !loading) {
      dispatch(fetchDevelopers({ page: page + 1, limit: 10 }));
    }
  };

  const canAddDeveloper = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.DEVELOPER.ADD)
  );

  return (
    <div>
      <CustomTableSearchBar<IDeveloper>
        data={developers}
        setFilteredData={setData}
        searchKeys={searchKeys}
        placeholder="Search by developer name, city or status"
        addButton={
          canAddDeveloper
            ? {
              buttonName: "Add New Developer",
              url: "",
            }
            : undefined
        }
        setSheetOpen={canAddDeveloper ? setOpen : undefined}
        mode={canAddDeveloper ? mode : undefined}
      />
      <div className="p-4">
        {data?.length === 0 ? (
          <NotFound />
        ) : (
          <DevelopersTable
            developers={developers}
            onLoadMore={loadMore}
            hasMore={developers.length < total}
          />
        )}
      </div>

      <DeveloperSheet mode={mode} open={open} setOpen={setOpen} />
    </div>
  );
}
