"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X, Mail, Phone } from "lucide-react";
import React from "react";


export type Developer = {
  id: number;
  userName: string;
  email: string;
  phone: string;
  date: string;
  projectId: string;
  status: "active" | "inactive";
};

export type SheetMode = "view" | "edit" | "create";

type DeveloperSheetProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: Developer;
  mode: SheetMode;
};


function DeveloperView({ developer }: { developer: Developer }) {
  return (
    <div className="h-[91vh] space-y-6 bg-white px-4 py-6 text-sm">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-black text-white">
          <span className="text-sm font-semibold">{developer.userName}</span>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            {developer.userName}
          </p>
          <p className="text-xs text-gray-500">{developer.projectId}</p>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Sourcing Manager
        </h3>

        <div>
          <p className="text-xs font-semibold text-gray-600">
            Contact Person Name
          </p>
          <p className="mt-1 text-sm text-gray-800">{developer.userName}</p>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-600">Phone Number</p>
            <p className="mt-1 text-sm text-gray-800">{developer.phone}</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Phone size={16} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Mail size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-600">Email ID</p>
            <p className="mt-1 text-sm text-gray-800">{developer.email}</p>
          </div>

          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
            <Mail size={16} />
          </button>
        </div>
      </div>

      <button className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white">
        Edit Developer
      </button>
    </div>
  );
}


function DeveloperEdit({ developer }: { developer: Developer }) {
  return (
    <div className="space-y-4 px-4 py-6 text-sm">
      <Field label="Developer Name">
        <input
          defaultValue={developer.userName}
          className="w-full text-sm outline-none"
        />
      </Field>

      <Field label="Email">
        <input
          defaultValue={developer.email}
          className="w-full text-sm outline-none"
        />
      </Field>

      <Field label="Phone">
        <input
          defaultValue={developer.phone}
          className="w-full text-sm outline-none"
        />
      </Field>

      <Field label="Status">
        <select
          defaultValue={developer.status}
          className="w-full text-sm outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </Field>

      <button className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white">
        Save Changes
      </button>
    </div>
  );
}


function AddNewDeveloper() {
  return (
    <div className=" overflow-auto h-[90vh] bg-white">
      <div className="overflow-auto mx-auto max-w-2xl  bg-white px-4 shadow-sm">
        {/* <div className="mb-6 flex items-center justify-between">
          
          <button
            type="button"
            className="rounded-full bg-gray-100 p-2 text-sm text-gray-600"
          >
            <X size={16} className="text-red-500" />
          </button>
        </div> */}

        <form className="overflow-auto space-y-5">
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
                className="mt-2 rounded-md border px-3 py-1 text-xs text-gray-600"
              >
                Edit Logo
              </button>
            </div>
          </div>

          <Field label="Developer Name*">
            <input
              defaultValue="Maarq Vista"
              className="w-full rounded-lg outline-none text-sm"
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={4}
              defaultValue="Nestled between Sathya Sai Grama and Chikkaballapur town, VISTA is RERA approved project..."
              className="w-full rounded-lg outline-none text-sm"
            />
          </Field>

          <Field label="City">
            <select className="w-full rounded-lg outline-none text-sm">
              <option>Surat</option>
            </select>
          </Field>

          <Field label="Established Year">
            <input
              defaultValue="2018"
              className="w-full rounded-lg outline-none text-sm"
            />
          </Field>

          <Field label="Total Projects">
            <input
              defaultValue="25"
              className="w-full rounded-lg outline-none text-sm"
            />
          </Field>

          <Field label="Website / Project Link (Optional)">
            <input
              defaultValue="https://ssjara.com"
              className="w-full rounded-lg outline-none text-sm"
            />
          </Field>

          <div className="pt-2">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Sourcing Manager
            </h3>

            <div className="space-y-4">
              <Field label="Contact Person Name">
                <input
                  defaultValue="Mansukh khamar"
                  className="w-full rounded-lg outline-none text-sm"
                />
              </Field>

              <Field label="Phone Number">
                <input
                  defaultValue="+91 265 652 3654"
                  className="w-full rounded-lg outline-none text-sm"
                />
              </Field>

              <Field label="Email ID">
                <input
                  defaultValue="example.com"
                  className="w-full rounded-lg outline-none text-sm"
                />
              </Field>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white"
          >
            Add New Developer
          </button>
        </form>
      </div>
    </div>
  );
}


function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <fieldset className="rounded-md border-2 border-black px-4 pb-1">
        <legend className="px-1 text-xs font-semibold text-gray-700">
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


export default function DeveloperSheet({
  open,
  setOpen,
  data,
  mode,
}: DeveloperSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[420px]">
        <SheetHeader className="border-b">
          <SheetTitle>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === "view" && "Developer Details"}
                {mode === "edit" && "Edit Developer"}
                {mode === "create" && "Add New Developer"}
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-gray-100 p-2"
              >
                <X size={16} className="text-red-500" />
              </button>
            </div>
          </SheetTitle>
        </SheetHeader>

        {mode === "view" && data && <DeveloperView developer={data} />}
        {mode === "edit" && data && <DeveloperEdit developer={data} />}
        {mode === "create" && <AddNewDeveloper />}
      </SheetContent>
    </Sheet>
  );
}