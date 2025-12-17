import { Check, Trash } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Success from "./success";

export default function DeletePopUp({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const deleted = false;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-none bg-transparent p-0 shadow-none">
        {deleted ? (
          <Success />
        ) : (
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600">
                  <Trash className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold text-gray-900">
                Delete this file?
              </h2>
              <p className="mt-2 text-base text-gray-500">
                Are you sure you want to delete this Developer? Once completed,
                it cannot be undone.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={onClose}
                className="rounded-lg bg-black py-3 text-sm font-semibold text-white"
              >
                Cancel
              </button>

              <button className="rounded-lg bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700">
                Delete Developer
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
