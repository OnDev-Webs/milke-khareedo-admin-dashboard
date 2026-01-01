"use client";
import homy from "@/assets/homy.png";
import settingImg from "@/assets/settingImg.png";
import Image from "next/image";
import { useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";

export default function SettingsHeader() {
  const { firstName, profileImage } = useAppSelector((state) => state.auth);
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    // Generate current date on frontend
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    setCurrentDate(formattedDate);
  }, []);

  // Use profile image or default
  const displayImage = profileImage && profileImage.trim() !== ""
    ? profileImage
    : homy.src;

  // Get first name or fallback
  const displayName = firstName || "Admin";

  return (
    <div
      className="relative p-10 my-4 border-2 border-gray-100 rounded-2xl overflow-hidden"
      style={{
        backgroundImage: `url(${settingImg.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "103%",
        backgroundPosition: "0% 46%",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex items-center gap-6">
        {/* Avatar */}
        <div className="relative size-30 rounded-full overflow-hidden border-2 border-white bg-gray-200">
          <Image
            src={displayImage}
            alt="Profile"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">
            Hello, {displayName}!
          </h2>
          <p className="text-xl text-gray-200">
            Welcome to Milke Khareedo. it's {currentDate}.
          </p>
        </div>
      </div>
    </div>
  );
}
