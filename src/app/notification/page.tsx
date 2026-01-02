"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchNotifications, markAllNotificationsAsRead } from "@/lib/features/lead-crm/leadcrmApi";
import { CheckCheck } from "lucide-react";


export default function NotificationsPage() {
    const dispatch = useAppDispatch();

    const { notifications, notificationLoading } = useAppSelector(
        (state) => state.leadcrm
    );

    const finalNotifications = notifications || [];

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsAsRead());
    };

    return (
        <div className="p-4 bg-[#F5F5FA] min-h-screen">
            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-[#F5F5FA] mb-4 pt-6">
                <div className="flex items-center h-12 px-2 relative">
                    {/* BACK BUTTON (LEFT) */}
                    <button
                        onClick={() => window.history.back()}
                        className="p-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-black"
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

                    {/* CENTER TITLE */}
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-black">
                        Notifications
                    </h1>

                    {/* MARK ALL READ (RIGHT) */}
                    <button
                        onClick={() => dispatch(markAllNotificationsAsRead())}
                        className="ml-auto flex items-center gap-1 text-[13px] font-medium bg-white text-[#000000] px-2 py-1 rounded-2xl"
                    >
                        <CheckCheck size={14} className="text-black" />
                        <span>All read</span>
                    </button>
                </div>
            </div>

            {/* LOADING */}
            {notificationLoading && (
                <p className="text-sm text-gray-500">Loading notifications...</p>
            )}

            {/* EMPTY STATE */}
            {!notificationLoading && notifications.length === 0 && (
                <p className="text-sm text-gray-500 py-6">
                    No notifications available
                </p>
            )}

            {/* NOTIFICATION LIST */}
            <div className="space-y-6">
                {finalNotifications.map((group) => (
                    <div key={group.dateLabel}>
                        <div className="flex justify-center mb-4">
                            <p className="px-3 py-1 text-[12px] font-medium text-black bg-white rounded-full">
                                {group.dateLabel}
                            </p>
                        </div>

                        <div className="space-y-2">
                            {group.notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`rounded-lg p-3 border ${notification.isRead
                                        ? "bg-white"
                                        : "bg-[#EAF1FF] border-[#C7D7FF]"
                                        }`}
                                >
                                    <p className="text-sm font-semibold">
                                        {notification.title}
                                    </p>

                                    <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                                        {notification.message}
                                    </p>

                                    <div className="flex justify-between mt-2">
                                        <span className="text-[11px] text-gray-400">
                                            {notification.timeAgo}
                                        </span>

                                        {!notification.isRead && (
                                            <span className="h-2 w-2 rounded-full bg-[#FF6E71]" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}
