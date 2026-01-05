"use client";

import uploadImage from "@/assets/upload.svg";
import { ChevronDown, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PropertyFormValues } from "@/schema/property/propertySchema";

export default function AddLayoutPlanForm() {
  const { control, setValue, watch } = useFormContext<PropertyFormValues>();

  const { fields: configurations } = useFieldArray({
    control,
    name: "configurations",
  });

  const [openUnits, setOpenUnits] = useState<Record<string, boolean>>({});

  const layouts = watch("layouts") || {};

  const toggleUnit = (id: string) =>
    setOpenUnits((p) => ({ ...p, [id]: !p[id] }));

  const makeKey = (unitType: string, carpetArea: string) =>
    `${unitType.replace(/\s+/g, "")}_${carpetArea.replace(/\D/g, "")}`;

  const handleUpload = (key: string, files: FileList | null) => {
    if (!files?.length) return;

    const existing = layouts[key] || [];

    setValue("layouts", {
      ...layouts,
      [key]: [...existing, ...Array.from(files)],
    });
  };

  const removeImage = (key: string, index: number) => {
    setValue("layouts", {
      ...layouts,
      [key]: layouts[key].filter((_, i) => i !== index),
    });
  };

  const replaceImage = (key: string, index: number, file: File) => {
    const updated = [...layouts[key]];
    updated[index] = file;

    setValue("layouts", {
      ...layouts,
      [key]: updated,
    });
  };

  return (
    <div className="w-full bg-white p-6 space-y-4 h-[86vh] overflow-y-auto">
      {configurations.map((config) => {
        const isOpen = openUnits[config.id];

        return (
          <div key={config.id} className="rounded-xl">
            <button
              type="button"
              onClick={() => toggleUnit(config.id)}
              className="flex w-full items-center justify-between rounded-xl border bg-indigo-50 px-4 py-3 text-sm font-semibold"
            >
              {config.unitType}
              <ChevronDown
                className={`transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="grid gap-6 py-4 sm:grid-cols-2 md:grid-cols-3">
                {config.subConfigurations?.map((sub, subIndex) => {
                  const key = makeKey(config.unitType, sub.carpetArea);

                  const images: (File | string)[] = layouts[key] || [];

                  return (
                    <div key={subIndex} className="rounded-xl border p-3">
                      {images.length > 0 ? (
                        <div className="rounded-lg overflow-hidden h-56">
                          {images.map((file, i) => {
                            const url =
                              typeof file === "string"
                                ? file
                                : URL.createObjectURL(file);


                            return (
                              <div key={i} className="h-full relative">
                                <img
                                  src={url}
                                  className="w-full h-full rounded object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(key, i)}
                                  className="absolute right-2 top-2 rounded-full text-red-500 bg-white p-2 shadow"
                                >
                                  <Trash2 size={14} />
                                </button>
                                <label className="absolute right-2 top-12 cursor-pointer rounded-full bg-white p-2 shadow">
                                  <SquarePen size={14} />

                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        replaceImage(key, i, file);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-500 bg-blue-50">
                          <Image src={uploadImage} alt="" />
                          <p className="mt-2 text-sm">Upload Layout Photo</p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleUpload(key, e.target.files)}
                          />
                        </label>
                      )}

                      <div className="mt-3 flex justify-between text-sm font-medium">
                        <span>
                          {sub.carpetArea} Ft <sup>2</sup>
                        </span>
                        <span className="text-[#4C4C4C] font-semibold">₹ {(sub.price)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
