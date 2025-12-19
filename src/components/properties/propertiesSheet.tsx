"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X } from "lucide-react";


export type Property = {
  id: number;
  propertyName: string;
  developer: string;
  city: string;
  groupCount: string;
  amount: number;
  status: string;
};

export type SheetMode = "view" | "edit" | "";


function PropertyView({ property }: { property: Property }) {
  return (
    <div className="h-[91vh] space-y-6 bg-white px-4 py-6 text-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-black text-white">
          <span className="text-sm font-semibold">
            {property.propertyName}
          </span>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            {property.propertyName}
          </p>
          <p className="text-xs text-gray-500">{property.city}</p>
        </div>
      </div>

      <div className="space-y-3">
        <Info label="Developer" value={property.developer} />
        <Info label="Groups" value={property.groupCount} />
        <Info label="Amount" value={`₹ ${property.amount}`} />
        <Info label="Status" value={property.status} />
      </div>

      <button className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white">
        Edit Property
      </button>
    </div>
  );
}


function PropertyEdit({ property }: { property: Property }) {
  return (
    <div className="space-y-4 px-4 py-6">
      <Field label="Property Name">
        <input
          defaultValue={property.propertyName}
          className="w-full text-sm outline-none"
        />
      </Field>

      <Field label="Developer">
        <input
          defaultValue={property.developer}
          className="w-full text-sm outline-none"
        />
      </Field>

      <Field label="City">
        <input
          defaultValue={property.city}
          className="w-full text-sm outline-none"
        />
      </Field>

      <Field label="Groups">
        <input
          defaultValue={property.groupCount}
          className="w-full text-sm outline-none"
        />
      </Field>

      <Field label="Amount">
        <input
          type="number"
          defaultValue={property.amount}
          className="w-full text-sm outline-none"
        />
      </Field>

      <Field label="Status">
        <select
          defaultValue={property.status}
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


// function AddNewProperty() {
//   return (
//     <div className="h-[90vh] overflow-auto bg-white">
//       <div className="mx-auto max-w-2xl px-4 py-6">
//         <form className="space-y-5">
//           <div className="overflow-auto flex items-start gap-4">
//             <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-black text-white">
//               <span className="text-sm font-semibold">homy</span>
//             </div>

//             <div>
//               <p className="text-sm font-medium text-gray-800">
//                 Upload Photo{" "}
//                 <span className="cursor-pointer font-semibold text-blue-600 underline">
//                   browse
//                 </span>
//               </p>
//               <p className="mt-1 text-xs text-gray-500">
//                 Max 10 MB files are allowed
//               </p>

//               <button
//                 type="button"
//                 className="mt-2 rounded-md border px-3 py-1 text-xs text-gray-600"
//               >
//                 Edit Logo
//               </button>
//             </div>
//           </div>
//           <Field label="Property Name*">
//             <input
//               placeholder="Enter property name"
//               className="w-full text-sm outline-none"
//             />
//           </Field>

//           <Field label="Developer*">
//             <input
//               placeholder="Developer name"
//               className="w-full text-sm outline-none"
//             />
//           </Field>

//           <Field label="City*">
//             <input placeholder="City" className="w-full text-sm outline-none" />
//           </Field>

//           <Field label="Total Groups">
//             <input
//               placeholder="e.g. 3"
//               className="w-full text-sm outline-none"
//             />
//           </Field>

//           <Field label="Amount">
//             <input
//               type="number"
//               placeholder="e.g. 1000000"
//               className="w-full text-sm outline-none"
//             />
//           </Field>

//           <Field label="Status">
//             <select className="w-full text-sm outline-none">
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </Field>

//           <button
//             type="submit"
//             className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white"
//           >
//             Add New Property
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


function Info({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </p>
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


export default function PropertiesSheet({ open, setOpen, data, mode }: any) {
  const selectedProperty = data;
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[420px]">
        <SheetHeader className="border-b">
          <SheetTitle>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === "view" && "Property Details"}
                {mode === "edit" && "Edit Property"}
                {mode === "create" && "Add New Property"}
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

        {mode === "view" && <PropertyView property={selectedProperty} />}
        {mode === "edit" && <PropertyEdit property={selectedProperty} />}
        {/* {mode === "create" && <AddNewProperty />} */}
      </SheetContent>
    </Sheet>
  );
}