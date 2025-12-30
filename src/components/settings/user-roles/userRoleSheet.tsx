"use client";

import {Sheet,SheetContent,SheetHeader,SheetTitle,} from "@/components/ui/sheet";
import {Eye,EyeOff, Mail,Phone,Upload, X,} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

function UserView({ data, onEdit }: any) {
  return (
    <div className="mx-auto  bg-white  h-[86vh] px-4 flex flex-col justify-between">
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
          onClick={onEdit}
          className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white"
        >
          Edit Developer
        </button>

      </div>
    </div>
  );
}

function UserEdit({ data }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setPreview(data?.image || "");
  }, [data]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="h-[86vh] bg-white overflow-hidden">
      <div className="mx-auto max-w-2xl bg-white px-4 h-full">
        <form className="flex flex-col justify-between h-full">
          <div className="space-y-5 overflow-y-auto pr-1">

            {/* IMAGE EDIT SECTION (FIXED) */}
            <div className="flex items-start gap-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed overflow-hidden text-gray-400"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Upload size={20} />
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Upload Photo{" "}
                  <span
                    onClick={() => fileRef.current?.click()}
                    className="cursor-pointer font-semibold text-blue-600 underline"
                  >
                    browse
                  </span>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Max 10 MB files are allowed
                </p>

                {/* EDIT PROFILE BUTTON */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-2 rounded-sm bg-black px-3 py-1 text-xs text-white"
                >
                  Edit Profile
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
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
                defaultValue={data.domainId}
                placeholder="Enter Your Domain ID"
                className="w-full outline-none text-sm"
              />
            </Field>

            <Field label="Phone Number">
              <input
                type="number"
                defaultValue={data.phone}
                placeholder="Enter Your Phone Number"
                className="w-full outline-none text-sm"
              />
            </Field>

            <Field label="Role">
              <select
                defaultValue={data.role || ""}
                className="w-full outline-none text-sm bg-transparent"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Admin">Admin</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Sales Agent">Sales Agent</option>
                <option value="User">User</option>
              </select>
            </Field>

            <Field label="Password">
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue="xxxxxxxx"
                  className="w-full outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-black py-3 text-sm font-semibold text-white"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
  );
}

function UserCreate() {
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="h-[86vh] bg-white overflow-hidden">
      <div className="mx-auto max-w-2xl bg-white px-4 h-full">
        <form className="flex flex-col justify-between h-full">

          <div className="space-y-5 overflow-y-auto pr-1">
            <div className="flex items-start gap-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed overflow-hidden text-gray-400"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Upload size={20} />
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Upload Photo{" "}
                  <span
                    onClick={() => fileRef.current?.click()}
                    className="cursor-pointer font-semibold text-blue-600 underline"
                  >
                    browse
                  </span>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Max 10 MB files are allowed
                </p>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-2 rounded-sm bg-black px-3 py-1 text-xs text-white">
                  Edit Profile
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>

            <Field label="Name*">
              <input
                type="text"
                placeholder="Enter Name"
                className="w-full outline-none text-sm"
              />
            </Field>

            <Field label="Domain ID">
              <input
                type="text"
                placeholder="Enter Domain ID"
                className="w-full outline-none text-sm"
              />
            </Field>

            <Field label="Phone Number">
              <input
                type="tel"
                placeholder="+91 000 000 0000"
                className="w-full outline-none text-sm"
              />
            </Field>

            <Field label="Role">
              <select className="w-full outline-none text-sm bg-transparent">
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="agent">Agent</option>
              </select>
            </Field>

            <Field label="Password">
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="xxxxxxxxxx"
                  className="w-full outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-black py-3 text-sm font-semibold text-white"
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

export default function UserAndRolesSheet({ open, setOpen, data, mode, setMode }: any) {
  const handleClose = () => {
    setOpen(false);
    setMode("view");
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
          {mode === "view" && (
            <UserView
              data={data}
              onEdit={() => setMode("edit")}
            />
          )}

          {mode === "edit" && <UserEdit data={data} />}
          {mode === "create" && <UserCreate />}
        </div>
      </SheetContent>
    </Sheet>
  );
}