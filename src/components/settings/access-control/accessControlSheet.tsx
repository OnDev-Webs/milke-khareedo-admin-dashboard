"use client";

import {Sheet, SheetContent} from "@/components/ui/sheet";
import {X} from "lucide-react";
import AssignEmployee from "./assignEmployee";

export type User = {
  id: number;
  userName: string;
  email: string;
  phone: string;
  date: string;
  projectId: string;
  status: "active" | "inactive";
};


export default function AccessControlSheet({ open, setOpen, data, mode , roleId }: any) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-[420px] max-h-screen overflow-y-auto p-0">

        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Assign Employees
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-gray-100 p-2"
            >
              <X size={16} className="text-red-500" />
            </button>
          </div>
        </div>

        <div className="px-2">
          <AssignEmployee roleId={roleId} setOpen={setOpen} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
