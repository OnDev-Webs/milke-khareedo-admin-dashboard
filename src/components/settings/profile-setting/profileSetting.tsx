import homy from "@/assets/homy.png";
import Image from "next/image";
import { useRef, useState } from "react";

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
      <fieldset className="border px-4 pb-1.5 rounded-md">
        <legend className="text-xs px-1 font-semibold text-gray-700">
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

export default function ProfileSettings() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(homy.src);

  const handleEditClick = () => {
    fileRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto w-full">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Edit General Setting
        </h2>

        <form className="space-y-6 w-full">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="relative h-[150px] w-[150px] rounded-2xl overflow-hidden">
                <Image
                  src={preview} 
                  alt="homy"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>

              <button
                type="button"
                onClick={handleEditClick}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-sm bg-gray-900 border border-gray-600 px-1 py-1 text-xs text-white">
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

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="First Name*">
              <input
              placeholder="Enter Your First name"
                className="w-full rounded-lg outline-none text-sm"
              />
            </Field>

            <Field label="Last Name*">
              <input
                placeholder="Enter Your Last Name"
                className="w-full rounded-lg outline-none text-sm"
              />
            </Field>

            <Field label="Email Address*">
              <input
                 placeholder="Enter Your Email Address"
                className="w-full rounded-lg outline-none text-sm"
              />
            </Field>

            <Field label="Phone Number*">
              <input
                 placeholder="Enter Your Phone Number"
                className="w-full rounded-lg outline-none text-sm"
              />
            </Field>

            <Field label="Role*">
              <select className="w-full rounded-lg outline-none text-sm">
                <option>Select Role</option>
                <option>Admin</option>
                <option>Manager</option>
                <option>Agent</option>
              </select>
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-8">
            <button
              type="button"
              className="rounded-lg border px-5 py-2 text-sm font-medium text-gray-700">
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white">
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
