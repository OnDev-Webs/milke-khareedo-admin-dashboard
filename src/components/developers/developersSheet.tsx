"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DeveloperForm,
  DeveloperSchema,
} from "@/schema/developer/devloperSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Mail, Phone, Camera } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import upload from "@/assets/uploadimg.svg";
import { useAppDispatch } from "@/lib/store/hooks";
import { createDeveloper } from "@/lib/features/developers/developerApi";

export type Developer = {
  _id: string;
  logo: string;
  developerName: string;
  description: string;
  city: string;
  establishedYear: number;
  totalProjects: number;
  website: string;
  createdAt: string;
  updatedAt: string;
  sourcingManager: {
    name: string;
    mobile: string;
    email: string;
  };
};

export type SheetMode = "view" | "edit" | "create" | "";

type DeveloperSheetProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: Developer;
  mode: SheetMode;
};

function DeveloperView({ developer }: { developer: Developer }) {
  return (
    <div className="h-[91vh] space-y-6 bg-white px-4 py-6 text-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
          {developer.logo ? (
            <img
              src={developer.logo}
              alt="Developer logo"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">No Logo</span>
          )}
        </div>

        <div>
          <p className="text-[26px] font-bold text-gray-900">
            {developer?.developerName}
          </p>
          <p className="text-xl font-normal text-gray-500">{developer?.city}</p>
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
          <p className="mt-1 text-sm text-gray-800">
            {developer?.sourcingManager?.name}
          </p>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-600">Phone Number</p>
            <p className="mt-1 text-sm text-gray-800">
              {developer?.sourcingManager?.mobile}
            </p>
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
            <p className="mt-1 text-sm text-gray-800">
              {developer?.sourcingManager?.email}
            </p>
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
    <div className="h-[90vh] overflow-auto bg-white">
      <div className="mx-auto max-w-2xl bg-white px-4 shadow-sm">
        <form className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
              {developer.logo ? (
                <img
                  src={developer.logo}
                  alt="Developer logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">No Logo</span>
              )}
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
              defaultValue={developer.developerName}
              className="w-full rounded-lg text-sm outline-none"
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={4}
              defaultValue={developer.description}
              className="w-full rounded-lg text-sm outline-none"
            />
          </Field>

          <Field label="City">
            <input
              defaultValue={developer.city}
              className="w-full rounded-lg text-sm outline-none"
            />
          </Field>

          <Field label="Established Year">
            <input
              type="number"
              defaultValue={developer.establishedYear}
              className="w-full rounded-lg text-sm outline-none"
            />
          </Field>

          <Field label="Total Projects">
            <input
              type="number"
              defaultValue={developer.totalProjects}
              className="w-full rounded-lg text-sm outline-none"
            />
          </Field>

          <Field label="Website / Project Link (Optional)">
            <input
              defaultValue={developer.website}
              className="w-full rounded-lg text-sm outline-none"
            />
          </Field>

          <div className="pt-2">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Sourcing Manager
            </h3>

            <div className="space-y-4">
              <Field label="Contact Person Name">
                <input
                  defaultValue={developer.sourcingManager?.name}
                  className="w-full rounded-lg text-sm outline-none"
                />
              </Field>

              <Field label="Phone Number">
                <input
                  defaultValue={developer.sourcingManager?.mobile}
                  className="w-full rounded-lg text-sm outline-none"
                />
              </Field>

              <Field label="Email ID">
                <input
                  defaultValue={developer.sourcingManager?.email}
                  className="w-full rounded-lg text-sm outline-none"
                />
              </Field>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white"
          >
            Edit Developer
          </button>
        </form>
      </div>
    </div>
  );
}

function AddNewDeveloper() {
  const [preview, setPreview] = useState<File | string | null>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DeveloperForm>({
    resolver: zodResolver(DeveloperSchema),
    defaultValues: {
      name: "",
      description: "",
      city: "",
      establishedYear: "",
      totalProjects: "",
      website: "",
      contactName: "",
      phone: "",
      email: "",
    },
  });
  const dispatch = useAppDispatch();

  const onSubmit = (data: any) => {
    data.logo = preview;
    dispatch(createDeveloper(data))
    
  };


  return (
    <div className=" overflow-auto h-[90vh] bg-white">
      <div className="overflow-auto mx-auto max-w-2xl  bg-white px-4 shadow-sm">
        <form  onSubmit={handleSubmit(onSubmit)} className="overflow-auto space-y-5 pb-2">
          <div className="overflow-auto flex items-start gap-4">
            <div className={`${preview? "" : "border-dashed border-blue-400 border"} flex h-20 w-20 items-center justify-center rounded-lg  bg-blue-50  text-white`}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className="absolute h-20 w-20 cursor-pointer opacity-0"
              />

              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-20 w-20 rounded-lg object-cover"
                />
              ) : (
                <img src={upload.src} alt="logo" />
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-800">
                Upload Photo{" "}
                <span className=" font-semibold text-blue-600">
                  browse
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Max 10 MB files are allowed
              </p>

              <div>
                
                <button
                  type="button"
                  className="mt-2 bg-black text-white rounded-sm border px-2 py-1 text-xs flex gap-1 items-center cursor-pointer"
                >
                  <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="absolute border-2 w-18 opacity-0 cursor-pointer "
                />
                  <Camera className="size-3.5"/>
                  Edit Logo
                </button>
              </div>
            </div>
          </div>

          <Field label="Developer Name*">
            <input
              {...register("name")}
              placeholder="Enter name"
              className="w-full  outline-none text-sm"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </Field>

          <Field label="Description">
            <textarea
              rows={4}
              placeholder="Enter description"
              {...register("description")}
              className="w-full  outline-none text-sm"
            />
          </Field>

          <Field label="City">
            <input
              placeholder="Enter city"
              {...register("city")}
              className="w-full  outline-none text-sm"
            />
          </Field>

          <Field label="Established Year">
            <input
              placeholder="Enter established year"
              {...register("establishedYear")}
              className="w-full outline-none text-sm"
            />
          </Field>

          <Field label="Total Projects">
            <input
              placeholder="Total projects"
              {...register("totalProjects")}
              className="w-full outline-none text-sm"
            />
          </Field>

          <Field label="Website / Project Link (Optional)">
            <input
              placeholder="Enter website link"
              {...register("website")}
              className="w-full outline-none text-sm"
            />
          </Field>

          <div className="pt-2">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Sourcing Manager
            </h3>

            <div className="space-y-4">
              <Field label="Contact Person Name">
                <input
                  placeholder="Enter contact name"
                  {...register("contactName")}
                  className="w-full outline-none text-sm"
                />
              </Field>

              <Field label="Phone Number">
                <input
                  placeholder="Enter phone number"
                  {...register("phone")}
                  className="w-full outline-none text-sm"
                />
              </Field>

              <Field label="Email ID">
                <input
                  placeholder="Enter email"
                  {...register("email")}
                  className="w-full outline-none text-sm"
                />
              </Field>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white"
          >
            {isSubmitting ? "Adding New Developer" : "Add New Developer"}
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
