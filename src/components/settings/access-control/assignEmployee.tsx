import { X, Search } from "lucide-react";

const users = [
  { name: "John Deo", avatar: "/1.png" },
  { name: "Simarn Jos", avatar: "/1.png" },
  { name: "Jishan Sikh", avatar: "/1.png" },
  { name: "Minaxi Jon", avatar: "/1.png" },
  { name: "Simarn Jos", avatar: "/1.png" },
  { name: "Jishan Sikh", avatar: "/1.png" },
  { name: "Minaxi Jon", avatar: "/1.png" },
  { name: "Simarn Jos", avatar: "/1.png" },
  { name: "Jishan Sikh", avatar: "/1.png" },
 
];

export default function AssignEmployee() {
  return (
    <div className="w-full max-w-2xl bg-white rounded-xl relative flex flex-col px-4 h-[90vh] justify-between pb-2">
      <div className="">
        <div className="">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search user"
            className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      <div className=" py-4 space-y-3 flex-1">
        {users.map((user) => (
          <div
            key={user.name}
            className="flex items-center justify-between rounded-lg bg-[#F4F8FF] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
            </div>

            <button className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      </div>

      <div className="">
        <button className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white">
          Add New User
        </button>
      </div>
    </div>
  );
}
