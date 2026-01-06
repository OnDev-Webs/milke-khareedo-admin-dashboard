"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function AddAmenitiesForm() {
  const { watch, setValue } = useFormContext<any>();

  const amenities: string[] = watch("amenities") || [
    "Fitness Center",
    "Library",
    "Security Guard",
    "Yoga & Meditation Rooms",
    "Spa Services",
    "Club House",
    "24/7 Security",
    "Housekeeping services",
    "Parking",
    "Swimming Pool",
    "24/7 Power Backup",
  ];

  const [amenity, setAmenity] = useState("");

  const addAmenity = () => {
    const value = amenity.trim();
    if (!value) return;
    if (amenities.includes(value)) return;

    setValue("amenities", [...amenities, value], {
      shouldValidate: true,
    });

    setAmenity("");
  };

  const removeAmenity = (item: string) => {
    setValue(
      "amenities",
      amenities.filter((a) => a !== item),
      { shouldValidate: true }
    );
  };

  const isDisabled = !amenity.trim();

  return (
    <div className="bg-white p-3">
      <div className="mx-auto max-w-6xl border-b border-gray-400 pb-2">
        <fieldset className="rounded-md border bg-white px-3 pt-1 pb-2">
          <legend className="text-xs font-semibold text-gray-700">
            Add Amenities*
          </legend>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={amenity}
              onChange={(e) => setAmenity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAmenity();
                }
              }}
              placeholder="Ex: Swimming Pool"
              className="flex-1 rounded-lg py-2 text-[15px] text-black font-medium outline-none"
            />
            <button
              type="button"
              disabled={isDisabled}
              onClick={addAmenity}
              className={`rounded-lg px-4 py-1 text-sm font-medium flex gap-2 items-center transition
              ${isDisabled
                  ? "bg-[#F8F8F8] text-[#AFAFAF] border border-[#DCDCDC] cursor-not-allowed"
                  : "bg-black text-white border border-[#DCDCDC] hover:bg-gray-900"
                }
              `}
            >
              Add
              <Plus size={16} strokeWidth={1} />
            </button>

          </div>
        </fieldset>

        <p className="px-3 text-xs text-gray-400 pb-2">
          Enter one amenity at a time.
        </p>
      </div>

      {amenities.length > 0 && (
        <div className="mx-auto mt-4 max-w-6xl">
          <div className="flex flex-wrap gap-2">
            {amenities.map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 rounded-md bg-[#F4F8FF] px-3 py-1 text-[14px] font-medium text-[#000000]"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeAmenity(item)}
                  className="text-black"
                >
                  <X size={16} strokeWidth={1} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
