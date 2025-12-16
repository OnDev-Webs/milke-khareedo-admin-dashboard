"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";

export default function AddHighlightsForm() {
  const [value, setValue] = useState("");
  const [showHighlight, setShowHightlight] = useState(false);
  const [highlights, setHighlights] = useState([
    "Landscaped park with children’s play area",
    "Futuristically Planned Sewage & Solid waste disposal",
    "Under Ground Electrical Cabling",
    "Project Approved By CUDA, Municipal E Katha With RERA Approved",
  ]);

  const addHighlight = () => {
    const v = value.trim();
    if (!v) return;
    if (highlights.includes(v)) return;

    setHighlights([...highlights, v]);
    setValue("");
  };

  const removeHighlight = (item:string) => {
    setHighlights(highlights.filter((h) => h !== item));
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
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHighlight()}
              placeholder="Enter here"
              className="flex-1 text-sm outline-none"
            />

            {value ? (
              <button type="button" onClick={addHighlight} className="ml-2  ">
                <Check className="size-4 text-green-500 hover:text-green-700" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowHightlight(false)}
                className="ml-2  "
              >
                <X className="size-4 text-red-500 hover:text-red-700" />
              </button>
            )}
          </div>
        )}

        <div className="rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/40 py-5">
          <button
            type="button"
            onClick={() => setShowHightlight(true)}
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