"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type TableSearchProps<T> = {
  data: T[];
  setFilteredData?: (data: T[]) => void;
  onSearch?: (query: string) => void;
  searchKeys?: (keyof T)[];
  placeholder?: string;
  debounceMs?: number;
  minQueryLength?: number;
  className?: string;
  resetSort?: () => void;
};

function useDebounce<T>(value: T, delay = 300) {
  const [debouced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debouced;
}

export default function CustomTableSearchBar<T extends Record<string, any>>({
  data,
  setFilteredData,
  onSearch,
  searchKeys = [],
  placeholder = "Search...",
  debounceMs = 300,
  minQueryLength = 1,
  className = "",
  resetSort,
}: TableSearchProps<T>) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, debounceMs);

  const normalizedQuery = useMemo(
    () => debouncedQuery.trim().toLocaleLowerCase(),
    [debouncedQuery]
  );

  const filteredData = useMemo(() => {
    if (!searchKeys.length) return data;

    if (normalizedQuery.length < minQueryLength) return data;
    return data.filter((row) =>
      searchKeys.some((key) =>
        String(row[key] ?? "")
          .toLocaleLowerCase()
          .includes(normalizedQuery)
      )
    );
  }, [normalizedQuery, data, searchKeys, minQueryLength]);

  // useEffect(() => {
  //   setFilteredData?.(filteredData);
  // }, [filteredData]);

  useEffect(() => {
    if (!onSearch) return;
    if (normalizedQuery.length >= minQueryLength) {
      onSearch(normalizedQuery);
    }
  }, [normalizedQuery, onSearch, minQueryLength]);

  const clear = () => {
    if (query === "") return;

    setQuery("");
    resetSort?.();
    inputRef.current?.focus();
    setFilteredData?.([...data]);
  };

  return (
    <div
      className={` px-3 border-b py-1 flex gap-3 items-center ${className} `}
      role="search"
    >
      <Search className="w-4 h-4 text-neutral-400" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent placeholder:text-neutral-500 focus:outline-none text-sm"
      />
      {query && (
        <button
          onClick={clear}
          className="hover:bg-black/20 rounded  pr-2"
          aria-label="Clear search "
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <button className="p-1 border rounded bg-foreground text-white">
        <a href="/properties/add-property" className="whitespace-nowrap px-1">
          Add new property
        </a>
      </button>
    </div>
  );
}
