"use client";

import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import {
  Agent,
  fetchAgentRoles,
  fetchRelationshipManagers,
} from "@/lib/features/role/roleApi";
import { FiChevronDown } from "react-icons/fi";

export default function AddRelationshipManagerForm() {
  const dispatch = useAppDispatch();

  const { agents, managers, loading } = useAppSelector(
    (state: RootState) => state.roles
  );

  const [rmSearch, setRmSearch] = useState("");
  const [agentSearch, setAgentSearch] = useState("");

  const [relationshipManager, setRelationshipManager] =
    useState<Agent | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);

  const [showRMList, setShowRMList] = useState(false);
  const [showAgentList, setShowAgentList] = useState(false);

  const rmRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchAgentRoles());
    dispatch(fetchRelationshipManagers());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rmRef.current && !rmRef.current.contains(event.target as Node)) {
        setShowRMList(false);
      }
      if (
        agentRef.current &&
        !agentRef.current.contains(event.target as Node)
      ) {
        setShowAgentList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredManagers = managers.filter((m) =>
    m.name.toLowerCase().includes(rmSearch.toLowerCase())
  );

  const filteredAgents = agents
    .filter((a) =>
      a.name.toLowerCase().includes(agentSearch.toLowerCase())
    )
    .filter((a) => !selectedAgents.some((sa) => sa._id === a._id));

  return (
    <div className="h-[80vh] bg-white p-6 overflow-y-auto">
      {loading && <p>Loading...</p>}

      {/* ================= RELATIONSHIP MANAGER ================= */}
      <div className="mb-6 relative" ref={rmRef}>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Relationship Manager
        </h3>
        <fieldset
          className="border px-4 py-2 rounded-md cursor-pointer flex items-center justify-between"
          onClick={() => setShowRMList((prev) => !prev)}
        >
          <legend className="text-xs font-semibold text-gray-700">
            Select Relationship Manager*
          </legend>

          <span className="text-sm text-gray-700">
            {relationshipManager ? relationshipManager.name : "Select RM"}
          </span>

          <FiChevronDown
            className={`ml-2 text-gray-500 transition-transform duration-200 ${showRMList ? "rotate-180" : ""
              }`}
          />
        </fieldset>

        {showRMList && (
          <div className="absolute z-30 mt-1 w-full bg-white border rounded-lg shadow">
            <input
              type="text"
              value={rmSearch}
              onChange={(e) => setRmSearch(e.target.value)}
              placeholder="Search RM"
              className="w-full px-3 py-2 text-sm border-b outline-none"
            />

            <ul className="max-h-56 overflow-auto">
              {filteredManagers.map((rm) => (
                <li
                  key={rm._id}
                  onClick={() => {
                    setRelationshipManager(rm);
                    setShowRMList(false);
                    setRmSearch("");
                  }}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {rm.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {relationshipManager && (
        <div className="mb-8 max-w-sm overflow-hidden rounded-2xl shadow">
          <div className="relative">
            <img
              src={relationshipManager.profileImage || "/default-avatar.png"}
              alt="RM"
              className="h-72 w-full object-cover"
            />

            <div className="absolute -bottom-px rounded-2xl overflow-hidden p-px bg-linear-to-r from-white via-neutral-400/40 to-white w-full">
              <div className="bg-neutral-400/40 px-4 py-3 backdrop-blur-[55px] text-white rounded-2xl">
                <p className="text-lg font-semibold">
                  {relationshipManager.name}
                </p>
                <p className="text-base">
                  {relationshipManager.email || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= LEAD DISTRIBUTION AGENTS ================= */}
      <div className="mb-4 relative" ref={agentRef}>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Lead Distribution
        </h3>

        <fieldset
          className="border px-4 py-2 rounded-md cursor-pointer flex items-center justify-between"
          onClick={() => setShowAgentList((prev) => !prev)}
        >
          <legend className="text-xs font-semibold text-gray-700">
            Add agents (optional)
          </legend>

          <span className="text-sm text-gray-700">
            {selectedAgents.length > 0
              ? `${selectedAgents.length} agent(s) selected`
              : "Select agents"}
          </span>

          <FiChevronDown
            className={`ml-2 text-gray-500 transition-transform duration-200 ${showAgentList ? "rotate-180" : ""
              }`}
          />
        </fieldset>

        {showAgentList && (
          <div className="absolute z-30 mt-1 w-full bg-white border rounded-lg shadow">
            <input
              type="text"
              value={agentSearch}
              onChange={(e) => setAgentSearch(e.target.value)}
              placeholder="Search agents"
              className="w-full px-3 py-2 text-sm border-b outline-none"
            />

            <ul className="max-h-56 overflow-auto">
              {filteredAgents.map((agent) => (
                <li
                  key={agent._id}
                  onClick={() => {
                    setSelectedAgents([...selectedAgents, agent]);
                    setAgentSearch("");
                  }}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {agent.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ================= SELECTED AGENTS ================= */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {selectedAgents.map((agent) => (
          <div
            key={agent._id}
            className="max-w-sm overflow-hidden rounded-2xl shadow">
            <div className="relative">
              <img
                src={agent.profileImage || "/default-avatar.png"}
                alt="Agent"
                className="h-72 w-full object-cover"
              />
              <div className="absolute -bottom-px rounded-2xl overflow-hidden p-px bg-linear-to-r from-white via-neutral-400/40 to-white w-full">
                <div className="bg-neutral-400/40 px-4 py-3 backdrop-blur-[55px] text-white rounded-2xl">
                  <p className="text-lg font-semibold">{agent.name}</p>
                  <p className="text-base">{agent.email || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
