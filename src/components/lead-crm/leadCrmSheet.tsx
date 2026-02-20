"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ArrowUp, Calendar, Clock, User, X, AlertCircle, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchLeadById,
  createLeadActivity,
  updateLeadStatus,
  updateLeadRemark,
} from "@/lib/features/lead-crm/leadcrmApi";
import { RootState } from "@/lib/store/store";
import { TimelineItem } from "@/lib/features/lead-crm/leadcrmSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CustomDropdown from "@/components/custom/dropdawn";
import { cn } from "@/lib/utils";
import Image from "next/image";
import wp from "@/assets/wp.svg"
import timelineWp from "@/assets/timelineWp.svg"
import TimelineCall from "@/assets/TimelineCall.svg"
import Loader from "../ui/loader";
import editStatus from "@/assets/editStatus.svg";
import call from "@/assets/call.svg";
import toast from "react-hot-toast";

export type SheetMode = "view" | "edit" | "";

type LeadSheetProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  leadId?: string | null;
  mode: SheetMode;
  onClose?: () => void;
};

const statusOptions = [
  { label: "Lead Received", value: "lead_received" },
  { label: "Interested", value: "interested" },
  { label: "No Response - Do Not Pick (DNP)", value: "dnp" },
  { label: "Unable to Contact", value: "unable_to_contact" },
  { label: "Call Back Scheduled", value: "call_back_scheduled" },
  { label: "Demo Discussion Ongoing", value: "demo_discussion_ongoing" },
  { label: "Site Visit Coordination in Progress", value: "site_visit_coordination" },
  { label: "Site Visit Confirmed", value: "site_visit_confirmed" },
  { label: "Commercial Negotiation", value: "commercial_negotiation" },
  { label: "Deal Closed", value: "deal_closed" },
  { label: "Declined Interest", value: "declined_interest" },
  { label: "Does Not Meet Requirements", value: "does_not_meet_requirements" },
];

function TimelineIcon({ activityType }: { activityType: string }) {
  switch (activityType.toLowerCase()) {
    case "phone_call":
      return <Image src={call} alt="Call" width={16} height={16} className="text-green-600" />;
    case "whatsapp":
    case "message":
      return <Image src={timelineWp} alt="WhatsApp" width={16} height={16} className="text-green-600" />;
    case "status_change":
      return <Image src={editStatus} alt="Edit Status" width={16} height={16} className="text-blue-600" />;
    case "visit":
      return <Calendar size={16} className="text-blue-600" />;
    case "follow_up":
      return <Clock size={16} className="text-blue-600" />;
    case "client_added":
    case "created":
      return <ArrowUp size={16} className="text-gray-600" />;
    default:
      return <User size={16} className="text-gray-600" />;
  }
}

function FollowUpDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!open) {
      setDate("");
      setTime("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (date && time) {
      const dateTime = new Date(`${date}T${time}`).toISOString();
      onConfirm(dateTime, time);
      setDate("");
      setTime("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Schedule Follow Up</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Time</label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!date || !time}
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Schedule
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UpdateStatusDialog({
  open,
  onClose,
  onConfirm,
  currentStatus,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (status: string) => void;
  currentStatus?: string;
}) {
  const [selectedStatus, setSelectedStatus] = useState("");
  useEffect(() => {
    if (open && currentStatus) {
      setSelectedStatus(currentStatus);
    }
  }, [open, currentStatus]);

  const handleSelect = (item: string | { label: string; value: string }) => {
    if (typeof item === "string") {
      setSelectedStatus(item);
    } else {
      setSelectedStatus(item.value);
    }
  };

  const handleConfirm = () => {
    if (selectedStatus) {
      onConfirm(selectedStatus);
      setSelectedStatus("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Update Lead Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Status</label>
            <CustomDropdown
              items={statusOptions.map((s) => ({ label: s.label, value: s.value }))}
              placeholder="Choose a status"
              value={selectedStatus}
              onSelect={handleSelect}
              searchable
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedStatus}
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Status
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LeadCRMSheet({
  open,
  setOpen,
  leadId,
  mode,
  onClose,
}: LeadSheetProps) {
  const dispatch = useAppDispatch();
  const { selected, loadingDetails } = useAppSelector(
    (state: RootState) => state.leadcrm
  );
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [isEditingRemark, setIsEditingRemark] = useState(false);
  const [remarkValue, setRemarkValue] = useState("");
  const [isSavingRemark, setIsSavingRemark] = useState(false);

  useEffect(() => {
    if (open && leadId && mode === "view") {
      dispatch(fetchLeadById(leadId));
    }
  }, [open, leadId, mode, dispatch]);

  useEffect(() => {
    if (selected?.remark !== undefined) {
      setRemarkValue(selected.remark || "");
    }
  }, [selected]);

  const handleClose = () => {
    setIsEditingRemark(false);
    setRemarkValue("");
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleFollowUp = (dateTime: string, time: string) => {
    if (!leadId) return;
    dispatch(
      createLeadActivity({
        leadId,
        activityType: "follow_up",
        description: "Follow-up call for lead.",
        nextFollowUpDate: dateTime,
      })
    ).then(() => {
      toast.success("Follow-up scheduled successfully");
      dispatch(fetchLeadById(leadId));
    }).catch(() => {
      toast.error("Failed to schedule follow-up");
    });
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone || phone === "N/A") return null;
    // Remove all non-digit characters except +
    return phone.replace(/[^\d+]/g, "");
  };

  const handlePhoneCall = () => {
    if (!leadId || !selected) return;
    const phoneNumber = formatPhoneNumber(selected.phoneNumber);

    if (!phoneNumber) {
      alert("Phone number is not available");
      return;
    }

    dispatch(
      createLeadActivity({
        leadId,
        activityType: "phone_call",
        description: "Called the lead regarding the property.",
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchLeadById(leadId));
        // Open phone dialer
        window.location.href = `tel:${phoneNumber}`;
      })
      .catch((error) => {
        console.error("Failed to create phone call activity:", error);
      });
  };

  const handleWhatsApp = () => {
    if (!leadId || !selected) return;
    const phoneNumber = formatPhoneNumber(selected.phoneNumber);

    if (!phoneNumber) {
      alert("Phone number is not available");
      return;
    }

    // Remove + sign and any leading zeros for WhatsApp URL
    const whatsappNumber = phoneNumber.replace(/^\+/, "").replace(/^0+/, "");

    dispatch(
      createLeadActivity({
        leadId,
        activityType: "whatsapp",
        description: "WhatsApp message sent to lead.",
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchLeadById(leadId));
        // Open WhatsApp
        window.open(`https://wa.me/${whatsappNumber}`, "_blank");
      })
      .catch((error) => {
        console.error("Failed to create WhatsApp activity:", error);
      });
  };

  const handleUpdateStatus = (status: string) => {
    if (!leadId) return;
    dispatch(updateLeadStatus({ leadId, status })).then(() => {
      toast.success("Lead status updated");
      dispatch(fetchLeadById(leadId));
    }).catch(() => {
      toast.error("Failed to update lead status");
    });
  };

  const handleStartEditRemark = () => {
    setRemarkValue(selected?.remark || "");
    setIsEditingRemark(true);
  };

  const handleCancelEditRemark = () => {
    setRemarkValue(selected?.remark || "");
    setIsEditingRemark(false);
  };

  const handleSaveRemark = () => {
    if (!leadId) return;
    setIsSavingRemark(true);
    dispatch(updateLeadRemark({ leadId, remark: remarkValue }))
      .then(() => {
        toast.success("Remark updated successfully");
        dispatch(fetchLeadById(leadId));
        setIsEditingRemark(false);
      })
      .catch(() => {
        toast.error("Failed to update remark");
      })
      .finally(() => {
        setIsSavingRemark(false);
      });
  };

   const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!selected && !loadingDetails) {
    return null;
  }

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent className="!max-w-none sm:!max-w-[300px] md:!max-w-[450px] lg:!max-w-[420px] w-full p-0 overflow-hidden flex flex-col bg-white">
          <SheetHeader className="border-b px-4 py-3 bg-white">
            <SheetTitle>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Lead Details</span>
                <button
                  type="button"
                  className="rounded-full bg-gray-100 p-1.5 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                  onClick={handleClose}
                >
                  <X size={16} className="text-red-500" />
                </button>
              </div>
            </SheetTitle>
          </SheetHeader>

          {loadingDetails ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500"><Loader size={38} /></div>
            </div>
          ) : selected ? (
            <div className="flex-1 overflow-y-auto bg-white px-4 pt-4">
              {/* Lead Header */}
              <div className="mb-5 flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selected.user?.profileImage && selected.user.profileImage.trim() !== "" ? (
                    <img
                      src={selected.user.profileImage}
                      alt={selected.leadName || "Lead"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={24} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900 truncate">
                    {selected.leadName || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{selected.date}</p>
                </div>
              </div>

              {/* Next Follow Up Banner */}
              {selected.nextFollowUp && (
                <div
                  className={cn(
                    "mb-5 rounded-lg border px-4 py-3 text-xs flex items-center gap-2",
                    selected.nextFollowUp.isOverdue
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-green-300 bg-green-50 text-green-700"
                  )}
                >
                  {selected.nextFollowUp.isOverdue ? (
                    <AlertCircle size={16} className="flex-shrink-0" />
                  ) : (
                    <Calendar size={16} className="flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    {selected.nextFollowUp.isOverdue ? (
                      <span>
                        Next Follow up <span className="font-semibold">Overdue</span> on{" "}
                        <span className="font-semibold">
                          {selected.nextFollowUp.formattedDate || formatDate(selected.nextFollowUp.date)}
                        </span>
                      </span>
                    ) : (
                      <span>
                        Next Follow up on{" "}
                        <span className="font-semibold">
                          {selected.nextFollowUp.formattedDate || formatDate(selected.nextFollowUp.date)}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Details Section */}
              <div className="mb-6">
                <h3 className="text-[16px] font-bold text-black mb-4">
                  Details
                </h3>

                <div className="space-y-4 text-sm bg-[#FBFBFF] py-4 px-5 rounded-lg">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      Phone Number
                    </p>
                    <p className="text-gray-900 text-sm font-medium">
                      {selected.phoneNumber || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      Projects ID
                    </p>
                    <p className="text-gray-900 text-sm font-medium">
                      {selected.projectId || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Source</p>
                    <p className="text-gray-900 text-sm font-medium">
                      {selected.source || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      IP address
                    </p>
                    <p className="text-gray-900 text-sm font-medium">
                      {selected.ipAddress || "N/A"}
                    </p>
                  </div>

                  {/* Remark Section */}
                  <div className="border-t pt-2">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#929292]">
                        Remark
                      </p>
                      {!isEditingRemark && (
                        <button
                          onClick={handleStartEditRemark}
                          className="text-xs font-medium text-[#3A59A6] hover:text-blue-700 transition-colors flex items-center gap-1"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditingRemark ? (
                      <div className="space-y-3">
                        <textarea
                          value={remarkValue}
                          onChange={(e) => setRemarkValue(e.target.value)}
                          placeholder="Enter remarks..."
                          rows={4}
                          className={cn(
                            "w-full rounded-md border border-gray-300 px-3 py-2 text-sm",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500",
                            "resize-none"
                          )}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleCancelEditRemark}
                            disabled={isSavingRemark}
                            className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveRemark}
                            disabled={isSavingRemark}
                            className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <Save size={12} />
                            {isSavingRemark ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="min-h-[60px] p-3 rounded-md bg-gray-50 border border-gray-200">
                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {selected.remark || (
                            <span className="text-gray-400 italic">No remarks</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Follow Up Button */}
              <button
                onClick={() => setFollowUpOpen(true)}
                className="mb-6 flex items-center justify-center gap-2 rounded-lg border border-[#FBFBFF] px-4 text-sm font-medium text-[#3A59A6] transition-colors w-full"
              >
                <Calendar size={16} /> Next Follow up
              </button>

              {/* Timeline Section */}
              <div className="mb-6">
                <h3 className="mb-4 text-[16px] font-bold text-black">
                  Timeline
                </h3>

                <div className="space-y-6 text-sm px-5">
                  {selected.timeline && selected.timeline.length > 0 ? (
                    selected.timeline.map((item: TimelineItem, index: number) => {
                      const isLast = index === selected.timeline.length - 1;

                      return (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative flex flex-col items-center">
                            {!isLast && (
                              <div className="absolute top-[28px] bottom-[-24px] w-px bg-[#D9D9D9]" />
                            )}

                            <div className="relative z-10 bg-[#F5F5FA] p-2 rounded-full">
                              <TimelineIcon activityType={item.activityType} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-1">
                              {item.formattedDate || formatDate(item.activityDate)}
                            </p>
                            <p className="text-sm font-medium text-gray-800 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-500">No timeline entries</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 border-t sticky bottom-0 z-30 bg-white border-t px-4 py-3 flex items-center gap-3">
                <button
                  onClick={() => setUpdateStatusOpen(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                >
                  <Calendar size={16} />
                  <span>Update Status</span>
                </button>


                <button
                  onClick={handlePhoneCall}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#F8F8F8] hover:bg-gray-50 transition-colors"
                  title="Phone Call"
                >
                  <Image
                    src={TimelineCall}
                    alt="TimelineCall"
                    width={20}
                    height={20}
                  />
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#F8F8F8] hover:bg-gray-50 transition-colors"
                  title="WhatsApp"
                >
                  <Image
                    src={wp}
                    alt="WhatsApp"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <FollowUpDialog
        open={followUpOpen}
        onClose={() => setFollowUpOpen(false)}
        onConfirm={handleFollowUp}
      />

      <UpdateStatusDialog
        open={updateStatusOpen}
        onClose={() => setUpdateStatusOpen(false)}
        onConfirm={handleUpdateStatus}
        currentStatus={selected?.statusValue}
      />
    </>
  );
}
