"use client";

import { Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function AddHighlightsForm() {
  const { watch, setValue } = useFormContext<any>();

  const highlights: string[] = watch("highlights") || [
    "Landscaped park with children’s play area",
    "Futuristically Planned Sewage & Solid waste disposal",
    "Under Ground Electrical Cabling",
    "Project Approved By CUDA, Municipal E Katha With RERA Approved",
  ];

  const [value, setValueLocal] = useState("");
  const [showHighlight, setShowHightlight] = useState(false);

  const addHighlight = () => {
    const v = value.trim();
    if (!v) return;
    if (highlights.includes(v)) return;

    setValue("highlights", [...highlights, v], {
      shouldValidate: true,
    });

    setValueLocal("");
    setShowHightlight(false);
  };

  const removeHighlight = (item: string) => {
    setValue(
      "highlights",
      highlights.filter((h) => h !== item),
      { shouldValidate: true }
    );
  };

  return (
    <div className="bg-white p-4">
      <div className="mx-auto max-w-6xl space-y-3">
        {highlights.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-md bg-blue-50 px-4 py-3 text-sm text-gray-800"
          >
            <span>{item}</span>

            <button
              type="button"
              onClick={() => removeHighlight(item)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}

        {showHighlight && (
          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValueLocal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHighlight()}
              placeholder="Enter here"
              className="flex-1 text-sm outline-none"
            />

            {value ? (
              <button type="button" onClick={addHighlight} className="ml-2">
                <Check className="size-4 text-green-500 hover:text-green-700" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowHightlight(false)}
                className="ml-2"
              >
                <X className="size-4 text-red-500 hover:text-red-700" />
              </button>
            )}
          </div>
        )}

        <div
          className={`rounded-xl border-2 border-dashed py-5 transition
           ${showHighlight
              ? "border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed"
              : "border-blue-400 bg-blue-50/40 hover:bg-blue-50"}
            `}>

          <button
            type="button"
            onClick={() => {
              if (showHighlight) return;
              setShowHightlight(true);
            }}
            className="mx-auto flex items-center justify-center gap-2 text-xs font-medium text-gray-700 hover:text-black"
          >
            <Plus className="size-5" />
            Add highlight Point
          </button>
        </div>
      </div>
    </div>
  );
}
