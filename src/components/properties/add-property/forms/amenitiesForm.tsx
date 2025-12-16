"use client"

import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function AddAmenitiesForm() {
  const [amenity, setAmenity] = useState("");
  const [amenities, setAmenities] = useState([
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
  ]);

  const addAmenity = () => {
    const value = amenity.trim();
    if (!value) return;
    if (amenities.includes(value)) return;

    setAmenities([...amenities, value]);
    setAmenity("");
  };

  const removeAmenity = (item:string) => {
    setAmenities(amenities.filter((a) => a !== item));
  };

  return (
    <div className="bg-white p-6">
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
              onKeyDown={(e) => e.key === "Enter" && addAmenity()}
              placeholder="Ex: Swimming Pool"
              className="flex-1 rounded-lg py-2 text-sm outline-none"
            />

            <button
              type="button"
              onClick={addAmenity}
              className="rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-medium text-black flex gap-2 items-center"
            >
              Add 
              <Plus size={16} strokeWidth={1}/>
            </button>
          </div>
        </fieldset>

        <p className="px-3 text-xs text-gray-400">
          Enter one amenity at a time.
        </p>
      </div>

      {amenities.length > 0 && (
        <div className="mx-auto mt-4 max-w-6xl">
          <div className="flex flex-wrap gap-2">
            {amenities.map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-sm text-gray-700"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeAmenity(item)}
                  className="text-black"
                >
                  <X size={16} strokeWidth={1}/>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}