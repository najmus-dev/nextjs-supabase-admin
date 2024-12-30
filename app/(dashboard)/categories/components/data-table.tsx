"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCopy from "@/hooks/use-copy";
import { deleteBusinessSubCategory } from "@/services/categories_services";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import dateFormat from "dateformat";
import { MoreHorizontal } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { AddSubCategorySheet } from "./add_sub_category_sheet";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  count: number | null;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}

export function DataTable<TData, TValue>({
  count,
  columns,
  data,
  pagination,
  setPagination,
}: DataTableProps<TData, TValue>) {
  const client = createClient();
  const queryClient = useQueryClient();

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const { copy } = useCopy();

  const handleDeleteSubCategory = async (id: string) => {
    toast.promise(deleteBusinessSubCategory(client, id), {
      loading: "Loading...",
      success: async (_) => {
        await queryClient.invalidateQueries({
          queryKey: ["business_categories"],
        });
        return "Subcategory deleted successfully";
      },
      error: "Error deleting subcategory",
    });
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      expanded,
      pagination,
    },
    enableRowSelection: true,
    manualFiltering: true,
    manualPagination: true,
    rowCount: count || 0,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: any) => row.subCategories ?? [],
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && row.subRows?.length > 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="bg-gray-100"
                      >
                        <div className="pl-8">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.subRows.map((subRow) => (
                                <TableRow key={subRow.id}>
                                  <TableCell
                                    className="w-[400px] hover:text-green-500 transition-colors duration-400 cursor-pointer"
                                    onClick={() => copy(row.getValue("id"))}
                                  >
                                    {subRow.original.id}
                                  </TableCell>
                                  <TableCell>{subRow.original.name}</TableCell>
                                  <TableCell>
                                    {dateFormat(
                                      subRow.original.created_at,
                                      "mmm d, yyyy"
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                        >
                                          <MoreHorizontal />
                                          <span className="sr-only">
                                            Open menu
                                          </span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-[160px]"
                                      >
                                        <AddSubCategorySheet
                                          subcategory={subRow.original}
                                          categoryId={row.getValue("id")}
                                          button={
                                            <h3 className="pl-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted">
                                              Edit
                                            </h3>
                                          }
                                        />
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleDeleteSubCategory(
                                              subRow.original.id
                                            )
                                          }
                                          className="text-red-500"
                                        >
                                          Delete
                                          <DropdownMenuShortcut>
                                            ⌘⌫
                                          </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
