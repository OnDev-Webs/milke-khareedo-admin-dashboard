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
  addButton?: {
    buttonName: string;
    url: string;
  };
};

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
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
  addButton
}: TableSearchProps<T>) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, debounceMs);
  
  const prevFilteredDataRef = useRef<T[]>(data);

  const normalizedQuery = useMemo(
    () => debouncedQuery.trim().toLocaleLowerCase(),
    [debouncedQuery]
  );

  const filteredData = useMemo(() => {
    if (!searchKeys.length) return data;

    if (normalizedQuery.length < minQueryLength) return data;
    
    return data.filter((row) =>
      searchKeys.some((key) => {
        const value = row[key];
        if (value === null || value === undefined) return false;
        
        const stringValue = typeof value === 'number' 
          ? value.toString() 
          : String(value);
        
        return stringValue
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      })
    );
  }, [normalizedQuery, data, searchKeys, minQueryLength]);

  useEffect(() => {
    if (setFilteredData && 
        JSON.stringify(filteredData) !== JSON.stringify(prevFilteredDataRef.current)) {
      setFilteredData(filteredData);
      prevFilteredDataRef.current = filteredData;
    }
  }, [filteredData, setFilteredData]);

  useEffect(() => {
    if (!onSearch) return;
    
    if (normalizedQuery.length >= minQueryLength) {
      onSearch(normalizedQuery);
    } else {
      onSearch("");
    }
  }, [normalizedQuery, onSearch, minQueryLength]);

  const clearSearch = () => {
    if (query === "") return;

    setQuery("");
    resetSort?.();
    inputRef.current?.focus();
    
    if (setFilteredData) {
      setFilteredData([...data]);
      prevFilteredDataRef.current = [...data];
    }
  };

  return (
    <div
      className={`px-3 border-b py-1 flex gap-3 items-center ${className} ${addButton ? "" : "py-3"}`}
      role="search"
    >
      <div className="relative flex-1 flex items-center">
        <Search className="w-4 h-4 text-neutral-400 absolute left-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent placeholder:text-neutral-500 focus:outline-none text-sm pl-6 pr-8"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-0 hover:cursor-pointer rounded-full flex items-center justify-center"
            aria-label="Clear search"
            type="button"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      
      {addButton && (
        <button className="p-2 border rounded bg-foreground text-white hover:bg-foreground/90 transition-colors">
          <a href={addButton.url} className="whitespace-nowrap px-1">
            {addButton.buttonName}
          </a>
        </button>
      )}
      
      {/* {query && normalizedQuery.length >= minQueryLength && (
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {filteredData.length} of {data.length} results
        </span>
      )} */}
    </div>
  );
}