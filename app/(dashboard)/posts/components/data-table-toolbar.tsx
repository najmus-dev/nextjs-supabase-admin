"use client";

import { Input } from "@/components/ui/input";
import { getPostsCategories } from "@/services/categories_services";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import { Loading03Icon } from "hugeicons-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const queryClient = useQueryClient();
  const client = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [debounced] = useDebounce(search, 300);

  useEffect(() => {
    const fetchPostCategories = async () => {
      setIsLoading(true);
      const { data, count } = await getPostsCategories(client, debounced, null);

      queryClient.setQueryData(
        ["posts_categories", { pageIndex: 0, pageSize: 8 }],
        { data: data, totalCount: count }
      );

      setIsLoading(false);
    };

    if (debounced) {
      fetchPostCategories();
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
                queryKey: ["posts_categories"],
              });

              return;
            }
            table.getColumn("name")?.setFilterValue(event.target.value);
            setSearch(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isLoading === true && (
          <div className="w-auto pl-2">
            <Loading03Icon className="animate-spin" />
          </div>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
