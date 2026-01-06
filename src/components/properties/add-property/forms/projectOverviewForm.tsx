"use client";

import { File, FileImage, Plus, Search, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PropertyFormValues } from "@/schema/property/propertySchema";
import { useEffect, useState } from "react";
import CustomDropdown from "@/components/custom/dropdawn";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { fetchDevelopers } from "@/lib/features/developers/developerApi";
import { ConfigurationCard } from "./configurationCard";
import file from "@/assets/file.svg";
import { numberToWords } from "@/utils/numbertoWord";

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

export default function AddProjectOverviewForm({ readOnly = false }: { readOnly?: boolean }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PropertyFormValues>();
  const developerPrice = watch("developerPrice");
  const offerPrice = watch("offerPrice");


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

  const [locationSearch, setLocationSearch] = useState("");

  useEffect(() => {
    const loc = watch("location");
    if (loc) {
      setLocationSearch(loc);
    }
  }, [watch("location")]);

  const reraFromApi = watch("reraQrImage");

  useEffect(() => {
    if (typeof reraFromApi === "string" && reraFromApi) {
      setReraFileImg({
        filename: reraFromApi,
        state: true,
      });
    }
  }, [reraFromApi]);

  const {
    fields: configurations,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: "configurations",
  });

  useEffect(() => {
    const configs = watch("configurations");

    if (configs && Array.isArray(configs) && configs.length > 0) {
      replace(configs);
    }
  }, []);


  const possessionDate = watch("possessionDate");

  useEffect(() => {
    if (possessionDate && possessionDate.includes("T")) {
      const formatted = possessionDate.split("T")[0];
      setValue("possessionDate", formatted);
    }
  }, [possessionDate]);

  const possessionStatus = watch("possessionStatus");

  const developerId = watch("developer");

  useEffect(() => {
    selectDeveloperId && setValue("developer", selectDeveloperId);
  }, [selectDeveloperId]);


  async function handleLocationSearch() {
    if (!locationSearch) return;

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          "X-Goog-FieldMask":
            "places.displayName,places.location,places.formattedAddress",
        },
        body: JSON.stringify({
          textQuery: locationSearch,
        }),
      }
    );

    const data = await response.json();
    const place = data?.places?.[0];

    if (!place) return;

    // ✅ Set form values
    setValue("location", place.formattedAddress || locationSearch, {
      shouldValidate: true,
    });

    setValue("latitude", place.location.latitude, {
      shouldValidate: true,
    });

    setValue("longitude", place.location.longitude, {
      shouldValidate: true,
    });

  }


  return (
    <main className="p-4 h-[84vh] pb-10  overflow-y-auto">
      <div className="grid gap-6 md:grid-cols-3">
        <Field
          label="Project Name"
          description="Official project name."
          error={errors.projectName}
        >
          <input
            className="w-full outline-none"
            {...register("projectName", { required: true })}
            readOnly={readOnly}
            disabled={readOnly}
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
                  setValue("developer", item.value);
                }
              }}
              placeholder={
                developers.find((d) => d._id === developerId)?.developerName
                || "Select Developer"
              }
              bordernone={true}
            />
          </div>
        </Field>

        <Field
          label="Location"
          description="Primary area or landmark"
          error={errors.location}
        >
          <div className="relative">
            <input
              type="text"
              className="w-full outline-none pr-10"
              value={locationSearch}
              placeholder="Search location"
              onChange={(e) => setLocationSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLocationSearch();
                }
              }}
              disabled={readOnly}
              readOnly={readOnly}
            />

            <button
              type="button"
              onClick={handleLocationSearch}
              className="absolute right-8 top-1/2 -translate-y-1/2"
            >
              <Search size={16} />
            </button>

            <button
              type="button"
              onClick={() => setLocationSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X size={16} />
            </button>
          </div>
        </Field>


        <Field
          label="Project Size "
          description="Towers and unit count"
          error={errors.projectSize}
        >
          <input
            className="w-full outline-none"
            {...register("projectSize", { required: true })}
            readOnly={readOnly}
            disabled={readOnly}
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
            readOnly={readOnly}
            disabled={readOnly}
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
            readOnly={readOnly}
            disabled={readOnly}
          />
        </Field>

        <Field
          label="Developer Price "
          description="Official listed price"
          error={errors.developerPrice}
        >
          <div className="relative">
            <input
              className="w-full outline-none"
              {...register("developerPrice", { required: true })}
              readOnly={readOnly}
              disabled={readOnly}
            />

            {developerPrice && (
              <p className="absolute top-full mt-8 text-xs text-[#9A9A9A] truncate w-full">
                {numberToWords(developerPrice)}
              </p>
            )}
          </div>
        </Field>

        <Field
          label="Offer Price"
          description="Special negotiated price for group-buy members"
          error={errors.offerPrice}
        >
          <div className="relative">
            <input
              className="w-full outline-none"
              {...register("offerPrice", { required: true })}
              readOnly={readOnly}
              disabled={readOnly}
            />

            {offerPrice && (
              <p className="absolute top-full mt-8 text-xs text-[#9A9A9A] truncate w-full">
                {numberToWords(offerPrice)}
              </p>
            )}
          </div>
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
            readOnly={readOnly}
            disabled={readOnly}
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
            readOnly={readOnly}
            disabled={readOnly}
          />
        </Field>

        {/* <div className=" ">
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
        </div> */}

        <div className=" ">
          {!reraFileImg?.state ? (
            <Field
              label="RERA QR Code"
              description="Upload project’s RERA QR"
              error={errors.reraQrImage}
            >
              <label
                htmlFor="rera-upload"
                className="w-full flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                {/* icon */}
                <div className="relative">
                  <img src={file.src} className="size-4" />
                  <span className="absolute text-[6px] top-1 left-1 font-bold text-white">
                    IMG
                  </span>
                </div>
                <span>Choose file</span>
              </label>

              <input
                id="rera-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleReraFile(e.target.files)}
              />
            </Field>
          ) : (
            <div className="px-4 py-4 mt-2 rounded-md bg-gray-100 border border-gray-400 border-dashed flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img src={file.src} className="size-5" />
                  <span className="absolute text-[6px] top-2 left-1 font-bold text-white">
                    PNG
                  </span>
                </div>
                <div className="w-40 truncate">{reraFileImg.filename}</div>
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
            placeholder={possessionStatus || "Select status"}
            onSelect={(item) => {
              if (readOnly) return;
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
            readOnly={readOnly}
            disabled={readOnly}
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
