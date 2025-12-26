"use client";

import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import GoogleMapComponent from "./map/googleMap";

type ConnectivityItem = {
  name: string;
  latitude: number;
  longitude: number;
};

type ConnectivityCategoryKey =
  | "schools"
  | "hospitals"
  | "transportation"
  | "restaurants";

type ConnectivityPayload = Record<ConnectivityCategoryKey, ConnectivityItem[]>;

const CONNECTIVITY_CATEGORIES = [
  {
    key: "schools",
    label: "Add schools nearby",
    title: "Schools",
    placeholder: "Ex: DPS School",
  },
  {
    key: "hospitals",
    label: "Add hospitals nearby",
    title: "Hospitals",
    placeholder: "Ex: Apollo Hospital",
  },
  {
    key: "transportation",
    label: "Add transportation nearby",
    title: "Transportation",
    placeholder: "Ex: HUDA Metro Station",
  },
  {
    key: "restaurants",
    label: "Add restaurants nearby",
    title: "Restaurants",
    placeholder: "Ex: Starbucks",
  },
] as const;

export default function ConnectivityForm() {
  const { watch, setValue } = useFormContext<any>();

  const connectivity: ConnectivityPayload = watch("connectivity") ?? {
    schools: [],
    hospitals: [],
    transportation: [],
    restaurants: [],
  };

  const [activeCategory, setActiveCategory] =
    useState<ConnectivityCategoryKey>("schools");

  const [inputs, setInputs] = useState<Record<ConnectivityCategoryKey, string>>(
    {
      schools: "",
      hospitals: "",
      transportation: "",
      restaurants: "",
    }
  );

  const [selectedCoords, setSelectedCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const addItem = (key: ConnectivityCategoryKey) => {
    const name = inputs[key].trim();
    if (!name || !selectedCoords) return;

    const current = connectivity[key];

    if (current.some((i) => i.name === name)) return;

    const newItem: ConnectivityItem = {
      name,
      latitude: selectedCoords.latitude,
      longitude: selectedCoords.longitude,
    };

    setValue(`connectivity.${key}`, [...current, newItem], {
      shouldValidate: true,
    });

    setInputs((prev) => ({ ...prev, [key]: "" }));
    setSelectedCoords(null);
  };

  const removeItem = (key: ConnectivityCategoryKey, name: string) => {
    setValue(
      `connectivity.${key}`,
      connectivity[key].filter((i) => i.name !== name),
      { shouldValidate: true }
    );
  };

  const mapMarkers = useMemo(() => {
    return Object.values(connectivity)
      .flat()
      .map((item) => ({
        lat: item.latitude,
        lng: item.longitude,
        title: item.name,
      }));
  }, [connectivity]);

  const mapCenter = mapMarkers[0] ?? { lat: 28.4089, lng: 77.0418 };

  const activeConfig = CONNECTIVITY_CATEGORIES.find(
    (c) => c.key === activeCategory
  )!;

  const items = connectivity[activeCategory];

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="font-medium text-sm mb-2">Nearby Connectivity</h1>

        <div className="h-[220px] w-full rounded-lg overflow-hidden">
          <GoogleMapComponent
            center={mapCenter}
            markers={mapMarkers}
            onMapClick={({ lat, lng }) =>
              setSelectedCoords({
                latitude: lat,
                longitude: lng,
              })
            }
          />
        </div>
      </div>

      <div className="flex gap-4 border-b">
        {CONNECTIVITY_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 text-sm font-medium ${
              activeCategory === cat.key
                ? "border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <fieldset className="rounded-md border bg-white px-3 pt-1 pb-2">
        <legend className="px-1">
          {activeConfig?.label} <span className="text-red-500">*</span>
        </legend>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputs[activeCategory]}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                [activeCategory]: e.target.value,
              }))
            }
            placeholder={activeConfig.placeholder}
            className="flex-1 rounded-lg py-2 text-sm focus:outline-none"
          />

          <button
            type="button"
            disabled={!selectedCoords}
            onClick={() => addItem(activeCategory)}
            className={`rounded-lg px-4 py-1 text-sm font-medium ${
              selectedCoords
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
          >
            Add +
          </button>
        </div>
      </fieldset>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item.name}
              className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-sm text-gray-700"
            >
              {item.name}
              <button
                type="button"
                onClick={() => removeItem(activeCategory, item.name)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
