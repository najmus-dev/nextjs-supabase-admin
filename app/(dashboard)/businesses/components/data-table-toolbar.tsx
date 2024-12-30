"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBusinessCategories } from "@/services/categories_services";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import { Loading03Icon } from "hugeicons-react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const queryClient = useQueryClient();
  const client = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [debounced] = useDebounce(search, 300);

  useEffect(() => {
    const fetchBusinessCategories = async () => {
      setIsLoading(true);
      const { data, count } = await getBusinessCategories(
        client,
        debounced,
        null
      );

      queryClient.setQueryData(
        ["business_categories", { pageIndex: 0, pageSize: 8 }],
        { data: data, totalCount: count }
      );

      setIsLoading(false);
    };

    if (debounced) {
      fetchBusinessCategories();
    }
  }, [debounced, client, queryClient]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter categories..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            if (event.target.value === "") {
              table.resetColumnFilters();
              table.resetSorting();
              setSearch("");

              queryClient.invalidateQueries({
                queryKey: ["business_categories"],
              });

              return;
            }
            table.getColumn("name")?.setFilterValue(event.target.value);
            setSearch(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("is_featured") && (
          <DataTableFacetedFilter
            column={table.getColumn("is_featured")}
            title="Featured"
            options={[
              {
                label: "Yes",
                value: "Yes",
              },
              {
                label: "No",
                value: "No",
              },
            ]}
          />
        )}
        {isFiltered &&
          (isLoading === true ? (
            <div className="w-auto pl-2">
              <Loading03Icon className="animate-spin" />
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={async () => {
                table.resetColumnFilters();
                table.resetSorting();
                setSearch("");

                await queryClient.invalidateQueries({
                  queryKey: ["business_categories"],
                });
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X />
            </Button>
          ))}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
