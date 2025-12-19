"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function ConnectivityForm() {
  const { watch, setValue } = useFormContext<any>();

  const schools: string[] = watch("schoolsNearby") || [];
  const [school, setSchool] = useState("");

  const addSchool = () => {
    const value = school.trim();
    if (!value) return;
    if (schools.includes(value)) return;

    setValue("schoolsNearby", [...schools, value], {
      shouldValidate: true,
    });

    setSchool("");
  };

  const removeSchool = (item: string) => {
    setValue(
      "schoolsNearby",
      schools.filter((s) => s !== item),
      { shouldValidate: true }
    );
  };

  return (
    <div className="p-4 ">
      <h1 className="font-medium text-sm">Project Location</h1>

      <div className="mx-auto py-4 pb-2 border-gray-400">
        <fieldset className="rounded-md border bg-white px-3 pt-1 pb-2 ">
          <legend className="text-xs font-semibold text-gray-700">
            Add Schools nearby <span className="text-red-400">*</span>
          </legend>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSchool();
                }
              }}
              placeholder="Ex: School"
              className="flex-1 rounded-lg py-2 text-sm focus:outline-none"
            />

            <button
              type="button"
              onClick={addSchool}
              className="rounded-lg bg-gray-100 px-4 py-1 p text-sm font-medium text-gray-600 hover:bg-gray-200"
            >
              Add +
            </button>
          </div>
        </fieldset>

        {schools.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {schools.map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-sm text-gray-700"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeSchool(item)}
                  className="text-black"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
