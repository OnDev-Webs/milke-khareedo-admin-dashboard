"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowUp,
  Calendar,
  Clock,
  Mail,
  Phone,
  Plus,
  Replace,
  X,
} from "lucide-react";
import { useState } from "react";

export type Lead = {
  id: number;
  userName: string;
  email: string;
  phone: string;
  date: string;
  projectId: string;
  status: "active" | "inactive";
};

export type SheetMode = "view" | "edit" | "create";

function LeadView() {
  // function LeadView({ lead }: { lead: Lead }) {
  return (
    <div className="space-y-3 text-sm">
      {/* <Info label="User" value={lead.userName} />
      <Info label="Email" value={lead.email} />
      <Info label="Phone" value={lead.phone} />
      <Info label="Project ID" value={lead.projectId} />
      <Info label="Status" value={lead.status} /> */}

      <div className="h-[90vh] overflow-auto bg-white px-4">
        <div className="">
          <div className="mb-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Devang Shah</p>
              <p className="text-xs text-gray-500">2 Jan, 2025, 02:33 AM</p>
            </div>
          </div>

          <div className="mb-5 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-xs text-green-700 flex items-center gap-2">
            <Calendar size={16} />
            Next follow up overdue on Dec, 2025 – <b>10 AM</b>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Details
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-500">
                  Phone Number
                </p>
                <p className="text-gray-800 text-sm font-medium">
                  +91 956 256 2648
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">
                  Projects ID
                </p>
                <p className="text-gray-800 text-sm font-medium">
                  Sisara#21562
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">Source</p>
                <p className="text-gray-800 text-sm font-medium">Facebook</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">
                  IP address
                </p>
                <p className="text-gray-800 text-sm font-medium">
                  SF6264562343
                </p>
              </div>
              <hr />
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500">Remarks</p>
                  <button className="text-xs font-medium text-blue-600">
                    Edit
                  </button>
                </div>
                <p className="text-xs text-gray-600">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
          </div>

          <button className="mb-6 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700">
            <Clock size={16} /> Next Follow up
          </button>

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Timeline
            </h3>

            <div className="space-y-4 text-sm">
              <button className="flex items-center gap-2 text-sm font-medium text-blue-600">
                <Plus size={16} /> Add Activity
              </button>

              <div className="flex gap-3">
                <Phone size={16} />
                <div>
                  <p className="text-xs text-gray-500">Dec 09, 2025 03:09 PM</p>
                  <p className="text-sm font-medium text-gray-800">
                    Phone call by Sumit
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone size={16} />
                <div>
                  <p className="text-xs text-gray-500">Dec 08, 2025 03:09 PM</p>
                  <p className="text-sm font-medium text-gray-800">
                    Phone call
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail size={16} />
                <div>
                  <p className="text-xs text-gray-500">Dec 06, 2025 03:09 PM</p>
                  <p className="text-sm font-medium text-gray-800">
                    Whatsapp message sent by Amit
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Replace size={16} />
                <div>
                  <p className="text-xs text-gray-500">Dec 05, 2025 03:09 PM</p>
                  <p className="text-sm font-medium text-gray-800">
                    Status changed by Amit
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <ArrowUp size={16} />
                <div>
                  <p className="text-xs text-gray-500">Dec 05, 2025 03:09 PM</p>
                  <p className="text-sm font-medium text-gray-800">
                    Client added to CRM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex-1 rounded-lg bg-black py-3 text-sm font-semibold text-white">
              Update Status
            </button>

            <button className="flex h-11 w-11 items-center justify-center rounded-lg border">
              <Phone size={16} />
            </button>

            <button className="flex h-11 w-11 items-center justify-center rounded-lg border">
              <Mail size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadEdit({ lead }: { lead: Lead }) {
  return (
    <div className="space-y-4 text-sm">
      {/* Placeholder for React Hook Form */}
      <input
        defaultValue={lead.userName}
        className="w-full rounded border px-3 py-2"
      />
      <input
        defaultValue={lead.email}
        className="w-full rounded border px-3 py-2"
      />
      <button className="w-full rounded bg-black py-2 text-white">
        Save Changes
      </button>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </p>
  );
}

export default function LeadCRMSheet() {
  const [open, setOpen] = useState<boolean>(true);
  let selectedLead = null;
  //   if (!open || !selectedLead) return null;
  const [mode, setMode] = useState<SheetMode>("view");
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-[420px]">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center justify-between">
              {mode === "view" && "Lead Details"}
              {/* {mode === "edit" && "Edit Lead"}
            {mode === "create" && "Create Lead"} */}
              <button
                type="button"
                className="rounded-full bg-gray-100 p-2 text-sm text-gray-600"
                onClick={handleClose}
              >
                <X size={16} className="text-red-500" />
              </button>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="">
          {mode === "view" && <LeadView />}
          {/* {mode === "edit" && <LeadEdit lead={selectedLead} />} */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
