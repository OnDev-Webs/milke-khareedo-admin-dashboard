export default function AddRelationshipManagerForm() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <fieldset className=" border px-4 rounded-md pb-1.5">
            <legend className="text-xs font-semibold text-gray-700">
              Select Relationship Manager*
            </legend>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type three characters to search"
                className="flex-1 rounded-lg outline-none px-3 py-2 text-sm"
              />

              <button
                type="button"
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Add +
              </button>
            </div>
          </fieldset>

          <p className="mt-1 text-[11px] text-gray-400">
            Choose the primary RM for this project.
          </p>
        </div>

        <div className="mb-8 max-w-sm overflow-hidden rounded-2xl shadow">
          <div className="relative">
            <img
              src="https://plus.unsplash.com/premium_photo-1724853266875-f304906144a7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"
              alt="RM"
              className="h-72 w-full object-cover"
            />

            <div className="absolute -bottom-px rounded-2xl overflow-hidden p-px  bg-linear-to-r from-white via-70% via-neutral-400/40 to-white w-full">
              <div className="bg-neutral-400/40 px-4 py-3 backdrop-blur-[55px] text-white rounded-2xl">
                <p className="text-lg font-semibold ">XYZ</p>
                <p className="text-base">xyz@milkshareedo.com</p>
              </div>
            </div>

            <button
              type="button"
              className="absolute bottom-3 right-3 rounded-lg bg-white p-2 shadow"
            ></button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className=" mb-2 text-sm font-semibold text-gray-900">
            Lead Distribution
          </h3>

          <fieldset className=" border px-4 rounded-md pb-1.5">
            <legend className="text-xs font-semibold text-gray-700">
              Add agents (optional)
            </legend>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type three characters to search"
                className="flex-1 rounded-lg outline-none px-3 py-2 text-sm"
              />

              <button
                type="button"
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Add +
              </button>
            </div>
          </fieldset>

          <p className="mt-1 text-[11px] text-gray-400">
            Add sales agents who will also receive project leads.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="max-w-sm overflow-hidden rounded-2xl shadow"
            >
              <div className="relative">
                <img
                  src="https://plus.unsplash.com/premium_photo-1724853266875-f304906144a7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"
                  alt="RM"
                  className="h-72 w-full object-cover"
                />

                <div className="absolute -bottom-px rounded-2xl overflow-hidden p-px  bg-linear-to-r from-white via-70% via-neutral-400/40 to-white w-full">
                  <div className="bg-neutral-400/40 px-4 py-3 backdrop-blur-[55px] text-white rounded-2xl">
                    <p className="text-lg font-semibold ">XYZ</p>
                    <p className="text-base">xyz@milkshareedo.com</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
