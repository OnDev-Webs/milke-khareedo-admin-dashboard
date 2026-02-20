"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Phone, MessageCircle, CheckCircle2, Calendar, User, AlertCircle, Check, ArrowUp, CalendarDays, ChevronDown, } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchLeadById, updateLeadRemark, createLeadActivity, updateLeadStatus, } from "@/lib/features/lead-crm/leadcrmApi";
import { Sheet, SheetContent, SheetTitle, } from "@/components/ui/sheet";
import { Dialog, DialogContent, } from "@/components/ui/dialog";
import Image from "next/image";
import wp from "@/assets/wp.svg"
import timelineWp from "@/assets/timelineWp.svg"
import TimelineCall from "@/assets/TimelineCall.svg"
import call from "@/assets/call.svg";
import editStatus from "@/assets/editStatus.svg";
import { cn } from "@/lib/utils";
import Loader from "@/components/ui/loader";

const buildFollowUpISO = (
    dateStr: string,
    timeStr: string
) => {
    let year: number, month: number, day: number;

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const parts = dateStr.split("-").map(Number);
        year = parts[0];
        month = parts[1] - 1;
        day = parts[2];
    }
    else {
        const parts = dateStr.split(" ");
        if (parts.length !== 3) {
            throw new Error("Invalid date format");
        }

        day = Number(parts[0]);
        month = MONTHS.indexOf(parts[1]);
        year = Number(parts[2]);
    }

    let [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const date = new Date(
        year,
        month,
        day,
        hours,
        minutes,
        0
    );

    if (isNaN(date.getTime())) {
        throw new Error("Invalid Date constructed");
    }

    return date.toISOString();
};

type TimelineIconProps = {
    type: string;
    className?: string;
};

function TimelineIcon({ type, className = "" }: TimelineIconProps) {
    switch (type?.toLowerCase()) {
        case "phone_call":
            return <Image src={call} alt="Call" width={16} height={16} className={`text-green-600 ${className}`} />;
        case "whatsapp":
        case "message":
            return <Image src={timelineWp} alt="WhatsApp" width={18} height={18} className={`text-green-600 ${className}`} />;
        case "status_change":
            return <Image src={editStatus} alt="Edit Status" width={18} height={18} className={`text-blue-600 ${className}`} />;
        case "visit":
            return <Calendar size={18} className={`text-blue-600 ${className}`} />;
        case "follow_up":
            return <Clock size={18} className={`text-blue-600 ${className}`} />;
        case "created":
            return <ArrowUp size={16} className="text-gray-600" />;
        default:
            return <User size={18} className={`text-gray-500 ${className}`} />;
    }
}

