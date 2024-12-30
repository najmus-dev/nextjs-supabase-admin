'use client';

import React, { useState, useEffect } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { fetchCustomers } from "@/services/fetchCustomers";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ClipboardIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface PaginationRange {
  from: number;
  to: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  image_url: string | null;
  country: string;
  address: string;
  created_at: string;
  stripe_customer_id: string | null;
  hasBusiness: string; // Derived field
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
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
      const { count, data } = await fetchCustomers(supabase, search, pagination);
      const enrichedData = data.map((customer) => ({
        ...customer,
        hasBusiness: customer.stripe_customer_id ? "Yes" : "No",
      }));
      setCustomers(enrichedData);
      setTotal(count);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };
  const deleteCustomer = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);
  
      if (error) throw error;
  
      toast.success("Customer deleted successfully!");
      fetchData(); // Refresh the table
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer. Check console for details.");
    }
  };
  

  const toggleSelectCustomer = (id: string) => {
    setSelectedCustomers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllCustomers = (selectAll: boolean) => {
    if (selectAll) {
      const allIds = customers.map((customer) => customer.id);
      setSelectedCustomers(new Set(allIds));
    } else {
      setSelectedCustomers(new Set());
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, pagination]);

  const columns: ColumnDef<Customer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          onChange={(e) => selectAllCustomers(e.target.checked)}
          checked={
            selectedCustomers.size > 0 &&
            selectedCustomers.size === customers.length
          }
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedCustomers.has(row.original.id)}
          onChange={() => toggleSelectCustomer(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <img
            src={row.original.image_url || "https://via.placeholder.com/32"}
            alt={row.original.name}
            className="w-8 h-8 rounded-full"
          />
          {row.original.name}
        </div>
      ),
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "hasBusiness", header: "Has Business" },
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
              onClick={() => deleteCustomer(row.original.id)}
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
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Customers</h1>
      <input
        type="text"
        placeholder="Filter customers..."
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
                disabled={customers.length < 10}
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

export default CustomersPage;
