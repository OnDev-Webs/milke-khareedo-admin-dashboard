"use client";

import { useEffect, useRef, useState } from "react";
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
};

export default function CustomDropdown({
  items,
  placeholder = "Select option",
  defaultValue,
  onSelect,
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
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

  const handleSelect = (item: DropdownItem) => {
    setSelectedLabel(getLabel(item));
    onSelect?.(item);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative min-w-44 ${className}`}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md flex items-center justify-between gap-2 border p-2 cursor-pointer select-none"
      >
        <span className="truncate">{selectedLabel}</span>

        <ChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </div>

      {open && (
        <div className="absolute top-full mt-2 left-0 w-full max-h-36 overflow-y-auto border rounded shadow-md bg-white z-50">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              className="px-3 py-2 hover:bg-neutral-100 cursor-pointer"
            >
              {getLabel(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
