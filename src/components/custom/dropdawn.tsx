"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type DropdownProps = {
  items: any[];
  placeholder?: string;
  defaultValue?: string;
  onSelect?: (value: string) => void;
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
  const [selected, setSelected] = useState(defaultValue || placeholder);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ✅ Close when clicked outside – safe for Next.js hydration
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

  const handleSelect = (item: string) => {
    setSelected(item);
    onSelect?.(item);
    setOpen(false);
  };

  return (
    <div  ref={wrapperRef} className={`relative w-fit min-w-44 ${className}`}>
      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 border p-2  cursor-pointer bg-neutral-900 select-none"
      >
        <div className="flex gap-2 items-center overflow-hidden">
          {/* <div className="size-6 bg-white rounded shrink-0" /> */}
          <span className="text-white truncate">{selected}</span>
        </div>

        <ChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </div>

      {/* List */}
      {open && (
        <div className="absolute top-full mt-2 left-0 w-full bg-[#262626] border rounded shadow-md z-999">
          {items.map((item) => (
            <div
              key={item}
              onClick={() => handleSelect(item)}
              className="px-3 py-2 text-white hover:bg-neutral-700 cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
