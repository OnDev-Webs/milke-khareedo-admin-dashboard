"use client";

import { Plus, Trash } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { PropertyFormValues } from "@/schema/property/propertySchema";
import { useEffect, useState } from "react";
import CustomDropdown from "@/components/custom/dropdawn";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { fetchDevelopers } from "@/lib/features/developers/developerApi";

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

export default function AddProjectOverviewForm() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<PropertyFormValues>();

  const handleReraFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setValue("reraQRcode", {
      url: URL.createObjectURL(files[0]),
      isCover: true,
      order: 1,
    });
  };

  const [configuration, setConfiguration] = useState(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchDevelopers({ page: 1, limit: 10 }));
  }, []);
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
  const [open, setOpen] = useState(false);
  const [selectOptionValue, setSelectOptionValue] = useState("");
  const [selectDeveloperId, setselectDeveloperId] = useState("");

  useEffect(() => {
    selectDeveloperId && setValue("developer", selectDeveloperId);
  }, [selectDeveloperId]);

  return (
    <main className="p-4 h-[87vh]  overflow-y-auto">
      <div className="grid gap-6 md:grid-cols-3">
        <Field label="Project Name*" error={errors.projectName}>
          <input
            className="w-full"
            {...register("projectName", { required: true })}
          />
        </Field>

        <Field label="Developer*" error={errors.developer}>

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
            />
          </div>
        </Field>

        <Field label="Location*" error={errors.location}>
          <input
            className="w-full"
            {...register("location", { required: true })}
          />
        </Field>

        <Field label="Project Size*" error={errors.projectSize}>
          <input
            className="w-full"
            {...register("projectSize", { required: true })}
          />
        </Field>

        <Field label="Land Parcel*" error={errors.landParcel}>
          <input
            className="w-full"
            {...register("landParcel", { required: true })}
          />
        </Field>

        <Field label="Possession Date*" error={errors.possessionDate}>
          <input
            type="date"
            className="w-full"
            {...register("possessionDate", { required: true })}
          />
        </Field>

        <Field label="Developer Price*" error={errors.developerPrice}>
          <input
            className="w-full"
            {...register("developerPrice", { required: true })}
          />
        </Field>

        <Field label="Offer Price*" error={errors.offerPrice}>
          <input
            className="w-full"
            {...register("offerPrice", { required: true })}
          />
        </Field>

        <Field label="Required Group Members*" error={errors.minGroupMembers}>
          <input
            type="number"
            className="w-full"
            {...register("minGroupMembers", { required: true })}
          />
        </Field>

        <Field label="RERA ID*" error={errors.reraId}>
          <input
            className="w-full"
            {...register("reraId", { required: true })}
          />
        </Field>

        <div className="">
          <Field label="RERA QR Code" error={errors.reraQRcode}>
            <input
              type="file"
              className="w-full"
              onChange={(e) => handleReraFile(e.target.files)}
            />
          </Field>
        </div>

        <Field label="Possession Status*" error={errors.possessionStatus}>
          
          
          {/* <select {...register("possessionStatus", { required: true })}>
            <option value="Ready To Move">Ready To Move</option>
            <option value="Under Construction">Under Construction</option>
          </select> */}

           <CustomDropdown
              items={['Ready To Move', 'Under Construction']}
              placeholder="Select status"
              onSelect={(item) => {
                if (typeof item === "string") {
                  setValue("possessionStatus",item);
                }
              }}
            />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="description*" error={errors.overview}>
          <textarea
            rows={4}
            {...register("description", { required: true })}
            className="w-full resize-none"
          />
        </Field>
      </div>

      {configuration && (
        <div className="mt-5 border rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center w-full">
            <div className="border rounded-md border-black px-4 py-1 text-sm font-medium">
              {selectOptionValue}
            </div>

            <div className="flex gap-2 items-center">
              <button
                type="button"
                className="px-4 py-1 border border-dashed flex items-center gap-2 rounded-md text-sm"
              >
                Add Sub-Configuration
                <Plus size={16} />
              </button>

              <button
                onClick={() => setConfiguration(false)}
                className="bg-orange-500 p-2 rounded-md text-white"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-3 items-end">
                <fieldset className="border rounded-md px-3 py-2">
                  <legend className="text-xs font-semibold text-gray-700 px-1">
                    Carpet area <span className="text-red-400">*</span>
                  </legend>
                  <input
                    className="w-full outline-none text-sm"
                    placeholder="3500.00 ft²"
                    value={3500}
                  />
                </fieldset>

                <div className="bg-gray-100 h-12 rounded-md px-3 py-2 text-sm font-semibold text-gray-700">
                  ₹ 1.6 Cr
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-end">
                <fieldset className="border rounded-md px-3 py-2">
                  <legend className="text-xs font-semibold text-gray-700 px-1">
                    Carpet area <span className="text-red-400">*</span>
                  </legend>
                  <input
                    className="w-full outline-none text-sm"
                    placeholder="4100.00 ft²"
                    value={4100}
                  />
                </fieldset>

                <div className="bg-gray-100 h-12 rounded-md px-3 py-2 text-sm font-semibold text-gray-700">
                  ₹ 6.53 Lak
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-3 items-end">
                <fieldset className="border rounded-md px-3 py-2">
                  <legend className="text-xs font-semibold text-gray-700 px-1">
                    Carpet area <span className="text-red-400">*</span>
                  </legend>
                  <input
                    className="w-full outline-none text-sm"
                    placeholder="3640.00 ft²"
                    value={3640}
                  />
                </fieldset>

                <div className="bg-gray-100 h-12 rounded-md px-3 py-2 text-sm font-semibold text-gray-700">
                  ₹ 55.31 Lak
                </div>
              </div>
            </div>
          </div>

          <div className=" pt-2">
            <CustomDropdown
              items={bhkOptions}
              placeholder="Select Configuration"
              onSelect={(item) => {
                if (typeof item === "string") {
                  setSelectOptionValue(item);
                } else {
                  setSelectOptionValue(item.label);
                }
              }}
            />
          </div>
        </div>
      )}
      <div
        onClick={() => setConfiguration(true)}
        className="mt-8 rounded-xl border border-[#1849D6] border-dashed bg-[#F4F8FF] py-5 text-center flex flex-col items-center justify-center"
      >
        <Plus />
        <p className="mt-2 text-sm text-gray-500">Add Configuration</p>
      </div>
    </main>
  );
}
