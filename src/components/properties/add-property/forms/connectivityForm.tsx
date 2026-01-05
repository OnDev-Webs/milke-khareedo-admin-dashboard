"use client";

import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const connectivity = useWatch({
    name: "connectivity",
    defaultValue: {
      schools: [],
      hospitals: [],
      transportation: [],
      restaurants: [],
    },
  });

  const projectLocation = watch("location");
  const [activeCategory, setActiveCategory] = useState<ConnectivityCategoryKey>("schools");

  const [inputs, setInputs] = useState<Record<ConnectivityCategoryKey, string>>({
    schools: "",
    hospitals: "",
    transportation: "",
    restaurants: "",
  });

  const [selectedCoords, setSelectedCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  async function fetchPlaceSuggestions(query: string) {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.location",
        },
        body: JSON.stringify({
          textQuery: query,
        }),
      }
    );
    const data = await response.json();
    setSuggestions(data?.places || []);
    setLoadingSuggestions(false);
  }

  const addItem = (key: ConnectivityCategoryKey) => {
    const name = inputs[key].trim();
    if (!name || !selectedCoords) return;

    const current = connectivity[key];
    if (current.some((i: ConnectivityItem) => i.name === name)) return;

    const newItem: ConnectivityItem = {
      name,
      latitude: selectedCoords.latitude,
      longitude: selectedCoords.longitude,
    };

    setValue(`connectivity.${key}`, [...current, newItem], {
      shouldValidate: true,
    });
    setMapKey((prev) => prev + 1);
    setInputs((prev) => ({ ...prev, [key]: "" }));
    setSelectedCoords({
      latitude: selectedCoords.latitude,
      longitude: selectedCoords.longitude,
    });

  };

  const removeItem = (key: ConnectivityCategoryKey, name: string) => {
    setValue(
      `connectivity.${key}`,
      connectivity[key].filter((i: ConnectivityItem) => i.name !== name),
      { shouldValidate: true }
    );
  };

  const mapCenter = useMemo(() => {
    if (selectedCoords) {
      return {
        lat: selectedCoords.latitude,
        lng: selectedCoords.longitude,
      };
    }

    if (projectLocation?.latitude && projectLocation?.longitude) {
      return {
        lat: projectLocation.latitude,
        lng: projectLocation.longitude,
      };
    }

    return { lat: 28.6139, lng: 77.209 };
  }, [projectLocation, selectedCoords]);

  const mapMarkers = useMemo(() => {
    const categoryMarkers = connectivity[activeCategory].map((item: ConnectivityItem) => ({
      lat: item.latitude,
      lng: item.longitude,
      title: item.name,
    }));

    const mainMarker =
      projectLocation?.latitude && projectLocation?.longitude
        ? [
          {
            lat: projectLocation.latitude,
            lng: projectLocation.longitude,
            title: "Project Location",
            type: "main",
          },
        ] : [];

    return [...mainMarker, ...categoryMarkers];
  }, [connectivity, activeCategory, projectLocation]);

  console.log("markers", mapMarkers);

  const activeConfig = CONNECTIVITY_CATEGORIES.find(
    (c) => c.key === activeCategory
  )!;

  const items = connectivity[activeCategory];

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="font-medium text-sm mb-2">Project Location</h1>
        <div className="h-[220px] w-full rounded-lg relative overflow-hidden">
          <GoogleMapComponent
            key={`${mapKey}-${activeCategory}`}
            center={mapCenter}
            markers={mapMarkers}
            onMapClick={({ lat, lng }) => {
              setValue(
                "location",
                { latitude: lat, longitude: lng },
                { shouldDirty: true }
              );
            }}
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b">
        {CONNECTIVITY_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 text-sm font-medium ${activeCategory === cat.key
              ? "border-b-2 border-black"
              : "text-gray-500 hover:text-black"
              }`}>
            {cat.title}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <fieldset className="rounded-md border bg-white px-3 pt-1 pb-2">
        <legend className="px-1">
          {activeConfig.label} <span className="text-red-500">*</span>
        </legend>
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={inputs[activeCategory]}
            onChange={(e) => {
              const value = e.target.value;
              setInputs((prev) => ({ ...prev, [activeCategory]: value }));
              fetchPlaceSuggestions(value);
            }}
            placeholder={activeConfig.placeholder}
            className="flex-1 rounded-lg py-2 text-sm focus:outline-none"
          />
          {suggestions.length > 0 && (
            <div
              className="absolute left-0 top-full z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border bg-white shadow">
              {suggestions.map((place) => (
                <div
                  key={place.id}
                  onClick={() => {
                    setInputs((prev) => ({
                      ...prev,
                      [activeCategory]: place.displayName?.text || "",
                    }));

                    setSelectedCoords({
                      latitude: place.location.latitude,
                      longitude: place.location.longitude,
                    });

                    setValue(
                      "location",
                      projectLocation ?? {
                        latitude: place.location.latitude,
                        longitude: place.location.longitude,
                      },
                      { shouldDirty: true }
                    );
                    setMapKey((prev) => prev + 1);
                    setSuggestions([]);
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  <p className="text-sm font-medium text-black">
                    {place.displayName?.text}
                  </p>
                  <p className="text-xs text-gray-500">
                    {place.formattedAddress}
                  </p>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            disabled={!selectedCoords}
            onClick={() => addItem(activeCategory)}
            className={`rounded-lg px-4 py-1 text-sm font-medium ${selectedCoords
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-gray-50 text-gray-400 cursor-not-allowed"
              }`}>
            Add +
          </button>
        </div>
      </fieldset>

      {/* CHIPS */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item: ConnectivityItem) => (
            <span
              key={item.name}
              className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-sm text-gray-700">
              {item.name}
              <button
                type="button"
                onClick={() => removeItem(activeCategory, item.name)}>
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}