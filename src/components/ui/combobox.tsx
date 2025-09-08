import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { locations, type Location } from "@/api/locations";

interface ComboboxProps {
  value: Location[];
  setValue: (id: number, action?: string) => void;
  disabled?: boolean | false;
}

export function Combobox({ value, setValue, disabled }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger disabled={disabled} asChild>
        <div
          className={cn(
            "whitespace-nowrap border shadow-sm rounded-md flex p-2 text-sm items-center justify-between bg-white w-full",
            disabled
              ? "opacity-70 pointer-events-none cursor-not-allowed"
              : "pointer-events-auto cursor-pointer"
          )}
        >
          <div className="inline-flex gap-1 flex-wrap flex-1">
            {value.length !== 0
              ? value.map((val) => {
                  return (
                    <p
                      id={String(val.id)}
                      className="px-2 rounded-md bg-sky-300 flex items-center gap-1 capitalize"
                    >
                      {val.name}
                      <button
                        title="x-button"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setValue(val.id, "remove");
                        }}
                      >
                        <X size={14} />
                      </button>
                    </p>
                  );
                })
              : `Select location`}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search locations...`} />
          <CommandList>
            <CommandEmpty>Location not found</CommandEmpty>
            <CommandGroup>
              {locations.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  className="capitalize"
                  onSelect={() => {
                    setValue(item.id);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.find((val) => val.id == item.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
