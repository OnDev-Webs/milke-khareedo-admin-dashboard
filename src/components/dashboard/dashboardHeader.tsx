export default function DashboardHeader() {
  return (
    <div className="grid grid-cols-3 p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="size-20 bg-gray-200 rounded-full"></div>
        <div>
          <h2 className="text-lg font-semibold">Hello, John Deo!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome to Brandname. it's January 23rd, 2022.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 col-start-3">
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}