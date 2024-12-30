"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePostCategory } from "@/services/categories_services";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { AddCategorySheet } from "./add_category_sheet";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<PostCategory>({
  row,
}: DataTableRowActionsProps<PostCategory>) {
  const client = createClient();
  const queryClient = useQueryClient();

  const handleDeleteCategory = async (id: string) => {
    toast.promise(deletePostCategory(client, id), {
      loading: "Loading...",
      success: async (_) => {
        await queryClient.invalidateQueries({
          queryKey: ["posts_categories"],
        });
        return "Category deleted successfully";
      },
      error: "Error deleting category",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <AddCategorySheet
          category={{
            id: row.getValue("id"),
            name: row.getValue("name"),
            createdAt: row.getValue("created_at"),
          }}
          button={
            <h3 className="pl-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted">
              Edit
            </h3>
          }
        />

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDeleteCategory(row.getValue("id"))}
          className="text-red-500"
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
