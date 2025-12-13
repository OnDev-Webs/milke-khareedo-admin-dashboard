export default function AddAmenitiesForm() {
  return (
    <div className=" bg-white p-6">
      <div className="mx-auto max-w-6xl border-b pb-2 border-gray-400">
        <fieldset className="rounded-md border bg-white px-3 pt-1 pb-2 ">
          <legend className="text-xs font-semibold text-gray-700">
            Add Amenities*
          </legend>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ex: Swimming Pool"
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
        <p className="px-3 text-xs text-gray-400">
          Enter one amenity at a time.
        </p>
      </div>
    </div>
  );
}