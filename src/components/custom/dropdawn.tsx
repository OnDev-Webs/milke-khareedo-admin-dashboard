"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

type DropdownItem =
  | string
  | {
      label: string;
      value: any;
    };

type DropdownProps = {
  items: DropdownItem[];
  placeholder?: string;
  defaultValue?: string;
  onSelect?: (item: DropdownItem) => void;
  className?: string;
  bordernone?: boolean;
  searchable?: boolean; 
};

export default function CustomDropdown({
  items,
  placeholder = "Select option",
  defaultValue,
  onSelect,
  className = "",
  bordernone = false,
  searchable = true,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLabel, setSelectedLabel] = useState(
    defaultValue || placeholder
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLabel = (item: DropdownItem) =>
    typeof item === "string" ? item : item.label;

  const filteredItems = useMemo(() => {
    if (!searchable || !search) return items;
    return items.filter((item) =>
      getLabel(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search, searchable]);

  const handleSelect = (item: DropdownItem) => {
    setSelectedLabel(getLabel(item));
    onSelect?.(item);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={wrapperRef} className={`relative min-w-44 ${className}`}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`rounded-md flex items-center justify-between gap-2 cursor-pointer select-none
        ${bordernone ? "" : "border p-2"}`}>
        <span className="truncate text-sm">{selectedLabel}</span>

        <ChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute top-full mt-2 left-0 w-full border rounded-md shadow-md bg-white z-50">
          {searchable && (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border-b outline-none"
            />
          )}

          {/* LIST */}
          <div className="max-h-40 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="px-3 py-2 text-sm hover:bg-neutral-100 cursor-pointer"
                >
                  {getLabel(item)}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
