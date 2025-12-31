"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Phone, MessageCircle,CheckCircle2, Calendar, User,} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchLeadById, updateLeadRemark,createLeadActivity, updateLeadStatus,} from "@/lib/features/lead-crm/leadcrmApi";
import {Sheet, SheetContent, SheetTitle,} from "@/components/ui/sheet";
import {Dialog,DialogContent,} from "@/components/ui/dialog";
import Image from "next/image";
import wp from "@/assets/wp.png"

const statusOptions = [
    { label: "Lead Received", value: "lead_received" },
    { label: "Interested", value: "interested" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
];

export default function LeadDetailsMobilePage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { selected, loadingDetails } = useAppSelector(
        (state) => state.leadcrm
    );

    /* ================= STATE ================= */
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

    const handleNextFollowUp = () => {
        if (!id) return;

        dispatch(
            createLeadActivity({
                leadId: id as string,
                activityType: "follow_up",
                description: "Follow-up scheduled from mobile.",
            })
        ).then(() => {
            dispatch(fetchLeadById(id as string));
        });
    };

    const formatPhoneNumber = (phone?: string) => {
        if (!phone || phone === "N/A") return null;
        return phone.replace(/[^\d+]/g, "");
    };

    const handleCallNow = () => {
        const phone = formatPhoneNumber(selected?.phoneNumber);
        if (!phone) return alert("Phone number not available");

        window.location.href = `tel:${phone}`;
    };

    const handleWhatsApp = () => {
        const phone = formatPhoneNumber(selected?.phoneNumber);
        if (!phone) return alert("Phone number not available");

        const whatsappNumber = phone.replace(/^\+/, "");
        window.open(`https://wa.me/${whatsappNumber}`, "_blank");
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
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F5F5FA]">

            {/* ================= HEADER ================= */}
            <div className="sticky top-0 bg-white border-b px-4 py-3 z-10">
                <div className="flex items-center justify-between">
                    <button onClick={() => router.back()}>
                        <ArrowLeft size={20} />
                    </button>

                    <div className="text-center flex-1">
                        <p className="text-[15px] font-semibold">
                            {selected.leadName}
                        </p>
                        <p className="text-[11px] text-gray-500">
                            {selected.date}
                        </p>
                    </div>

                    <div className="w-6" />
                </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="p-4 space-y-4">

                {/* ===== DETAILS TITLE ===== */}
                <h3 className="text-[16px] font-bold text-[#000000]">
                    Details
                </h3>

                {/* ===== DETAILS CARD ===== */}
                <div className="bg-white text-[#929292] rounded-xl border p-4 space-y-4">
                    {/* Phone Number */}
                    <div>
                        <p className="text-[13px] font-medium text-[#929292]">
                            Phone Number
                        </p>
                        <p className="text-[14px] font-semibold text-black mt-0.5">
                            {selected.phoneNumber || "N/A"}
                        </p>
                    </div>

                    {/* Project ID */}
                    <div>
                        <p className="text-[13px] font-medium text-[#929292]">
                            Project ID
                        </p>
                        <p className="text-[14px] font-semibold text-black mt-0.5">
                            {selected.projectId || "N/A"}
                        </p>
                    </div>

                    {/* Source */}
                    <div>
                        <p className="text-[13px] font-medium text-[#929292]">
                            Source
                        </p>
                        <p className="text-[14px] font-semibold text-black mt-0.5">
                            {selected.source || "N/A"}
                        </p>
                    </div>

                    {/* IP Address */}
                    <div>
                        <p className="text-[13px] font-medium text-[#929292]">
                            IP Address
                        </p>
                        <p className="text-[14px] font-semibold text-black mt-0.5">
                            {selected.ipAddress || "N/A"}
                        </p>
                    </div>
                </div>


                {/* ===== REMARKS CARD ===== */}
                <div className="bg-white rounded-xl border p-4">
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

                    <div className="rounded-md bg-white border p-3">
                        <p className="text-[13px] text-black">
                            {selected.remark || "No remarks"}
                        </p>
                    </div>

                    {/* ===== NEXT FOLLOW UP BUTTON ===== */}
                    <div className="grid grid-cols-1 gap-3 mt-2">

                        {/* ===== NEXT FOLLOW UP ===== */}
                        <button
                            onClick={() => setFollowUpOpen(true)}
                            className="flex items-center rounded-xl border bg-[#F5F5FA] px-4 py-3 text-[15px] font-medium text-[#3A59A6]"
                        >
                            <div className="h-9 w-9 flex items-center justify-center">
                                <Calendar size={20} className="text-[#3A59A6]" />
                            </div>

                            <span className="text-left">
                                Next Follow Up
                            </span>
                        </button>

                        {/* ===== UPDATE STATUS ===== */}
                        <button
                            onClick={() => setUpdateStatusOpen(true)}
                            className="flex items-center rounded-xl bg-[#F5F5FA] px-4 py-3 text-[15px] font-semibold text-[#3A59A6]"
                        >
                            <div className="h-9 w-9 flex items-center justify-center">
                                <Calendar size={20} className="text-[#3A59A6]" />
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
                <div className="bg-white rounded-xl border p-4 mb-16">
                    {selected.timeline && selected.timeline.length > 0 ? (
                        <div className="space-y-4">
                            {selected.timeline.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="mt-0.5">
                                        <TimelineIcon type={item.activityType} />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-[11px] text-gray-500 mb-0.5">
                                            {item.formattedDate || item.activityDate}
                                        </p>
                                        <p className="text-[13px] text-gray-800 leading-snug">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
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
                        <SheetTitle className="text-[16px] font-semibold">
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
                        <SheetTitle className="text-[16px] font-semibold">
                            Update Status
                        </SheetTitle>

                        <button
                            onClick={() => setUpdateStatusOpen(false)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-2 mt-4">
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
                        <SheetTitle className="text-[16px] font-semibold">
                            Schedule Follow Up
                        </SheetTitle>

                        <button
                            onClick={() => setFollowUpOpen(false)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100"
                        >
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
                            "Someday",
                            "No Follow Up",
                        ].map((item) => (
                            <button
                                key={item}
                                className="w-full border px-4 py-3 rounded-lg text-left"
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* DATE + TIME ROW */}
                    <div className="flex gap-3 mt-3">
                        {/* DATE */}
                        <button
                            onClick={() => setDatePickerOpen(true)}
                            className="flex-1 border rounded-lg px-4 py-3 text-left"
                        >
                            <p className="text-[12px] text-gray-500">Date</p>
                            <p className="text-[14px] font-semibold">
                                {selectedDate || "Select date"}
                            </p>
                        </button>

                        {/* TIME */}
                        <button
                            onClick={() => setTimePickerOpen(true)}
                            className="flex-1 border rounded-lg px-4 py-3 text-left"
                        >
                            <p className="text-[12px] text-gray-500">Time</p>
                            <p className="text-[14px] font-semibold">
                                {selectedTime || "Select time"}
                            </p>
                        </button>
                    </div>

                    {/* SAVE */}
                    <button className="mt-4 w-full bg-black text-white py-3 rounded-xl">
                        Save
                    </button>
                </SheetContent>
            </Sheet>

            <Dialog open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <DialogContent className="max-w-[320px] rounded-xl p-4">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-semibold">Select Date</p>
                        <button onClick={() => setDatePickerOpen(false)}>✕</button>
                    </div>

                    {/* MONTH */}
                    <p className="text-center text-sm font-medium mb-2">
                        January 2025
                    </p>

                    {/* DAYS GRID */}
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                        {["S", "M", "T", "W", "T", "F", "S"].map(d => (
                            <span key={d} className="text-gray-400">{d}</span>
                        ))}

                        {[...Array(31)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setSelectedDate(`${i + 1} Jan 2025`);
                                    setDatePickerOpen(false);
                                }}
                                className="h-8 w-8 rounded-full hover:bg-black hover:text-white"
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={timePickerOpen} onOpenChange={setTimePickerOpen}>
                <DialogContent className="max-w-[300px] rounded-xl p-4">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-semibold">Select Time</p>
                        <button onClick={() => setTimePickerOpen(false)}>✕</button>
                    </div>

                    {/* WATCH UI */}
                    <div className="flex justify-center gap-4">

                        {/* HOURS */}
                        <div className="h-40 overflow-y-scroll">
                            {[...Array(12)].map((_, i) => (
                                <button
                                    key={i}
                                    className="block py-2 px-4 text-sm hover:bg-black hover:text-white rounded"
                                    onClick={() => setSelectedTime(`${i + 1}:00 AM`)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        {/* MINUTES */}
                        <div className="h-40 overflow-y-scroll">
                            {["00", "15", "30", "45"].map(m => (
                                <button
                                    key={m}
                                    className="block py-2 px-4 text-sm hover:bg-black hover:text-white rounded"
                                    onClick={() => setSelectedTime(`6:${m} AM`)}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        {/* AM / PM */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setSelectedTime(prev => prev?.replace("PM", "AM") || "6:00 AM")}
                                className="px-4 py-2 border rounded"
                            >
                                AM
                            </button>
                            <button
                                onClick={() => setSelectedTime(prev => prev?.replace("AM", "PM") || "6:00 PM")}
                                className="px-4 py-2 border rounded"
                            >
                                PM
                            </button>
                        </div>
                    </div>

                    {/* SAVE */}
                    <button
                        onClick={() => setTimePickerOpen(false)}
                        className="mt-4 w-full bg-black text-white py-2 rounded-lg"
                    >
                        Save
                    </button>
                </DialogContent>
            </Dialog>

            {/* ===== BOTTOM FIXED ACTION BAR (MOBILE) ===== */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex gap-3 z-20">
                {/* Call Now */}
                <button
                    onClick={handleCallNow}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold text-[#1056ED]"
                >
                    <Phone size={18} />
                    Call Now
                </button>

                {/* WhatsApp */}
                <button
                    onClick={handleWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold text-[#000000]"
                >
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

/* ================= SMALL COMPONENTS ================= */

function Info({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <div>
            <p className="text-[12px] text-gray-500 font-medium">
                {label}
            </p>
            <p className="text-[13px] text-black font-semibold">
                {value || "N/A"}
            </p>
        </div>
    );
}

function TimelineIcon({ type }: { type: string }) {
    switch (type?.toLowerCase()) {
        case "phone_call":
            return <Phone size={14} className="text-green-600" />;
        case "whatsapp":
        case "message":
            return <MessageCircle size={14} className="text-green-600" />;
        case "status_change":
            return <CheckCircle2 size={14} className="text-blue-600" />;
        case "visit":
            return <Calendar size={14} className="text-blue-600" />;
        case "follow_up":
            return <Clock size={14} className="text-blue-600" />;
        default:
            return <User size={14} className="text-gray-500" />;
    }
}
