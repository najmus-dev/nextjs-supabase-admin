'use client';

import React, { useState, useEffect } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { fetchOpportunities } from "@/services/fetchOpportunities";
import { toast } from "sonner";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ClipboardIcon, TrashIcon } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface PaginationRange {
  from: number;
  to: number;
}

interface Opportunity {
  id: string;
  category_id: string;
  image_url: string | null;
  title: string;
  description: string | null;
  address: string;
  country: string;
  created_at: string;
  business_id: string;
}

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunities, setSelectedOpportunities] = useState<Set<string>>(new Set());
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationRange>({
    from: 0,
    to: 10,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { count, data } = await fetchOpportunities(supabase, search, pagination);
      setOpportunities(data);
      setTotal(count);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      setLoading(false);
    }
  };
  const deleteOpportunity = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .delete()
        .eq("id", id);
  
      if (error) throw error;
  
      toast.success("Opportunity deleted successfully!");
      fetchData(); // Refresh the table
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      toast.error("Failed to delete opportunity. Check console for details.");
    }
  };
  

  const toggleSelectOpportunity = (id: string) => {
    setSelectedOpportunities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllOpportunities = (selectAll: boolean) => {
    if (selectAll) {
      const allIds = opportunities.map((opportunity) => opportunity.id);
      setSelectedOpportunities(new Set(allIds));
    } else {
      setSelectedOpportunities(new Set());
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, pagination]);

  const columns: ColumnDef<Opportunity>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          onChange={(e) => selectAllOpportunities(e.target.checked)}
          checked={
            selectedOpportunities.size > 0 &&
            selectedOpportunities.size === opportunities.length
          }
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedOpportunities.has(row.original.id)}
          onChange={() => toggleSelectOpportunity(row.original.id)}
        />
      ),
    },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "category_id", header: "Category" },
    { accessorKey: "country", header: "Country" },
    { accessorKey: "address", header: "Address" },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100">•••</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white border rounded shadow-md p-1">
            <DropdownMenu.Item
              onClick={() => navigator.clipboard.writeText(row.original.id)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <ClipboardIcon size={16} />
              Copy ID
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => deleteOpportunity(row.original.id)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 cursor-pointer text-red-500"
            >
              <TrashIcon size={16} />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ),
    },
  ];

  const table = useReactTable({
    data: opportunities,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Opportunities</h1>
      <input
        type="text"
        placeholder="Filter opportunities..."
        value={search || ""}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left font-medium text-gray-700 border-b border-gray-300"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-3 border-b border-gray-300"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">
              {`Showing ${pagination.from + 1}-${Math.min(
                pagination.to,
                total || 0
              )} of ${total || 0}`}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    from: Math.max(prev.from - 10, 0),
                    to: Math.max(prev.to - 10, 10),
                  }))
                }
                disabled={pagination.from === 0}
                className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    from: prev.from + 10,
                    to: prev.to + 10,
                  }))
                }
                disabled={opportunities.length < 10}
                className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesPage;
