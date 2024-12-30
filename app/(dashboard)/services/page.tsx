'use client';

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { fetchServices } from "@/services/fetchServices";
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

interface Service {
  id: string;
  business_id: string;
  category_id: string;
  sub_category_id: string | null;
  image_url: string | null;
  title: string;
  price_type: string;
  fixed_price: number | null;
  min_price_range: number | null;
  max_price_range: number | null;
  price_duration: string | null;
  description: string | null;
  address: string;
  country: string;
  created_at: string;
  accepting_bookings: boolean;
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationRange>({
    from: 0,
    to: 10,
  });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { count, data } = await fetchServices(supabase, search, pagination);
      setServices(data);
      setTotal(count);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services.");
    } finally {
      setLoading(false);
    }
  };

  const deleteSelectedServices = async () => {
    try {
      const idsToDelete = Array.from(selectedRows);
      const { error } = await supabase
        .from("services")
        .delete()
        .in("id", idsToDelete);

      if (error) throw error;

      toast.success("Selected services deleted successfully!");
      setSelectedRows(new Set());
      fetchData(); // Refresh the table
    } catch (error) {
      console.error("Error deleting services:", error);
      toast.error("Failed to delete services.");
    }
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set()); // Deselect all
    } else {
      setSelectedRows(new Set(services.map((service) => service.id))); // Select all current services
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    fetchData();
  }, [search, pagination]);

  useEffect(() => {
    setSelectAll(selectedRows.size === services.length && services.length > 0);
  }, [selectedRows, services]);

  const columns: ColumnDef<Service>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={selectAll}
          onChange={toggleSelectAll}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedRows.has(row.original.id)}
          onChange={() => toggleRowSelection(row.original.id)}
        />
      ),
    },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "price_type", header: "Price Type" },
    { accessorKey: "fixed_price", header: "Fixed Price" },
    { accessorKey: "country", header: "Country" },
    { accessorKey: "address", header: "Address" },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ getValue }) =>
        new Date(getValue() as string).toLocaleDateString(),
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
              onClick={() => deleteSelectedServices()}
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
    data: services,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Services</h1>
      <input
        type="text"
        placeholder="Search services..."
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
                disabled={services.length < 10}
                className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedRows.size > 0 && (
        <div className="mt-4">
          <button
            onClick={deleteSelectedServices}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete Selected
          </button>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
