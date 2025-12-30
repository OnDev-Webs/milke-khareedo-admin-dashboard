import homy from "@/assets/homy.png";
import settingImg from "@/assets/settingImg.png";
import Image from "next/image";

export default function SettingsHeader() {
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
            src={homy}
            alt="homy"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">
            Hello, Shivam!
          </h2>
          <p className="text-xl text-gray-200">
            Welcome to Brandname. it's december 17th, 2025.
          </p>
        </div>
      </div>
    </div>
  );
}
