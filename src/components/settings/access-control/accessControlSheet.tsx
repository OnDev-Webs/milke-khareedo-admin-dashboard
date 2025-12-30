"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowUp,
  Calendar,
  Clock,
  Mail,
  Phone,
  Plus,
  Replace,
  X,
} from "lucide-react";
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: any;
  children: React.ReactNode;
}) {
  return (
    <div>
      <fieldset className="border-2 border-black px-4 pb-1 rounded-md">
        <legend className="text-xs font-semibold text-gray-700 px-1">
          {label}
        </legend>
        {children}
      </fieldset>
      {error && (
        <p className="text-[11px] text-red-500">This field is required</p>
      )}
    </div>
  );
}

function UserCreate() {
  return (
    <div className=" overflow-auto h-[90vh] bg-white">
      <div className="overflow-auto mx-auto max-w-2xl  bg-white px-4 h-full">
        <form className="overflow-auto flex flex-col justify-between h-full">
          <div className="space-y-5">
            <div className="overflow-auto flex items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-black text-white">
                <span className="text-sm font-semibold">homy</span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Upload Photo{" "}
                  <span className="cursor-pointer font-semibold text-blue-600 underline">
                    browse
                  </span>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Max 10 MB files are allowed
                </p>

                <button
                  type="button"
                  className="mt-2 rounded-sm border px-3 py-1 text-xs text-gray-600 bg-black text-white"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <Field label="Name*">
              <input
                type="text"
                defaultValue="Robert"
                placeholder="Enter Name"
                className="w-full outline-none text-sm"
              />
            </Field>

            <Field label="Domain ID">
              <input
                type="text"
                defaultValue="Maarq Vista"
                placeholder="Enter Your Domain ID"
                className="w-full outline-none text-sm"
              />
            </Field>

            <Field label="Phone Number">
              <input
                type="number"
                defaultValue="7777777777"
                placeholder="Enter Your Phone Number"
                className="w-full rounded-lg outline-none text-sm"
              />
            </Field>

            <Field label="Role">
              <input
                type="text"
                defaultValue="Admin"
                placeholder="Select Role"
                className="w-full rounded-lg outline-none text-sm"
              />
            </Field>

            <Field label="Password">
              <input
                defaultValue="xxxxxxxx"
                type="password"
                className="w-full rounded-lg outline-none text-sm"
              />
            </Field>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white"
          >
            Add New User
          </button>
        </form>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </p>
  );
}

export default function AccessControlSheet({ open, setOpen, data, mode }: any) {
  //   let selectedUser = null;
  //   if (!open || !selectedUser) return null;

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
          <AssignEmployee />
        </div>
      </SheetContent>
    </Sheet>
  );
}


