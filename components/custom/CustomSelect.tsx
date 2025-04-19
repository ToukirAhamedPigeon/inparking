import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSelect } from "@/hooks/useSelect";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  value?: any;
  onChange: (value: any) => void;
  apiUrl: string;
  limit?: number;
  filter?: Record<string, any>;
  multiple?: boolean;
  optionValueKey?: string;
  optionLabelKeys?: string[];
  optionLabelSeparator?: string;
  placeholder?: string;
}

export default function CustomSelect({
  value,
  onChange,
  apiUrl,
  limit = 50,
  filter = {},
  multiple = false,
  optionValueKey = "_id",
  optionLabelKeys = ["name"],
  optionLabelSeparator = " ",
  placeholder = "Select option(s)",
}: CustomSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false); // <-- control popover open/close
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    options,
    loading,
    selected,
    setSelected,
    getOptionLabel,
  } = useSelect({
    apiUrl,
    search,
    filter,
    limit,
    multiple,
    optionValueKey,
    optionLabelKeys,
    optionLabelSeparator,
    initialValue: value,
  });

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  const isSelected = (opt: any) => {
    if (multiple) return Array.isArray(selected) && selected.includes(opt[optionValueKey]);
    return selected === opt[optionValueKey];
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            readOnly
            ref={inputRef}
            className="text-left cursor-pointer hover:bg-slate-100 pr-10"
            value={multiple
              ? options
                  .filter((opt) => selected?.includes(opt[optionValueKey]))
                  .map(getOptionLabel)
                  .join(", ")
              : getOptionLabel(options.find((opt) => opt[optionValueKey] === selected) || {}) || ""
            }
            placeholder={placeholder}
            onClick={() => setOpen(true)}
          />
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 mt-[-4px]" style={{ width: inputRef.current?.offsetWidth }}>
        <Command shouldFilter={false} className="w-full">
          <CommandInput
            placeholder="Search options..."
            value={search}
            onValueChange={setSearch}
            className="w-full"
          />
          <CommandList>
            {loading && <CommandItem disabled>Loading...</CommandItem>}
            {!loading &&
              options.map((opt) => (
                <CommandItem
                  key={opt[optionValueKey]}
                  onSelect={() => {
                    if (multiple) {
                      if (Array.isArray(selected)) {
                        const exists = selected.includes(opt[optionValueKey]);
                        const updated = exists
                          ? selected.filter((id: any) => id !== opt[optionValueKey])
                          : [...selected, opt[optionValueKey]];
                        setSelected(updated);
                      } else {
                        setSelected([opt[optionValueKey]]);
                      }
                    } else {
                      setSelected(opt[optionValueKey]);
                      setOpen(false); // <-- auto close on single selection
                    }
                  }}
                  className={`cursor-pointer hover:bg-blue-100 !rounded-none ${
                    isSelected(opt) ? "!bg-blue-400 hover:!bg-blue-400 !text-white" : ""
                  }`}
                >
                  {getOptionLabel(opt)}
                </CommandItem>
              ))}
            {!loading && options.length === 0 && (
              <CommandItem disabled>No options found.</CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