const statusOptions = [
    { label: "Lead Received", value: "lead_received" },
    { label: "Interested", value: "interested" },
    { label: "No Response – Do Not Pick (DNP)", value: "no_response_dnp" },
    { label: "Unable to Contact", value: "unable_to_contact" },
    { label: "Call Back Scheduled", value: "call_back_schedule" },
    { label: "Demo Discussion Ongoing", value: "demo_discussion" },
    { label: "Site Visit Coordination in Progress", value: "site_visit_coordination" },
    { label: "Site Visit Confirmed", value: "site_visit_confirmed" },
    { label: "Commercial Negotiation", value: "commercial_negotiation" },
    { label: "Deal Closed", value: "deal_closed" },
    { label: "Declined Interest", value: "declined_interest" },
    { label: "Does Not Meet Requirements", value: "does_not_meet_requirements" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
];

const MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

export default function LeadDetailsMobilePage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { selected, loadingDetails } = useAppSelector((state) => state.leadcrm);
    const [isEditingRemark, setIsEditingRemark] = useState(false);
    const [remarkValue, setRemarkValue] = useState("");
    const [isSavingRemark, setIsSavingRemark] = useState(false);
    const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [followUpOpen, setFollowUpOpen] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [timePickerOpen, setTimePickerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [calendarDate, setCalendarDate] = useState(() => {
        const d = new Date();
        d.setDate(1);
        return d;
    });
    const currentMonth = calendarDate.getMonth();
    const currentYear = calendarDate.getFullYear();
    const jsFirstDay = new Date(currentYear, currentMonth, 1).getDay();
    const firstDayOfMonth = (jsFirstDay + 6) % 7;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const [tempSelectedDate, setTempSelectedDate] = useState<{ day: number; month: number; year: number; } | null>(null);
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    const handlePrevMonth = () => {
        setCalendarDate(prev => {
            const d = new Date(prev);
            d.setMonth(d.getMonth() - 1);
            return d;
        });
    };

    const handleNextMonth = () => {
        setCalendarDate(prev => {
            const d = new Date(prev);
            d.setMonth(d.getMonth() + 1);
            return d;
        });
    };
    const [hour, setHour] = useState(6);
    const [minute, setMinute] = useState(0);
    const [amPm, setAmPm] = useState<"AM" | "PM">("AM");
    const [mode, setMode] = useState<"hour" | "minute">("hour");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const formatDateForBackend = (date: Date) => {
        return date.toISOString().split("T")[0];
    };

    const addDays = (days: number) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d;
    };

    const addMonths = (months: number) => {
        const d = new Date();
        d.setMonth(d.getMonth() + months);
        return d;
    };

    /* ================= FETCH DETAILS ================= */
    useEffect(() => {
        if (id) {
            dispatch(fetchLeadById(id as string));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (selected?.remark !== undefined) {
            setRemarkValue(selected.remark || "");
        }
    }, [selected]);

    const handleSaveRemark = () => {
        if (!id) return;
        setIsSavingRemark(true);

        dispatch(updateLeadRemark({ leadId: id as string, remark: remarkValue }))
            .then(() => {
                dispatch(fetchLeadById(id as string));
                setIsEditingRemark(false);
            })
            .finally(() => setIsSavingRemark(false));
    };

    const handleQuickOption = (option: string) => {
        setSelectedOption(option);
        setDatePickerOpen(false);
        setTimePickerOpen(false);

        let date: Date | null = null;

        switch (option) {
            case "Today":
                date = new Date();
                setTimePickerOpen(true);
                break;

            case "Tomorrow":
                date = addDays(1);
                setTimePickerOpen(true);
                break;

            case "3 days from now":
                date = addDays(3);
                setTimePickerOpen(true);
                break;

            case "1 week from now":
                date = addDays(7);
                setTimePickerOpen(true);
                break;

            case "1 month from now":
                date = addMonths(1);
                setTimePickerOpen(true);
                break;

            case "Select custom data and time":
                setDatePickerOpen(true);
                setTimePickerOpen(true);
                return;

            case "No Follow Up":
                setSelectedDate(null);
                setSelectedTime(null);
                return;

            default:
                return;
        }

        if (date) {
            setSelectedDate(formatDateForBackend(date));
        }
    };

    const handleNextFollowUp = () => {
        if (!id) return;

        if (selectedOption === "No Follow Up") {
            setFollowUpOpen(false);
            return;
        }

        if (!selectedDate || !selectedTime) {
            alert("Please select time");
            return;
        }

        let dateTime: string;

        try {
            dateTime = buildFollowUpISO(selectedDate, selectedTime);
        } catch (e) {
            alert("Invalid date or time selected");
            return;
        }

        dispatch(
            createLeadActivity({
                leadId: id as string,
                activityType: "follow_up",
                description: "Follow-up scheduled",
                nextFollowUpDate: dateTime,
            })
        ).then(() => {
            dispatch(fetchLeadById(id as string));
            setFollowUpOpen(false);
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

    const getTimelineDisplayDate = (item: any) => {
  // ✅ Visit should use metadata time (source of truth)
  if (
    item.activityType === "visit" &&
    item.metadata?.visitDate &&
    item.metadata?.visitTime
  ) {
    try {
      const date = new Date(item.metadata.visitDate);
      const [h, m] = item.metadata.visitTime.split(":").map(Number);

      // set IST time correctly
      date.setHours(h, m, 0, 0);

      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    } catch (e) {
      console.error("Visit date parse failed", e);
    }
  }

  // ✅ fallback chain
  return item.formattedDate || formatDate(item.activityDate);
};
    

    const formatPhoneNumber = (phone?: string) => {
        if (!phone || phone === "N/A") return null;
        return phone.replace(/[^\d+]/g, "");
    };

    const handleCallNow = () => {
        if (!id || !selected) return;

        const phone = formatPhoneNumber(selected.phoneNumber);
        if (!phone) {
            alert("Phone number not available");
            return;
        }

        dispatch(
            createLeadActivity({
                leadId: id as string,
                activityType: "phone_call",
                description: "Called the lead from mobile.",
            })
        )
            .unwrap()
            .then(() => {
                dispatch(fetchLeadById(id as string));
                window.location.href = `tel:${phone}`;
            })
            .catch((err) => {
                console.error("Phone call activity failed", err);
                window.location.href = `tel:${phone}`; // fallback
            });
    };

    const handleWhatsApp = () => {
        if (!id || !selected) return;

        const phone = formatPhoneNumber(selected.phoneNumber);
        if (!phone) {
            alert("Phone number not available");
            return;
        }

        const whatsappNumber = phone.replace(/^\+/, "").replace(/^0+/, "");

        dispatch(
            createLeadActivity({
                leadId: id as string,
                activityType: "whatsapp",
                description: "WhatsApp message sent from mobile.",
            })
        )
            .unwrap()
            .then(() => {
                dispatch(fetchLeadById(id as string));
                window.open(`https://wa.me/${whatsappNumber}`, "_blank");
            })
            .catch((err) => {
                console.error("WhatsApp activity failed", err);
                window.open(`https://wa.me/${whatsappNumber}`, "_blank"); // fallback
            });
    };

    const handleUpdateStatus = () => {
        if (!id || !selectedStatus) return;

        dispatch(updateLeadStatus({ leadId: id as string, status: selectedStatus }))
            .then(() => {
                dispatch(fetchLeadById(id as string));
                setUpdateStatusOpen(false);
                setSelectedStatus("");
            });
    };

    /* ================= LOADING ================= */
    if (loadingDetails || !selected) {
        return <div className="p-4"><Loader size={38} /></div>;
    }

    return (
        <div className="min-h-screen bg-[#F5F5FA]">

            {/* ================= HEADER ================= */}
            <div className="sticky top-0 bg-[#F5F5FA] px-4 py-3 z-10">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <div className="text-center flex-1 mt-6">
                        <p className="text-[15px] font-semibold">
                            {selected.leadName}
                        </p>
                        <p className="text-[11px] text-gray-500">
                            {selected.createdAt ? formatDate(selected.createdAt) : "N/A"}
                        </p>
                    </div>

                    <div className="w-6" />
                </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="p-4 space-y-4">
                {/* Next Follow Up Banner */}
                {selected.nextFollowUp && (
                    <div
                        className={cn(
                            "mb-3 rounded-lg border px-4 py-3 text-xs flex items-center gap-2",
                            selected.nextFollowUp.isOverdue
                                ? "border-red-300 bg-red-50 text-red-700"
                                : "border-[#588F75] bg-[#E6FFF3] text-[#000000]"
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
                                    <span>
                                        {selected.nextFollowUp.formattedDate || formatDate(selected.nextFollowUp.date)}
                                    </span>
                                </span>
                            ) : (
                                <span>
                                    Next Follow up on{" "}
                                    <span>
                                        {selected.nextFollowUp.formattedDate || formatDate(selected.nextFollowUp.date)}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== DETAILS TITLE ===== */}
                <h3 className="text-[16px] font-bold text-[#000000]">
                    Details
                </h3>
                {/* ===== DETAILS CARD ===== */}
                <div className="bg-white text-[#929292] rounded-xl border-white p-4 space-y-4">
                    {/* Phone Number */}
                    <div>
                        <p className="text-[13px] font-medium text-[#929292]">
                            Phone Number
                        </p>
                        <p className="text-[14px] text-black mt-0.5">
                            {selected.phoneNumber || "N/A"}
                        </p>
                    </div>

                    {/* Project ID */}
                    <div>
                        <p className="text-[13px] font-medium text-[#929292]">
                            Project ID
                        </p>
                        <p className="text-[14px]  text-black mt-0.5">
                            {selected.projectId || "N/A"}
                        </p>
                    </div>

                    {/* Source */}
                    <div>
                        <p className="text-[13px] font-medium text-[#929292]">
                            Source
                        </p>
                        <p className="text-[15px] text-black mt-0.5">
                            {selected.source || "N/A"}
                        </p>
                    </div>

                    {/* IP Address */}
                    <div>
                        <p className="text-[13px] font-medium text-[#929292]">
                            IP Address
                        </p>
                        <p className="text-[14px] text-black mt-0.5">
                            {selected.ipAddress || "N/A"}
                        </p>
                    </div>
                </div>

                {/* ===== REMARKS CARD ===== */}
                <div className="bg-white rounded-xl border-white p-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[13px] font-medium text-[#929292]">
                            Remarks
                        </p>

                        <button
                            onClick={() => setIsEditingRemark(true)}
                            className="text-[13px] font-medium text-[#3A59A6]"
                        >
                            Edit
                        </button>
                    </div>

                    <div className="rounded-md bg-white p-2">
                        <p className="text-[14px] text-[#000000]">
                            {selected.remark || "No remarks"}
                        </p>
                    </div>

                    {/* ===== NEXT FOLLOW UP BUTTON ===== */}
                    <div className="grid grid-cols-1 gap-3 mt-2">

                        {/* ===== NEXT FOLLOW UP ===== */}
                        <button
                            onClick={() => setFollowUpOpen(true)}
                            className="flex items-center rounded-md border border-[#F5F5FA] bg-[#F5F5FA] px-4 py-1 text-[16px] font-medium text-[#3A59A6]"
                        >
                            <div className="h-8 w-8 flex items-center justify-center">
                                <Calendar size={18} className="text-[#3A59A6]" />
                            </div>

                            <span className="text-left">
                                Next Follow Up
                            </span>
                        </button>

                        {/* ===== UPDATE STATUS ===== */}
                        <button
                            onClick={() => setUpdateStatusOpen(true)}
                            className="flex items-center rounded-md border border-[#F5F5FA] bg-[#F5F5FA] px-4 py-1 text-[16px] font-medium text-[#3A59A6]"
                        >
                            <div className="h-8 w-8 flex items-center justify-center">
                                <Calendar size={18} className="text-[#3A59A6]" />
                            </div>

                            <span className="text-left">
                                Update Status
                            </span>
                        </button>

                    </div>

                </div>

                {/* ===== TIMELINE CARD ===== */}
                <h3 className="text-[16px] font-bold text-[#000000] mb-3">
                    Timeline
                </h3>
                <div className="bg-white rounded-xl border-white p-4 mb-16">
                    {selected.timeline && selected.timeline.length > 0 ? (
                        <div className="relative space-y-6">
                            {selected.timeline.map((item, index) => {
                                const isLast = index === selected.timeline.length - 1;

                                return (
                                    <div key={item.id} className="flex gap-4 px-2">
                                        <div className="relative flex flex-col items-center">
                                            {/* CONTINUOUS LINE */}
                                            {!isLast && (
                                                <div
                                                    className="absolute top-[30px] bottom-[-24px] w-px bg-[#D9D9D9]"
                                                />
                                            )}

                                            {/* ICON */}
                                            <div className="relative bg-[#F5F5FA] p-2 rounded-full">
                                                <TimelineIcon
                                                    type={item.activityType}
                                                    className="h-5 w-5"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-[11px] text-gray-500 mb-0.5">
                                                {formatDate(item.activityDate || item.createdAt)}
                                            </p>
                                            <p className="text-[13px] text-gray-800 leading-snug">
                                                {(
                                                    (item.description || "").replace(/^[^-]*-\s*/, "")
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500">
                            No timeline entries
                        </p>
                    )}
                </div>
            </div>

            <Sheet open={isEditingRemark} onOpenChange={setIsEditingRemark}>
                <SheetContent
                    side="bottom"
                    className="rounded-t-2xl p-4">
                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-[17px] font-bold text-[#000000]">
                            Edit Remark
                        </SheetTitle>

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => setIsEditingRemark(false)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100"
                        >
                            ✕
                        </button>
                    </div>

                    {/* BODY */}
                    <textarea
                        value={remarkValue}
                        onChange={(e) => setRemarkValue(e.target.value)}
                        placeholder="Enter remark"
                        rows={4}
                        className="mt-4 w-full border rounded-md p-3 text-sm"
                    />

                    <button
                        onClick={handleSaveRemark}
                        className="mt-4 w-full bg-black text-white py-3 rounded">
                        Save
                    </button>
                </SheetContent>
            </Sheet>

            {/* ===== UPDATE STATUS DIALOG ===== */}
            <Sheet open={updateStatusOpen} onOpenChange={setUpdateStatusOpen}>
                <SheetContent side="bottom" className="rounded-t-2xl p-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-[17px] font-bold text-[#000000]">
                            Update Status
                        </SheetTitle>

                        <button
                            onClick={() => setUpdateStatusOpen(false)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100"
                        >
                            ✕
                        </button>
                    </div>

                    {/* <div className="space-y-2 mt-4"> */}
                    <div className="space-y-2 mt-4 max-h-[55vh] overflow-y-auto pr-3 scrollbar-hide">
                        {statusOptions.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => setSelectedStatus(s.value)}
                                className={`w-full px-4 py-3 rounded-lg border text-left
                                    ${selectedStatus === s.value
                                        ? "bg-black text-[#fff]"
                                        : "bg-[#F5F5FA] text-[#3A59A6]"
                                    }`}>
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleUpdateStatus}
                        className="mt-4 w-full bg-black text-white py-3 rounded">
                        Save
                    </button>
                </SheetContent>
            </Sheet>

            {/* follow_up  */}
            <Sheet open={followUpOpen} onOpenChange={setFollowUpOpen}>
                <SheetContent side="bottom" className="rounded-t-2xl p-4">
                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-2">
                        <SheetTitle className="text-[17px] font-bold text-[#000000]">
                            Schedule Follow Up
                        </SheetTitle>

                        <button
                            onClick={() => setFollowUpOpen(false)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100">
                            ✕
                        </button>
                    </div>

                    {/* QUICK OPTIONS */}
                    <div className="space-y-2">
                        {[
                            "Today",
                            "Tomorrow",
                            "3 days from now",
                            "1 week from now",
                            "1 month from now",
                            "Select custom data and time",
                            "No Follow Up",
                        ].map((item) => (
                            <button
                                key={item}
                                onClick={() => handleQuickOption(item)}
                                className={`w-full border px-4 py-2 rounded-lg text-left flex items-center justify-between
                                    ${item === "No Follow Up"
                                        ? "bg-[#FAF5F5] text-[#CA111A] border-[#FAF5F5]"
                                        : "bg-[#F5F5FA] text-[#3A59A6]"
                                    }`}>
                                <span>{item}</span>
                                {selectedOption === item && (
                                    <Check
                                        size={18}
                                        className={
                                            item === "No Follow Up" ? "text-red-600" : "text-[#3A59A6]"
                                        }
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* DATE + TIME ROW */}
                    {selectedOption !== "No Follow Up" && (
                        <div>
                            {selectedOption === "Select custom data and time" ? (
                                <button
                                    className="w-full border rounded-lg px-3 py-3 flex items-center">
                                    {/* DATE */}
                                    <div
                                        onClick={() => setDatePickerOpen(true)}
                                        className="flex-1 flex items-center justify-between">
                                        <div className="text-left">
                                            <p className="text-[16px] font-medium text-[#3A59A6]">Date</p>
                                            <p className="text-[16px] font-medium text-[#000000] truncate">
                                                {selectedDate || "Select date"}
                                            </p>
                                        </div>
                                        <CalendarDays size={20} className="text-black mt-5 ms-2" />
                                    </div>

                                    <div className="h-8 w-[1px] bg-[#DADADA] mx-2" />

                                    {/* TIME */}
                                    <div
                                        onClick={() => setTimePickerOpen(true)}
                                        className="flex-1 flex items-center justify-between pl-3">
                                        <div className="text-left">
                                            <p className="text-[16px] font-medium text-[#3A59A6]">Time</p>
                                            <p className="text-[16px] font-medium text-[#000000]">
                                                {selectedTime || "Select time"}
                                            </p>
                                        </div>
                                        <ChevronDown size={20} className="text-black mt-4" />
                                    </div>
                                </button>
                            ) : (
                                <button onClick={() => setTimePickerOpen(true)} className="w-full border rounded-lg px-4 py-3 flex items-center justify-between">
                                    <p className="text-[16px] font-medium text-[#3A59A6]">Time</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[16px] font-medium text-[#3A59A6]">
                                            {selectedTime || "Select time"}
                                        </p>
                                        <ChevronDown size={20} className="text-black" />
                                    </div>
                                </button>
                            )}
                        </div>
                    )}

                    {/* SAVE */}
                    <button
                        onClick={handleNextFollowUp}
                        className="mt-4 w-full bg-black text-white py-3 rounded-xl">
                        Save
                    </button>
                </SheetContent>
            </Sheet>

            {/* date  */}
            <Dialog open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <DialogContent className="max-w-[320px] rounded-xl p-4">
                    <p className="text-sm font-semibold mb-2">Select Date</p>

                    <div className="flex items-center justify-between mb-3">
                        <button onClick={handlePrevMonth} className="bg-[#F3F8FE] px-3 py-0.5 rounded-full">
                            ‹
                        </button>

                        <p className="text-[16px] font-semibold">
                            {MONTHS[currentMonth]} {currentYear}
                        </p>

                        <button onClick={handleNextMonth} className="bg-[#F3F8FE] px-3 py-0.5 rounded-full">
                            ›
                        </button>
                    </div>

                    {/* DAYS HEADER */}
                    <div className="grid grid-cols-7 gap-2 text-center text-xs mb-1">
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
                            <span key={d} className="text-gray-400">{d}</span>
                        ))}
                    </div>

                    {/* DAYS GRID */}
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">

                        {/* PREV MONTH DULL DAYS */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => {
                            const day = daysInPrevMonth - firstDayOfMonth + i + 1;
                            return (
                                <span
                                    key={`prev-${i}`}
                                    className="h-8 w-8 flex items-center justify-center text-gray-300"
                                >
                                    {day}
                                </span>
                            );
                        })}

                        {/* CURRENT MONTH DAYS */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const isSelected =
                                tempSelectedDate?.day === i + 1 &&
                                tempSelectedDate?.month === currentMonth &&
                                tempSelectedDate?.year === currentYear;

                            return (
                                <button
                                    key={i}
                                    onClick={() =>
                                        setTempSelectedDate({
                                            day: i + 1,
                                            month: currentMonth,
                                            year: currentYear,
                                        })
                                    }
                                    className={`h-8 w-8 rounded-md
                                        ${isSelected
                                            ? "bg-black text-white"
                                            : "hover:bg-black hover:text-white"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}

                        {/* NEXT MONTH DULL DAYS */}
                        {Array.from({
                            length:
                                (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7,
                        }).map((_, i) => (
                            <span key={`next-${i}`} className="h-8 w-8 flex items-center justify-center text-gray-300">
                                {i + 1}
                            </span>
                        ))}
                    </div>

                    {/* FOOTER BUTTONS */}
                    <div className="flex gap-3 mt-4">
                        <button onClick={() => setDatePickerOpen(false)} className="flex-1 bg-black text-white py-2 rounded-lg">
                            Cancel
                        </button>

                        <button
                            onClick={() => {
                                if (!tempSelectedDate) return;

                                setSelectedDate(
                                    `${tempSelectedDate.day} ${MONTHS[tempSelectedDate.month]} ${tempSelectedDate.year}`
                                );
                                setDatePickerOpen(false);
                            }}
                            className="flex-1 bg-black text-white py-2 rounded-lg">
                            OK
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* time  */}
            <Dialog open={timePickerOpen} onOpenChange={setTimePickerOpen}>
                <DialogContent className="max-w-[320px] rounded-xl p-4">
                    {/* HEADER */}
                    <p className="text-sm font-semibold mb-3 text-center">Select Time</p>

                    <div className="flex justify-between bg-[#F5F5FA] p-4 gap-2">
                        {/* TIME DISPLAY */}
                        <p className="text-center text-[40px] font-bold flex justify-center gap-1">
                            <button
                                onClick={() => setMode("hour")}
                                className={`px-1 rounded ${mode === "hour" ? "text-black" : "text-gray-400"
                                    }`}
                            >
                                {hour}
                            </button>
                            :
                            <button
                                onClick={() => setMode("minute")}
                                className={`px-1 rounded ${mode === "minute" ? "text-black" : "text-gray-400"
                                    }`}
                            >
                                {minute.toString().padStart(2, "0")}
                            </button>
                        </p>

                        {/* AM / PM */}
                        <div className="flex justify-center gap-2 mt-4">
                            {["AM", "PM"].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setAmPm(v as "AM" | "PM")}
                                    className={`h-8 min-w-[60px] rounded-full border text-sm font-medium transition
                                        ${amPm === v
                                            ? "border-[#3A59A6] text-[#3A59A6] bg-white"
                                            : "border-gray-300 text-black bg-white"
                                        }`}>
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border border-[#F1F3F7]"></div>

                    {/* CLOCK */}
                    <div className="relative mx-auto h-56 w-56 rounded-full bg-[#F5F5FA] flex items-center justify-center">

                        {/* CENTER DOT */}
                        <div className="absolute h-2 w-2 bg-black rounded-full z-20" />

                        {/* HAND */}
                        <div
                            className="absolute bg-black rounded-full transition-transform duration-200"
                            style={{
                                width: "4px",
                                height: "90px",
                                bottom: "50%",
                                transformOrigin: "bottom center",
                                transform: `rotate(${mode === "hour"
                                    ? (hour % 12) * 30
                                    : minute * 6
                                    }deg)`
                            }}
                        />

                        {/* NUMBERS */}
                        {[...Array(12)].map((_, i) => {
                            const value =
                                mode === "hour"
                                    ? i === 0 ? 12 : i
                                    : i * 5;

                            const angle = (i * 30 - 90) * (Math.PI / 180);
                            const x = 90 * Math.cos(angle);
                            const y = 90 * Math.sin(angle);

                            const isActive =
                                mode === "hour"
                                    ? value === hour
                                    : value === minute;

                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (mode === "hour") {
                                            setHour(value);
                                            setMode("minute");
                                        } else {
                                            setMinute(value);
                                        }
                                    }}
                                    className={`absolute h-8 w-8 rounded-full text-sm flex items-center justify-center transition
                                    ${isActive
                                            ? "bg-black text-white"
                                            : "hover:bg-black hover:text-white"
                                        }`}
                                    style={{ transform: `translate(${x}px, ${y}px)` }}>
                                    {value.toString().padStart(2, "0")}
                                </button>
                            );
                        })}
                    </div>

                    {/* FOOTER */}
                    <div className="flex gap-3 mt-4">
                        <button onClick={() => setTimePickerOpen(false)} className="flex-1 bg-black text-white py-2 rounded-lg">
                            Cancel
                        </button>

                        <button
                            onClick={() => {
                                setSelectedTime(`${hour}:${minute.toString().padStart(2, "0")} ${amPm}`);
                                setTimePickerOpen(false);
                            }}
                            className="flex-1 bg-black text-white py-2 rounded-lg">
                            OK
                        </button>
                    </div>

                </DialogContent>
            </Dialog>

            {/* ===== BOTTOM FIXED ACTION BAR (MOBILE) ===== */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex gap-3 z-20">
                {/* Call Now */}
                <button onClick={handleCallNow} className="flex-1 flex items-center justify-center border border-[#F8F8F8] gap-2 rounded-xl py-3 text-[14px] font-semibold text-[#1056ED] leading-none">
                    <span className="flex items-center justify-center">
                        <Image
                            src={TimelineCall}
                            alt="Call"
                            width={18}
                            height={18}
                            className="block"
                        />
                    </span>
                    <span className="flex items-center leading-none">
                        Call Now
                    </span>
                </button>

                {/* WhatsApp */}
                <button
                    onClick={handleWhatsApp}
                    className="flex-1 flex items-center justify-center border border-[#F8F8F8] gap-2 rounded-xl py-3 text-[14px] font-semibold text-[#000000]">
                    <Image
                        src={wp}
                        alt="WhatsApp"
                        width={18}
                        height={18}
                    />
                    WhatsApp
                </button>
            </div>

        </div>
    );
}
