"use client";

import { Plus, Search, X } from "lucide-react";
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

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

export default function AddProjectOverviewForm({ readOnly = false }: { readOnly?: boolean }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PropertyFormValues>();

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const [calendarDate, setCalendarDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const currentMonth = calendarDate.getMonth();
  const currentYear = calendarDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const leadingEmptyDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const hasDeveloperPrice = !!watch("developerPrice");
  const hasOfferPrice = !!watch("offerPrice");

  async function fetchLocationSuggestions(text: string) {
    if (!text) {
      setLocationSuggestions([]);
      return;
    }

    const res = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        },
        body: JSON.stringify({
          input: text,
        }),
      }
    );

    const data = await res.json();
    setLocationSuggestions(data.suggestions || []);
    setShowSuggestions(true);
  }

  const handlePrevMonth = () => {
    setCalendarDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setCalendarDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

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
    dispatch(fetchDevelopers({ page: 1, limit: 1000 }));
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
  } = useFieldArray({ control, name: "configurations", });

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

  async function setLocationFromSuggestion(text: string) {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          "X-Goog-FieldMask": "places.formattedAddress,places.location",
        },
        body: JSON.stringify({
          textQuery: text,
        }),
      }
    );

    const data = await response.json();
    const place = data?.places?.[0];
    if (!place) return;

    setValue("location", place.formattedAddress || text, {
      shouldValidate: true,
    });

    setValue("latitude", place.location.latitude, {
      shouldDirty: true,
    });

    setValue("longitude", place.location.longitude, {
      shouldDirty: true,
    });
  }

  const formatIndianNumber = (value: string) => {
    const num = value.replace(/\D/g, "");
    if (!num) return "";

    const lastThree = num.slice(-3);
    const rest = num.slice(0, -3);

    return rest
      ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
      : lastThree;
  };

  const parseIndianPrice = (value: string | number | null | undefined): number => {
    if (value === null || value === undefined) return 0;

    if (typeof value === "number") return value;

    const v = value.toString().toLowerCase().replace(/,/g, "").trim();

    if (v.includes("crore")) {
      const num = parseFloat(v.replace("crore", "").trim());
      return isNaN(num) ? 0 : Math.round(num * 10000000);
    }

    if (v.includes("lakh")) {
      const num = parseFloat(v.replace("lakh", "").trim());
      return isNaN(num) ? 0 : Math.round(num * 100000);
    }

    const n = Number(v.replace(/[^0-9]/g, ""));
    return isNaN(n) ? 0 : n;
  };

  function formatPriceShort(value: number): string {
    if (!value || value <= 0) return "";

    if (value >= 10000000) {
      const crore = value / 10000000;
      return `${crore % 1 === 0 ? crore : crore.toFixed(1)} crore`;
    }

    if (value >= 100000) {
      const lakh = value / 100000;
      return `${lakh % 1 === 0 ? lakh : lakh.toFixed(1)} lakh`;
    }

    if (value >= 1000) {
      const thousand = value / 1000;
      return `${thousand % 1 === 0 ? thousand : thousand.toFixed(1)} thousand`;
    }

    return value.toString();
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
          <CustomDropdown
            items={developers.map(d => ({
              label: d.developerName,
              value: d._id,
            }))}
            value={developerId || ""}
            onSelect={(item) => {
              if (typeof item !== "string") {
                setValue("developer", item.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            }}
            placeholder="Select Developer"
            bordernone
          />
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
              onChange={(e) => {
                const value = e.target.value;
                setLocationSearch(value);

                if (!value) {
                  setShowSuggestions(false);
                  return;
                }

                fetchLocationSuggestions(value);
                setShowSuggestions(true);
              }}
              disabled={readOnly}
            />

            <button
              type="button"
              onClick={() => {
                if (locationSearch) {
                  setLocationSearch("");
                  setValue("location", "");
                  setShowSuggestions(false);
                } else {
                  handleLocationSearch();
                }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {locationSearch ? <X size={16} /> : <Search size={16} />}
            </button>

            {showSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-md max-h-56 overflow-auto">
                {locationSuggestions.map((item, index) => {
                  const text = item.placePrediction?.text?.text;
                  if (!text) return null;

                  return (
                    <div
                      key={index}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      onClick={async () => {
                        setLocationSearch(text);
                        setShowSuggestions(false);
                        setLocationFromSuggestion(text);
                      }}
                    >
                      {text}
                    </div>
                  );
                })}
              </div>
            )}
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
          error={errors.possessionDate}>
          <div className="relative">
            {/* INPUT BUTTON */}
            <button
              type="button"
              onClick={() => {
                if (!readOnly) setDatePickerOpen(prev => !prev);
              }}
              className={`w-full text-left outline-none text-sm py-1 ${errors.possessionDate ? "border-red-500" : ""}`}
            >
              {possessionDate || "Select date"}
            </button>

            {datePickerOpen && (
              <div className="absolute left-0 top-full mt-2 z-50 bg-white border rounded-xl shadow-lg p-4 w-[320px]">
                <p className="text-sm font-semibold mb-2">Select Date</p>
                {/* MONTH NAV */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="bg-[#F3F8FE] px-3 py-0.5 rounded-full"
                  >
                    ‹
                  </button>

                  <p className="text-[16px] font-semibold">
                    {MONTHS[currentMonth]} {currentYear}
                  </p>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="bg-[#F3F8FE] px-3 py-0.5 rounded-full"
                  >
                    ›
                  </button>
                </div>

                {/* DAYS HEADER */}
                <div className="grid grid-cols-7 gap-2 text-center text-xs mb-1">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
                    <span key={d} className="text-gray-400">{d}</span>
                  ))}
                </div>

                {/* DAYS */}
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {Array.from({ length: leadingEmptyDays }).map((_, i) => {
                    const day = prevMonthDays - leadingEmptyDays + i + 1;
                    return (
                      <div
                        key={`prev-${i}`}
                        className="h-8 w-8 flex items-center justify-center text-gray-300"
                      >
                        {day}
                      </div>
                    );
                  })}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;

                    const isSelected =
                      tempSelectedDate?.day === day &&
                      tempSelectedDate?.month === currentMonth &&
                      tempSelectedDate?.year === currentYear;

                    const isToday =
                      day === todayDay &&
                      currentMonth === todayMonth &&
                      currentYear === todayYear;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() =>
                          setTempSelectedDate({
                            day,
                            month: currentMonth,
                            year: currentYear,
                          })
                        }
                        className={`h-8 w-8 rounded-md transition
                        ${isSelected
                            ? "bg-black text-white"
                            : isToday
                              ? "border border-black font-semibold"
                              : "hover:bg-black hover:text-white"
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}

                  {Array.from({
                    length: (7 - ((leadingEmptyDays + daysInMonth) % 7)) % 7,
                  }).map((_, i) => (
                    <div
                      key={`next-${i}`}
                      className="h-8 w-8 flex items-center justify-center text-gray-300"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setDatePickerOpen(false)}
                    className="flex-1 bg-gray-200 py-2 rounded-lg">
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!tempSelectedDate) {
                        setValue("possessionDate", "", { shouldValidate: true });
                        return;
                      }

                      const dateObj = new Date(
                        tempSelectedDate.year,
                        tempSelectedDate.month,
                        tempSelectedDate.day
                      );

                      const formatted = dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      setValue("possessionDate", formatted, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });

                      setDatePickerOpen(false);
                    }}
                    className="flex-1 bg-black text-white py-2 rounded-lg">
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </Field>

        <Field
          label="Starting Developer Price"
          description={
            !hasDeveloperPrice
              ? "Official listed price"
              : undefined
          }
          error={errors.developerPrice}
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black text-[16px] font-medium">
              ₹
            </span>

            <input
              className="w-full outline-none pl-7"
              placeholder="0,00,00,000"
              {...register("developerPrice", { required: true })}
              readOnly={readOnly}
              disabled={readOnly}
              onBlur={(e) => {
                const val = e.target.value.toLowerCase().trim();
                if (val.includes("crore") || val.includes("lakh")) return;
                const formatted = formatIndianNumber(val);
                if (formatted) {
                  setValue("developerPrice", formatted, { shouldDirty: true });
                }
              }}
            />

            {hasDeveloperPrice && (
              <p className="absolute top-full mt-4 text-xs text-[#9A9A9A]">
                {formatPriceShort(parseIndianPrice(watch("developerPrice")))}
              </p>
            )}
          </div>
        </Field>

        <Field
          label="Starting Offer Price"
          description={
            !hasOfferPrice
              ? "Special negotiated price for group-buy members"
              : undefined
          }
          error={errors.offerPrice}
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black text-[16px] font-medium">
              ₹
            </span>

            <input
              className="w-full outline-none pl-7"
              placeholder="0,00,00,000"
              {...register("offerPrice", { required: true })}
              readOnly={readOnly}
              disabled={readOnly}
              onBlur={(e) => {
                const val = e.target.value.toLowerCase().trim();
                if (val.includes("crore") || val.includes("lakh")) return;
                const formatted = formatIndianNumber(val);
                if (formatted) {
                  setValue("offerPrice", formatted, { shouldDirty: true });
                }
              }}
            />

            {hasOfferPrice && (
              <p className="absolute top-full mt-4 text-xs text-[#9A9A9A]">
                {formatPriceShort(parseIndianPrice(watch("offerPrice")))}
              </p>
            )}
          </div>
        </Field>

        <Field
          label="Required Group Members"
          description="Minimum buyers needed"
          error={errors.minGroupMembers}
        >
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full outline-none"
            placeholder="00"
            readOnly={readOnly}
            disabled={readOnly}
            {...register("minGroupMembers", {
              required: true,
              min: 1,
              valueAsNumber: true,
              onChange: (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              },
            })}
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
          label="Possession Status"
          description="Project stage"
          error={errors.possessionStatus}
        >
          <CustomDropdown
            items={["Ready To Move", "Under Construction"]}
            value={possessionStatus || ""}
            onSelect={(item) => {
              if (typeof item === "string") {
                setValue("possessionStatus", item, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            }}
            placeholder="Select status"
            bordernone
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field
          label="Description "
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
