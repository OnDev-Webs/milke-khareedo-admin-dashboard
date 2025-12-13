import { Plus } from "lucide-react";

export default function AddHighlightsForm() {
  return (
    <div className=" bg-white p-4">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/40 py-5">
          <button
            type="button"
            className="mx-auto flex items-center justify-center gap-2 text-xs font-medium text-gray-700 hover:text-black"
          >
            <span className="text-lg">
              <Plus className="size-6" />
            </span>
            Add highlight Point
          </button>
        </div>
      </div>
    </div>
  );
}
