"use client";

import { File, FileImage, Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PropertyFormValues } from "@/schema/property/propertySchema";
import { useEffect, useState } from "react";
import CustomDropdown from "@/components/custom/dropdawn";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { fetchDevelopers } from "@/lib/features/developers/developerApi";
import { ConfigurationCard } from "./configurationCard";
import file from "@/assets/file.svg";

function Field({
  label,
  error,
  children,
  description,
}: {
  label: string;
  error?: any;
  description?: string;
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
      {error ? (
        <p className="px-6 text-[11px] text-red-500">This field is required</p>
      ) : (
        <p className="px-6 text-[13px] font-normal text-[#565656] ">
          {description}
        </p>
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
    setValue("reraQrImage", files[0], { shouldValidate: true });
    setReraFileImg({
      filename: files[0].name,
      state: true,
    });
  };

  const removeReraFile = () => {
    setValue("reraQrImage", undefined, { shouldValidate: true });
    setReraFileImg({ filename: "", state: false });
  };

  const [reraFileImg, setReraFileImg] = useState({
    filename: "",
    state: false,
  });

  const [configuration, setConfiguration] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchDevelopers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const { developers } = useAppSelector((state: RootState) => state.developers);

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
    <main className="p-4 h-[87vh] pb-10  overflow-y-auto">
      <div className="grid gap-6 md:grid-cols-3">
        <Field
          label="Project Name"
          description="Official project name."
          error={errors.projectName}
        >
          <input
            className="w-full outline-none"
            {...register("projectName", { required: true })}
          />
        </Field>

        <Field
          label="Developer"
          description="Select Registered Developer"
          error={errors.developer}
        >
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

        <Field
          label="Location "
          description="Primary area or landmark"
          error={errors.location}
        >
          <input
            className="w-full outline-none"
            {...register("location", { required: true })}
          />
        </Field>

        <Field
          label="Project Size "
          description="Towers and unit count"
          error={errors.projectSize}
        >
          <input
            className="w-full outline-none"
            {...register("projectSize", { required: true })}
          />
        </Field>

        <Field
          label="Land Parcel "
          description="Total land size"
          error={errors.landParcel}
        >
          <input
            className="w-full outline-none"
            {...register("landParcel", { required: true })}
          />
        </Field>

        <Field
          label="Possession Date "
          description="Expected possession date"
          error={errors.possessionDate}
        >
          <input
            type="date"
            className="w-full outline-none"
            {...register("possessionDate", { required: true })}
          />
        </Field>

        <Field
          label="Developer Price "
          description="Official listed price"
          error={errors.developerPrice}
        >
          <input
            className="w-full outline-none"
            {...register("developerPrice", { required: true })}
          />
        </Field>

        <Field
          label="Offer Price "
          description="Special negotiated price for group-buy members"
          error={errors.offerPrice}
        >
          <input
            className="w-full outline-none"
            {...register("offerPrice", { required: true })}
          />
        </Field>

        <Field
          label="Required Group Members "
          description="Minimum buyers needed"
          error={errors.minGroupMembers}
        >
          <input
            type="number"
            className="w-full outline-none"
            {...register("minGroupMembers", { required: true })}
          />
        </Field>

        <Field
          label="RERA ID "
          description="Valid RERA registration"
          error={errors.reraId}
        >
          <input
            className="w-full outline-none"
            {...register("reraId", { required: true })}
          />
        </Field>

        <div className=" ">
          {!reraFileImg?.state ? (
            <Field
              label="RERA QR Code"
              description="Upload project’s RERA QR"
              error={errors.reraQrImage}
            >
              <input
                type="file"
                className="w-full outline-none"
                onChange={(e) => handleReraFile(e.target.files)}
              />
            </Field>
          ) : (
            <div className=" px-4 py-4 mt-2 rounded-md bg-gray-100 border border-gray-400 border-dashed flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={file.src}
                    className="size-5 fill-[#373737] text-white"
                  />
                  <span className="absolute text-[6px] top-2 left-1 font-bold text-white">
                    PNG
                  </span>
                </div>
                <div className="w-40  truncate">{`${reraFileImg?.filename}`}</div>
              </div>

              <X onClick={() => removeReraFile()} size={16} />
            </div>
          )}
        </div>

        <Field
          label={`Possession Status`}
          description="Project stage"
          error={errors.possessionStatus}
        >
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
        <Field
          label="description "
          description="Explain the project in 3–5 lines"
          error={errors.description}
        >
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
            subConfigurations: [],
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
