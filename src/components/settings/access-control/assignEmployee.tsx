"use client";

import { Search, X, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchUsers, updateUser } from "@/lib/features/user/userApi";

export default function AssignEmployee({ roleId }: { roleId: string | null }) {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    if (!search) return users;

    return users.filter((u) =>
      `${u.firstName ?? ""} ${u.lastName ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, users]);

  const isAssigned = (id: string) => assignedUsers.some((u) => u._id === id);

  const toggleAssign = (user: any) => {
    setAssignedUsers((prev) => {
      if (prev.some((u) => u._id === user._id)) {
        return prev.filter((u) => u._id !== user._id);
      }
      return [...prev, user];
    });
  };

  useEffect(() => {
    if (!roleId) return;

    const alreadyAssigned = users.filter(
      (u) => u.role && typeof u.role === "object" && u.role._id === roleId
    );

    setAssignedUsers(alreadyAssigned);
  }, [roleId, users]);


  const handleConfirmAssign = async () => {
    if (!roleId) return;

    try {
      await Promise.all(
        assignedUsers.map((user) =>
          dispatch(
            updateUser({
              id: user._id,
              role: roleId,
            })
          ).unwrap()
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to assign users");
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
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

      <div className="flex-1 min-h-[68vh] overflow-y-auto px-4 py-4">
        {loading ? (
          <p className="text-sm text-gray-500 text-center">
            Loading users...
          </p>
        ) : filteredUsers.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-500">
              No users found
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => {
              const assigned = isAssigned(user._id);

              return (
                <div
                  key={user._id}
                  onClick={() => toggleAssign(user)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition
                    ${assigned
                      ? "bg-green-50 border border-green-300"
                      : "bg-[#F4F8FF]"
                    }`}
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

                  {assigned ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t px-4 py-4 bg-white">
        <button
          onClick={handleConfirmAssign}
          disabled={assignedUsers.length === 0}
          className={`w-full rounded-lg py-3 text-sm font-semibold text-white
            ${assignedUsers.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-black"
            }`}
        >
          Assign Selected ({assignedUsers.length})
        </button>
      </div>
    </div>
  );
}
