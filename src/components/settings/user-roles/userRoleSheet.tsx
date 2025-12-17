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
import { useState } from "react";

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

function UserView(data: any) {
  // function UserView({ User }: { User: User }) {
  return (
    <div className="mx-auto  bg-white  h-[90vh] px-4 flex flex-col justify-between">
      <div>
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-black text-white">
            <span className="text-sm font-semibold">homy</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">homy homes</p>
            <p className="text-xs text-gray-500">Ahmadabad</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Sourcing Manager
          </h3>

          <div>
            <p className="text-xs font-semibold text-gray-600">
              Contact Person Name
            </p>
            <p className="mt-1 text-sm text-gray-800">Mansukh Khben</p>
          </div>

          <div className="flex reflect-items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-600">
                Phone Number
              </p>
              <p className="mt-1 text-sm text-gray-800">+91 965 265 2648</p>
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
              <p className="mt-1 text-sm text-gray-800">example@gmail.com</p>
            </div>

            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <Mail size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button
          type="button"
          className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white"
        >
          Edit Developer
        </button>
      </div>
    </div>
  );
}

function UserEdit(data: any) {
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
                defaultValue={data.name}
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

export default function UserAndRolesSheet({ open, setOpen, data, mode }: any) {
  //   let selectedUser = null;
  //   if (!open || !selectedUser) return null;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-[420px]">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center justify-between">
              {mode === "view" && "View details"}
              {mode === "edit" && "Edit details"}
              {mode === "create" && "Add new user"}
              <button
                type="button"
                className="rounded-full bg-gray-100 p-2 text-sm text-gray-600"
                onClick={handleClose}
              >
                <X size={16} className="text-red-500" />
              </button>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="">
          {mode === "view" && <UserView data={data} />}
          {mode === "edit" && <UserEdit data={data} />}
          {mode === "create" && <UserCreate />}
        </div>
      </SheetContent>
    </Sheet>
  );
}