import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";
import { PopoverContent } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Input } from "./ui/input";
import { Popover, PopoverTrigger } from "./ui/popover";

interface CategoriesDropDownProps {
  onChange: (value: string) => void;
  initialCategoryId?: string | null;
  className?: string;
}

export function CategoriesDropDown({
  onChange,
  initialCategoryId,
  className,
}: CategoriesDropDownProps) {
  const client = createClient();

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(initialCategoryId || "");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    data: categories,
    error,
    isLoading,
  } = useQuery<BusinessCategory[], Error>({
    queryKey: ["all_business_categories"],
    queryFn: async () => {
      const { data, error } = await client
        .from("business_categories")
        .select("*")
        .order("name", { ascending: true })
        .returns<BusinessCategory[]>();
      if (error) {
        throw error;
      }
      return data;
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {categories && value
            ? categories.find((category) => category.id === value)?.name
            : "Select category..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0 shadow-md rounded-lg">
        <Command className="w-full gap-1 mt-2 p-2">
          <Input
            placeholder="Search category..."
            className="h-9 border-0 bg-transparent px-2 py-3 text-sm ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            itemType="text"
            onChange={(e) => setSearchTerm(e.target.value.trim())}
          />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories &&
                categories
                  .filter((category) =>
                    category.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                        onChange(currentValue);
                      }}
                    >
                      {category.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === category.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
