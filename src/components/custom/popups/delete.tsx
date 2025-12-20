import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Success from "./success";

type DeletePopUpProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  id: string | null;
  title: string;
  description: string;
  buttonText: string;
  iconType?: string;
};

export default function DeletePopUp({
  open,
  onClose,
  onConfirm,
  id,
  title,
  description,
  buttonText,
  iconType,
}: DeletePopUpProps) {
  const deleted = false;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="border-none bg-transparent p-0 shadow-none">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>

        {deleted ? (
          <Success />
        ) : (
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600">
                  <Trash2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="mt-2 text-base text-gray-500">{description}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={onClose}
                className="rounded-lg bg-black py-3 text-sm font-semibold text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => id && onConfirm(id)}
                className="rounded-lg bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                {buttonText}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
