"use client";

import { X, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchUsers } from "@/lib/features/user/userApi";

export default function AssignEmployee() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    setAssignedUsers(users);
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (!search) return assignedUsers;

    return assignedUsers.filter((u) =>
      `${u.firstName ?? ""} ${u.lastName ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, assignedUsers]);

  const removeUser = (id: string) => {
    setAssignedUsers((prev) =>
      prev.filter((u) => u._id !== id)
    );
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* ===== Search ===== */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user"
            className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* ===== Users List ===== */}
      <div className="flex-1 min-h-[68vh] overflow-y-auto px-4 py-4">
        {loading ? (
          <p className="text-sm text-gray-500 text-center">
            Loading users...
          </p>
        ) : filteredUsers.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-500">
              No users assigned
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between rounded-lg bg-[#F4F8FF] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                    <img
                      src={user.profileImage || "/1.png"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>

                <button
                  onClick={() => removeUser(user._id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Footer ===== */}
      <div className="border-t px-4 py-4 bg-white">
        <button className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white">
          Add New User
        </button>
      </div>
    </div>
  );
}
