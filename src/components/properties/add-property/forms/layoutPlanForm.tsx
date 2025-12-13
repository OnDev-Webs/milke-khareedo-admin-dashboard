export default function AddLayoutPlanForm() {
  return (
    <div className="w-full bg-white p-6">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg bg-[#eef2ff] px-4 py-3 text-sm font-semibold text-gray-900"
        >
          1 BHK
          <span className="text-lg">
            {/* ChevronTop */}
          </span>
        </button>

        <div className="mt-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 p-3">
            <div className="relative overflow-hidden rounded-xl bg-gray-100">
              <div className="h-64 w-full object-cover">{/* img */}</div>

              <div className="absolute right-2 top-2 flex flex-col gap-2">
                <button className="rounded-full bg-white p-2 shadow">
                  {/* delete */}
                </button>
                <button className="rounded-full bg-white p-2 shadow">
                  {/* View */}
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-lg  font-medium">
              <span className="font-semibold">350.00 Ft²</span>
              <span className="text-gray-700">₹ 35.20 Lak</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 p-3">
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-400 bg-blue-50/40 p-6 text-center h-64">
              {/* Upload icon */}

              <p className="text-sm font-medium text-gray-700">
                Upload <br /> Project Photo
              </p>
            </div>
            <div className="mt-3 flex w-full items-center justify-between text-lg  font-medium text-gray-800">
              <span className="text-lg font-semibold">410.00 Ft²</span>
              <span className="text-gray-700">₹ 65.10 Lak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}