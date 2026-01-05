"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { fetchRoles } from "@/lib/features/role/roleApi";
import { createUser, fetchUserById, updateUser } from "@/lib/features/user/userApi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Eye, EyeOff, Mail, Phone, Upload, X, } from "lucide-react";
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
  if (!data) return null;

  return (
    <div className="mx-auto bg-white h-[86vh] px-4 flex flex-col justify-between">
      <div>
        {/* HEADER */}
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-black text-white overflow-hidden">
            {data.profileImage ? (
              <img
                src={data.profileImage}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold">
                {data.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {data.name}
            </p>
            <p className="text-xs text-gray-500">
              {typeof data.role === "object" ? data.role.name : ""}
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            User Details
          </h3>

          <div>
            <p className="text-xs font-semibold text-gray-600">
              Full Name
            </p>
            <p className="mt-1 text-sm text-gray-800">
              {data.name}
            </p>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-600">
                Phone Number
              </p>
              <p className="mt-1 text-sm text-gray-800">
                {data.countryCode} {data.phoneNumber}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${data.phoneNumber}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100"
              >
                <Phone size={16} />
              </a>

              <a
                href={`mailto:${data.email}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600">
              Email ID
            </p>
            <p className="mt-1 text-sm text-gray-800">
              {data.email}
            </p>
          </div>
        </div>
      </div>

      {/* ACTION */}
      <div className="mt-10">
        <button
          type="button"
          onClick={onEdit}
          className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white"
        >
          Edit User
        </button>
      </div>
    </div>
  );
}

function UserEdit({ data }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });


  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || `${data.firstName ?? ""} ${data.lastName ?? ""}`,
        email: data.email,
        phone: data.phoneNumber,
        role: data.role?._id,
      });
    }
  }, [data]);

  const { roles } = useAppSelector((state) => state.roles);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (data?.profileImage) {
      setPreview(data.profileImage);
    } else {
      setPreview("");
    }
  }, [data]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };


  const handleUpdate = async () => {
    await dispatch(
      updateUser({
        id: data._id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        profileImage: imageFile || undefined,
      })
    ).unwrap();
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
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full outline-none text-sm"
              />
            </Field>

            <Field label="Domain ID">
              <input
                type="text"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="Enter Your Domain ID"
                className="w-full outline-none text-sm"
              />
            </Field>

            <Field label="Phone Number">
              <input
                type="number"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="Enter Your Phone Number"
                className="w-full outline-none text-sm"
              />
            </Field>

            <Field label="Role">
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                className="w-full outline-none text-sm bg-transparent"
              >
                <option value="" disabled>Select Role</option>
                {roles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Password">
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value="********"
                  readOnly
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
            type="button"
            onClick={handleUpdate}
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
  const dispatch = useAppDispatch();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const BLOCKED_DOMAINS = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "live.com",
    "msn.com",
    "aol.com",
    "icloud.com",
    "mail.com",
    "protonmail.com",
    "yandex.com",
    "zoho.com",
    "rediffmail.com",
    "inbox.com",
    "gmx.com",
    "yopmail.com"
  ];
  const [emailError, setEmailError] = useState<string>("");


  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const validateEmailDomain = (email: string) => {
    if (!email.includes("@")) {
      setEmailError("Invalid email format");
      return false;
    }

    const domain = email.split("@")[1]?.toLowerCase().trim();

    if (BLOCKED_DOMAINS.includes(domain)) {
      setEmailError("Please enter a valid company email address");
      return false;
    }

    setEmailError("");
    return true;
  };


  const handleCreate = async () => {
    if (!validateEmailDomain(form.email)) return;
    const fd = new FormData();

    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("password", form.password);
    fd.append("role", form.role);

    if (imageFile) {
      fd.append("profileImage", imageFile);
    }

    await dispatch(createUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: form.role,
    })).unwrap();

  };

  const { roles } = useAppSelector((state) => state.roles);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);


  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
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
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter Name"
                className="w-full outline-none text-sm"
              />
            </Field>

            <Field label="Email ID">
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (emailError) setEmailError("");
                }}
                onBlur={(e) => validateEmailDomain(e.target.value)}
                placeholder="Enter Email"
                className="w-full outline-none text-sm"
              />
              {emailError && (
                <span className="text-xs text-red-500">{emailError}</span>
              )}
            </Field>

            <Field label="Phone Number">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="+91 000 000 0000"
                className="w-full outline-none text-sm"
              />
            </Field>

            <Field label="Role">
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                className="w-full outline-none text-sm bg-transparent">
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Password">
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
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
            type="button"
            onClick={handleCreate}
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

  const dispatch = useAppDispatch();
  const { selectedUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    if ((mode === "view" || mode === "edit") && data?._id) {
      dispatch(fetchUserById(data._id));
    }
  }, [mode, data, dispatch]);

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
              data={selectedUser}
              onEdit={() => setMode("edit")}
            />
          )}

          {mode === "edit" && <UserEdit data={selectedUser} />}
          {mode === "create" && <UserCreate />}
        </div>
      </SheetContent>
    </Sheet>
  );
}