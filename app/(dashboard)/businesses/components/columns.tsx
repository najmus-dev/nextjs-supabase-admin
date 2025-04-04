"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import dateFormat from "dateformat";
import { CircleArrowDown01Icon, CircleArrowUp01Icon } from "hugeicons-react";
import useCopy from "@/hooks/use-copy";

export const columns: ColumnDef<BusinessCategory>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row, getValue }) => (
      <div className="flex">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
        {row.getCanExpand() && (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? (
              <CircleArrowUp01Icon className="ml-10" />
            ) : (
              <CircleArrowDown01Icon className="ml-10" />
            )}
          </button>
        )}
        {getValue<boolean>()}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const { copy } = useCopy();
      return (
        <div
          className="max-w-xs hover:text-green-500 transition-colors duration-400 cursor-pointer"
          onClick={() => copy(row.getValue("id"))}
        >
          {row.getValue("id")}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("name")}
        </span>
      );
    },
  },
  {
    accessorKey: "is_featured",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Featured" />
    ),
    cell: ({ row }) => {
      return (
        <span
          className={`${row.getValue("is_featured") ? "text-green-500" : "text-red-500"}`}
        >
          {row.getValue("is_featured") ? "Yes" : "No"}
        </span>
      );
    },
    filterFn: (
      row: { getValue: (id: string) => boolean },
      id: string,
      value: string[]
    ) => {
      const rowValue = row.getValue(id);
      // Convert boolean to "Yes" or "No" for filtering
      const rowValueString = rowValue ? "Yes" : "No";
      return value.includes(rowValueString);
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      return (
        <span>{dateFormat(row.getValue("created_at"), "mmm d, yyyy")}</span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
