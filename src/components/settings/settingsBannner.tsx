import img from "@/assets/loginImg.jpg";

export default function SettingsHeader() {
  return (
    <div className="p-10 my-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl">
      <div className="flex items-center gap-6">
        <div className="size-30 bg-gray-200 rounded-full overflow-hidden">
          <img
            src={img?.src}
            alt="profile-pic"
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-8 py-1">Hello, Shivam!</h2>
          <p className="text-xl leading-4 text-gray-500 font-normal dark:text-gray-400">
            Welcome to Brandname. it's december 17th, 2025.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 col-start-3">
        
      </div>
    </div>
  );
}
