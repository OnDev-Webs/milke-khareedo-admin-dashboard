"use client";

import { useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

const USERS: User[] = [
  {
    id: "1",
    name: "XYZ",
    email: "xyz@milkshareedo.com",
    avatar:
      "https://plus.unsplash.com/premium_photo-1724853266875-f304906144a7?w=900",
  },
  {
    id: "2",
    name: "ABC",
    email: "abc@milkshareedo.com",
    avatar:
      "https://plus.unsplash.com/premium_photo-1724853266875-f304906144a7?w=900",
  },
];

export default function AddRelationshipManagerForm() {
  const [rmSearch, setRmSearch] = useState("");
  const [agentSearch, setAgentSearch] = useState("");

  const [relationshipManager, setRelationshipManager] =
    useState<User | null>(null);

  const [agents, setAgents] = useState<User[]>([]);

  const addRM = () => {
    const rm = USERS.find((u) =>
      u.name.toLowerCase().includes(rmSearch.toLowerCase())
    );
    if (!rm) return;

    setRelationshipManager(rm);
    setRmSearch("");
  };

  const addAgent = () => {
    const agent = USERS.find((u) =>
      u.name.toLowerCase().includes(agentSearch.toLowerCase())
    );
    if (!agent) return;
    if (agents.some((a) => a.id === agent.id)) return;

    setAgents([...agents, agent]);
    setAgentSearch("");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <fieldset className=" border px-4 rounded-md pb-1.5">
            <legend className="text-xs font-semibold text-gray-700">
              Select Relationship Manager*
            </legend>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={rmSearch}
                onChange={(e) => setRmSearch(e.target.value)}
                placeholder="Type three characters to search"
                className="flex-1 rounded-lg outline-none px-3 py-2 text-sm"
              />

              <button
                type="button"
                onClick={addRM}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Add +
              </button>
            </div>
          </fieldset>

          <p className="mt-1 text-[11px] text-gray-400">
            Choose the primary RM for this project.
          </p>
        </div>

        {relationshipManager && (
          <div className="mb-8 max-w-sm overflow-hidden rounded-2xl shadow">
            <div className="relative">
              <img
                src={relationshipManager.avatar}
                alt="RM"
                className="h-72 w-full object-cover"
              />

              <div className="absolute -bottom-px rounded-2xl overflow-hidden p-px  bg-linear-to-r from-white via-70% via-neutral-400/40 to-white w-full">
                <div className="bg-neutral-400/40 px-4 py-3 backdrop-blur-[55px] text-white rounded-2xl">
                  <p className="text-lg font-semibold ">
                    {relationshipManager.name}
                  </p>
                  <p className="text-base">
                    {relationshipManager.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className=" mb-2 text-sm font-semibold text-gray-900">
            Lead Distribution
          </h3>

          <fieldset className=" border px-4 rounded-md pb-1.5">
            <legend className="text-xs font-semibold text-gray-700">
              Add agents (optional)
            </legend>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                placeholder="Type three characters to search"
                className="flex-1 rounded-lg outline-none px-3 py-2 text-sm"
              />

              <button
                type="button"
                onClick={addAgent}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Add +
              </button>
            </div>
          </fieldset>

          <p className="mt-1 text-[11px] text-gray-400">
            Add sales agents who will also receive project leads.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="max-w-sm overflow-hidden rounded-2xl shadow"
            >
              <div className="relative">
                <img
                  src={agent.avatar}
                  alt="Agent"
                  className="h-72 w-full object-cover"
                />

                <div className="absolute -bottom-px rounded-2xl overflow-hidden p-px  bg-linear-to-r from-white via-70% via-neutral-400/40 to-white w-full">
                  <div className="bg-neutral-400/40 px-4 py-3 backdrop-blur-[55px] text-white rounded-2xl">
                    <p className="text-lg font-semibold ">
                      {agent.name}
                    </p>
                    <p className="text-base">{agent.email}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
