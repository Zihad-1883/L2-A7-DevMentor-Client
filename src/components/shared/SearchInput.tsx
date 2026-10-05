"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export default function SearchInput({
  value: controlledValue,
  onChange,
  onClear,
  placeholder = "Search...",
  className,
  debounceMs = 300,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = React.useState(controlledValue ?? "");
  const [prevControlledValue, setPrevControlledValue] = React.useState(controlledValue);

  if (controlledValue !== undefined && controlledValue !== prevControlledValue) {
    setPrevControlledValue(controlledValue);
    setInternalValue(controlledValue);
  }

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange && internalValue !== (controlledValue ?? "")) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [internalValue, onChange, controlledValue, debounceMs]);

  const handleClear = () => {
    setInternalValue("");
    if (onChange) onChange("");
    if (onClear) onClear();
  };

  return (
    <div
      className={cn(
        "relative flex items-center w-full max-w-sm rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-2xs transition-colors focus-within:border-amber focus-within:ring-2 focus-within:ring-amber/20",
        className
      )}
    >
      <Search className="size-4 text-text-muted shrink-0 mr-2" />
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent placeholder:text-text-muted text-text-primary focus:outline-none"
      />
      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className="text-text-muted hover:text-text-primary p-0.5 rounded cursor-pointer"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
