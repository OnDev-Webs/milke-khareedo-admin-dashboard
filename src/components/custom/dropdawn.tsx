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
    <div ref={wrapperRef} className={`relative w-fit min-w-44 ${className}`}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md flex items-center justify-between gap-2 border p-2  cursor-pointer  select-none"
      >
        <div className="flex gap-2 items-center overflow-hidden">
          <span className=" truncate">{selected}</span>
        </div>

        <ChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </div>

      {open && (
        <div className="absolute h-36 overflow-y-auto top-full mt-2 left-0 w-full border rounded shadow-md z-999 bg-white">
          {items.map((item) => (
            <div
              key={item}
              onClick={() => handleSelect(item)}
              className="px-3 py-2 hover:bg-neutral-100 cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
