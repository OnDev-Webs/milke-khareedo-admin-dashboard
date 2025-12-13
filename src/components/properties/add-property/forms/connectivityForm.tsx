export default function ConnectivityForm() {
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
              placeholder="Ex: School"
              className="flex-1 rounded-lg py-2 text-sm focus:outline-none"
            />

            <button
              type="button"
              className="rounded-lg bg-gray-100 px-4 py-1 p text-sm font-medium text-gray-600 hover:bg-gray-200"
            >
              Add +
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
