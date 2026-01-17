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
import { createDeveloper, fetchDevelopers, updateDeveloper } from "@/lib/features/developers/developerApi";
import Image from "next/image";
import developerWp from "@/assets/developerWp.svg"
import call from "@/assets/call.svg"
import mail from "@/assets/mail.svg"
import Success from "../custom/popups/success";
import { set } from "zod";
import CitySelect from "../ui/citySelect";
import toast from "react-hot-toast";

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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* <fieldset className="rounded-md border-1 border-black px-4 pb-1 "> */}
      <fieldset
        className={`rounded-md px-4 pb-1 border ${error ? "border-red-500" : "border-black"
          }`}
      >

        <legend className="px-1 text-xs font-semibold text-gray-700">
          {label}
        </legend>
        {children}
      </fieldset>
      {error && (
        <p className="text-[11px] text-red-500">{error}</p>
      )}

    </div>
  );
}

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
        <h3 className="text-[16px] font-bold text-[#000000]">
          Sourcing Manager
        </h3>

        <div>
          <p className="text-[14px] font-medium text-[#929292]">
            Contact Person Name
          </p>
          <p className="mt-1 text-[16px] text-[#000000]">
            {developer?.sourcingManager?.name}
          </p>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[14px] font-medium text-[#929292]">Phone Number</p>
            <p className="mt-1 text-[16px] text-[#000000]">
              {developer?.sourcingManager?.mobile}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F8FF]">
              <Image
                src={developerWp}
                alt="WhatsApp"
                width={20}
                height={20}
              />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F8FF]">
              <Image
                src={call}
                alt="Call"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[14px] font-medium text-[#929292]">Email ID</p>
            <p className="mt-1 text-[16px] text-[#000000]">
              {developer?.sourcingManager?.email}
            </p>
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F8FF]">
            <Image
              src={mail}
              alt="Mail"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>

      <button className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white">
        Edit Developer
      </button>
    </div>
  );
}

