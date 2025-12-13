"use client";

import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

type ProjectOverviewFormValues = {
  projectName: string;
  developer: string;
  location: string;
  projectSize: string;
  landParcel: string;
  possessionDate: string;
  startingDeveloperPrice: string;
  startingOfferPrice: string;
  requiredMembers: string;
  reraId: string;
  possessionStatus: string;
  overview: string;
  reraQr?: FileList;
};

export default function AddProjectOverviewForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectOverviewFormValues>({
    defaultValues: {
      projectName: "Maarq Vista",
      developer: "Maarq Realty",
      location: "Nandi Hills",
      projectSize: "1 Tower / 195 units",
      landParcel: "4.3 Acres",
      possessionDate: "Dec, 2027",
      startingDeveloperPrice: "₹ 5.31 Crore",
      startingOfferPrice: "₹ 4.68 Crore",
      requiredMembers: "10",
      reraId: "PHJ125826426326",
      possessionStatus: "Ready To Move",
      overview:
        "Nestled between Sathya Sai Grama and Chikkaballapur town, VISTA is RERA approved project...",
    },
  });

  const onSubmit = (data: ProjectOverviewFormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <main className="p-4">
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Project Name*" error={errors.projectName}>
            <input
              className="outline-none w-full"
              {...register("projectName", { required: true })}
            />
          </Field>

          <Field label="Developer*" error={errors.developer}>
            <select {...register("developer", { required: true })}>
              <option>Maarq Realty</option>
            </select>
          </Field>

          <Field label="Location*" error={errors.location}>
            <input
              className="outline-none w-full"
              {...register("location", { required: true })}
            />
          </Field>

          <Field label="Project Size*" error={errors.projectSize}>
            <input
              className="outline-none w-full"
              {...register("projectSize", { required: true })}
            />
          </Field>

          <Field label="Land Parcel*" error={errors.landParcel}>
            <input
              className="outline-none w-full"
              {...register("landParcel", { required: true })}
            />
          </Field>

          <Field label="Possession*" error={errors.possessionDate}>
            <input
              className="outline-none w-full"
              {...register("possessionDate", { required: true })}
            />
          </Field>

          <Field
            label="Starting Developer Price*"
            error={errors.startingDeveloperPrice}
          >
            <input
              className="outline-none w-full"
              {...register("startingDeveloperPrice", { required: true })}
            />
          </Field>

          <Field
            label="Starting Offer Price*"
            error={errors.startingOfferPrice}
          >
            <input
              className="outline-none w-full"
              {...register("startingOfferPrice", { required: true })}
            />
          </Field>

          <Field label="Required Group Member*" error={errors.requiredMembers}>
            <input
              className="outline-none w-full"
              {...register("requiredMembers", { required: true })}
            />
          </Field>

          <Field label="RERA ID*" error={errors.reraId}>
            <input
              className="outline-none w-full"
              {...register("reraId", { required: true })}
            />
          </Field>

          <fieldset className="border border-dashed px-4 rounded-md">
            <legend className="text-xs font-semibold text-gray-700">
              RERA QR Code
            </legend>
            <input
              type="file"
              {...register("reraQr")}
              className="w-full text-sm text-gray-500 outline-none"
            />
          </fieldset>

          <Field label="Possession Status*" error={errors.possessionStatus}>
            <select {...register("possessionStatus", { required: true })}>
              <option>Ready To Move</option>
              <option>Under Construction</option>
            </select>
          </Field>
        </div>

        <div className="mt-5">
          <fieldset className="border rounded-md px-3 py-2">
            <legend className="text-xs font-semibold text-gray-700 px-1">
              Overview<span className="text-red-400 ">*</span>
            </legend>
            <textarea
              rows={4}
              {...register("overview", { required: true })}
              className="w-full  outline-none text-sm resize-none"
            />
          </fieldset>
          {errors.overview && (
            <p className="text-[11px] text-red-500">Overview is required</p>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-[#1849D6] border-dashed bg-[#F4F8FF] py-5 text-center flex flex-col items-center justify-center">
          <Plus />
          <p className="mt-2 text-sm text-gray-500">Add Configuration</p>
        </div>

        {/* <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded"
          >
            Save & Continue
          </button>
        </div> */}
      </main>
    </form>
  );
}

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
      <fieldset className="border px-4 py-3 rounded-md">
        <legend className="text-xs font-semibold text-gray-700">{label}</legend>
        {children}
      </fieldset>
      {error && (
        <p className="text-[11px] text-red-500">This field is required</p>
      )}
    </div>
  );
}
