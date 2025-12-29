import { Check } from "lucide-react";

export default function Success({ onClose }: { onClose: () => void }){

    return <div className="w-full max-w-md rounded-2xl bg-white px-6 py-7 shadow-xl">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-200">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600">
                  <Check className="h-7 w-7 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Success!
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Developer is Successfully Deleted
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
}