function DeveloperEdit({
  developer,
  setOpen,
}: {
  developer: Developer;
  setOpen: (open: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(developer.logo || null);

  const { register, handleSubmit, control, formState: { isSubmitting }, } = useForm<DeveloperForm>({
    defaultValues: {
      name: developer.developerName,
      description: developer.description,
      city: developer.city,
      establishedYear: String(developer.establishedYear),
      totalProjects: String(developer.totalProjects),
      website: developer.website,
      contactName: developer.sourcingManager?.name,
      phone: developer.sourcingManager?.mobile,
      email: developer.sourcingManager?.email,
    },
  });

  const onSubmit = async (data: DeveloperForm) => {
    const formData = new FormData();

    formData.append("developerName", data.name);
    formData.append("description", data.description || "");
    formData.append("city", data.city);
    formData.append("establishedYear", data.establishedYear);
    formData.append("totalProjects", data.totalProjects);
    formData.append("website", data.website || "");
    formData.append(
      "sourcingManager",
      JSON.stringify({
        name: data.contactName,
        mobile: data.phone,
        email: data.email,
      })
    );

    if (file) {
      formData.append("logo", file);
    }

    try {
      await dispatch(
        updateDeveloper({
          id: developer._id,
          payload: formData,
        })
      ).unwrap();

      setOpen(false);
      dispatch(fetchDevelopers({ page: 1, limit: 10 }));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="h-[90vh] overflow-auto bg-white">
      <div className="mx-auto max-w-2xl bg-white px-4 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-start gap-4">
            {/* Logo Preview */}
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Developer logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">No Logo</span>
              )}
            </div>

            {/* Upload Section */}
            <div>
              <p className="text-sm font-medium text-gray-800">
                Upload Photo{" "}
                <label className="cursor-pointer font-semibold text-blue-600 underline">
                  browse
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        setFile(selectedFile);
                        setPreview(URL.createObjectURL(selectedFile));
                      }
                    }}
                  />
                </label>
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Max 10 MB files are allowed
              </p>

              {/* Edit Button */}
              <div className="mt-2 relative inline-block">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setFile(selectedFile);
                      setPreview(URL.createObjectURL(selectedFile));
                    }
                  }}
                />
                <button
                  type="button"
                  className="rounded-md border px-3 py-1 text-xs text-gray-600"
                >
                  Edit Logo
                </button>
              </div>
            </div>
          </div>

          <Field label="Developer Name*">
            <input
              {...register("name")}
              className="w-full rounded-lg text-sm outline-none"
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={4}
              {...register("description")}
              className="w-full rounded-lg text-sm outline-none"
            />
          </Field>

          <Field label="City">
            <CitySelect control={control} />
          </Field>

          <Field label="Established Year">
            <input
              type="number"
              {...register("establishedYear")}
              className="w-full rounded-lg text-sm outline-none"
            />
          </Field>

          <Field label="Total Projects">
            <input
              type="number"
              {...register("totalProjects")}
              className="w-full rounded-lg text-sm outline-none"
            />
          </Field>

          <Field label="Website / Project Link (Optional)">
            <input
              {...register("website")}
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
                  {...register("contactName")}
                  className="w-full rounded-lg text-sm outline-none"
                />
              </Field>

              <Field label="Phone Number">
                <input
                  {...register("phone")}
                  className="w-full rounded-lg text-sm outline-none"
                />
              </Field>

              <Field label="Email ID">
                <input
                  {...register("email")}
                  className="w-full rounded-lg text-sm outline-none"
                />
              </Field>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-lg py-3 mb-2 text-sm font-semibold text-white transition ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-900"
              }`}
          >
            {isSubmitting ? "Updating Developer..." : "Edit Developer"}
          </button>

        </form>
      </div>
    </div>
  );
}

function AddNewDeveloper({
  setOpen,
  onSuccess,
}: {
  setOpen: (open: boolean) => void;
  onSuccess: (msg: string) => void;
}) {

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
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

  const onSubmit = async (data: DeveloperForm) => {
    let hasError = false;

    if (!data.name) {
      setError("name", { message: "Developer name is required" });
      hasError = true;
    }

    if (!data.city) {
      setError("city", { message: "City is required" });
      hasError = true;
    }

    if (!data.establishedYear) {
      setError("establishedYear", { message: "Established year is required" });
      hasError = true;
    }

    if (!data.totalProjects) {
      setError("totalProjects", { message: "TotalProjects  is required" });
      hasError = true;
    }

    if (!data.contactName) {
      setError("contactName", { message: "Contact person name is required" });
      hasError = true;
    }

    if (!data.phone) {
      setError("phone", { message: "Phone number is required" });
      hasError = true;
    }

    if (!data.email) {
      setError("email", { message: "Email is required" });
      hasError = true;
    }

    if (hasError) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();

    formData.append("developerName", data.name);
    formData.append("description", data.description || "");
    formData.append("city", data.city);
    formData.append("establishedYear", data.establishedYear);
    formData.append("totalProjects", data.totalProjects);
    formData.append("website", data.website || "");
    formData.append(
      "sourcingManager",
      JSON.stringify({
        name: data.contactName,
        mobile: data.phone,
        email: data.email,
      })
    );

    if (file) {
      formData.append("logo", file);
    }

    try {
      await dispatch(createDeveloper(formData)).unwrap();
      onSuccess("Developer created successfully");
      dispatch(fetchDevelopers({ page: 1, limit: 10 }));
    } catch (err) {
      console.error("Failed to create developer:", err);
    }
  };

  return (
    <div className=" overflow-auto h-[90vh] bg-white">
      <div className="overflow-auto mx-auto max-w-2xl  bg-white px-4 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto space-y-5 pb-2">
          <div className="overflow-auto flex items-start gap-4">
            <div className={`${preview ? "" : "border-dashed border-blue-400 border"} flex h-20 w-20 items-center justify-center rounded-lg  bg-blue-50  text-white`}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                    setPreview(URL.createObjectURL(selectedFile));
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
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        setFile(selectedFile);
                        setPreview(URL.createObjectURL(selectedFile));
                      }
                    }}
                    className="absolute border-2 w-18 opacity-0 cursor-pointer"
                  />
                  <Camera className="size-3.5" />
                  Edit Logo
                </button>
              </div>
            </div>
          </div>

          <Field label="Developer Name*" error={errors.name?.message}>
            <input
              {...register("name")}
              placeholder="Enter name"
              className="w-full outline-none text-sm"
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={4}
              placeholder="Enter description"
              {...register("description")}
              className="w-full  outline-none text-sm"
            />
          </Field>

          <Field label="City" error={errors.city?.message}>
            <CitySelect control={control} />
          </Field>

          <Field label="Established Year" error={errors.establishedYear?.message}>
            <input
              placeholder="Enter established year"
              {...register("establishedYear")}
              className="w-full outline-none text-sm"
            />
          </Field>

          <Field label="Total Projects" error={errors.totalProjects?.message}>
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
              <Field label="Contact Person Name" error={errors.contactName?.message}>
                <input
                  placeholder="Enter contact name"
                  {...register("contactName")}
                  className="w-full outline-none text-sm"
                />
              </Field>

              <Field label="Phone Number" error={errors.phone?.message}>
                <input
                  placeholder="Enter phone number"
                  {...register("phone")}
                  className="w-full outline-none text-sm"
                />
              </Field>

              <Field label="Email ID" error={errors.email?.message}>
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
            className={`w-full rounded-lg py-3 text-sm font-semibold text-white transition ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-900"
              }`}
          >
            {isSubmitting ? "Adding New Developer" : "Add New Developer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DeveloperSheet({
  open,
  setOpen,
  data,
  mode,
}: DeveloperSheetProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <>
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
          {mode === "edit" && data && (
            <DeveloperEdit developer={data} setOpen={setOpen} />
          )}
          {mode === "create" && (
            <AddNewDeveloper
              setOpen={setOpen}
              onSuccess={(msg) => {
                setSuccessMessage(msg);
                setShowSuccess(true);
                setOpen(false);
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <Success
            message={successMessage}
            onClose={() => {
              setShowSuccess(false);
              setOpen(false);
            }}
          />
        </div>
      )}

    </>
  );
}

