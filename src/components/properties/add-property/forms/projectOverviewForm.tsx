"use client";

import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PropertyFormValues } from "@/schema/property/propertySchema";
import { useEffect, useState } from "react";
import CustomDropdown from "@/components/custom/dropdawn";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { fetchDevelopers } from "@/lib/features/developers/developerApi";
import { ConfigurationCard } from "./configurationCard";

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
      <fieldset className="border border-black px-4 py-3 rounded-md">
        <legend className="text-xs font-semibold text-gray-700 ml-2">
          {label}
          <span className="text-red-400">*</span>
        </legend>
        {children}
      </fieldset>
      {error && (
        <p className="text-[11px] text-red-500">This field is required</p>
      )}
    </div>
  );
}

export default function AddProjectOverviewForm() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<PropertyFormValues>();

  const handleReraFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setValue("reraQrImage", {
      url: URL.createObjectURL(files[0]),
      isCover: true,
      order: 1,
    });
  };

  const [configuration, setConfiguration] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchDevelopers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const { developers } = useAppSelector((state: RootState) => state.developers);

  const bhkOptions = [
    "1 BHK",
    "1.5 BHK",
    "2 BHK",
    "2.5 BHK",
    "3 BHK",
    "3.5 BHK",
    "4 BHK",
    "4.5 BHK",
    "5.5 BHK",
    "6 BHK",
    "6.5 BHK",
    "7 BHK",
  ];

  const [selectDeveloperId, setselectDeveloperId] = useState("");
  const { control } = useFormContext<PropertyFormValues>();

  const {
    fields: configurations,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "configurations",
  });

  useEffect(() => {
    selectDeveloperId && setValue("developer", selectDeveloperId);
  }, [selectDeveloperId]);

  return (
    <main className="p-4 h-[87vh]  overflow-y-auto">
      <div className="grid gap-6 md:grid-cols-3">
        <Field label="Project Name" error={errors.projectName}>
          <input
            className="w-full outline-none"
            {...register("projectName", { required: true })}
          />
        </Field>

        <Field label="Developer" error={errors.developer}>
          <div>
            <CustomDropdown
              items={developers.map((d) => ({
                label: d.developerName,
                value: d._id,
              }))}
              onSelect={(item) => {
                if (typeof item !== "string") {
                  setselectDeveloperId(item.value);
                }
              }}
              bordernone={true}
            />
          </div>
        </Field>

        <Field label="Location " error={errors.location}>
          <input
            className="w-full outline-none"
            {...register("location", { required: true })}
          />
        </Field>

        <Field label="Project Size " error={errors.projectSize}>
          <input
            className="w-full outline-none"
            {...register("projectSize", { required: true })}
          />
        </Field>

        <Field label="Land Parcel " error={errors.landParcel}>
          <input
            className="w-full outline-none"
            {...register("landParcel", { required: true })}
          />
        </Field>

        <Field label="Possession Date " error={errors.possessionDate}>
          <input
            type="date"
            className="w-full outline-none"
            {...register("possessionDate", { required: true })}
          />
        </Field>

        <Field label="Developer Price " error={errors.developerPrice}>
          <input
            className="w-full outline-none"
            {...register("developerPrice", { required: true })}
          />
        </Field>

        <Field label="Offer Price " error={errors.offerPrice}>
          <input
            className="w-full outline-none"
            {...register("offerPrice", { required: true })}
          />
        </Field>

        <Field label="Required Group Members " error={errors.minGroupMembers}>
          <input
            type="number"
            className="w-full outline-none"
            {...register("minGroupMembers", { required: true })}
          />
        </Field>

        <Field label="RERA ID " error={errors.reraId}>
          <input
            className="w-full outline-none"
            {...register("reraId", { required: true })}
          />
        </Field>

        <div className="">
          <Field label="RERA QR Code" error={errors.reraQrImage}>
            <input
              type="file"
              className="w-full outline-none"
              onChange={(e) => handleReraFile(e.target.files)}
            />
          </Field>
        </div>

        <Field label={`Possession Status`} error={errors.possessionStatus}>
          <CustomDropdown
            items={["Ready To Move", "Under Construction"]}
            placeholder="Select status"
            onSelect={(item) => {
              if (typeof item === "string") {
                setValue("possessionStatus", item);
              }
            }}
            bordernone={true}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="description " error={errors.overview}>
          <textarea
            rows={4}
            {...register("description", { required: true })}
            className="w-full outline-none resize-none"
          />
        </Field>
      </div>

      {configurations.map((_, index) => (
        <ConfigurationCard
          key={_.id}
          index={index}
          control={control}
          register={register}
          setValue={setValue}
          removeConfig={remove}
        />
      ))}

      <div
        onClick={() => {
          setConfiguration(true);
          append({
            unitType: "",
            subConfiguration: [],
            availabilityStatus: "Available",
          });
        }}
        className="mt-8 rounded-xl border border-[#1849D6] border-dashed bg-[#F4F8FF] py-5 text-center flex flex-col items-center justify-center"
      >
        <Plus />
        <p className="mt-2 text-sm text-gray-500">Add Configuration</p>
      </div>
    </main>
  );
}
