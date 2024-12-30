"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { ClipboardIcon, TrashIcon } from "lucide-react";
import { fetchBusinesses } from "@/services/fetchBusinesses";
import { getCategoryNameById } from "@/services/getCategoryName";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface PaginationRange {
  from: number;
  to: number;
}

// interface Business {
//   id: string;
//   user_id: string;
//   name: string;
//   phone_number: string | null;
//   owner_name: string | null;
//   years_in_business: number | null;
//   bio: string | null;
//   address: string | null;
//   country: string | null;
//   socials: string | null;
//   is_registered: boolean;
//   proof_url: string | null;
//   status: string;
//   created_at: string;
//   is_hiring: boolean;
//   category_id: string;
//   image_url: string | null;
//   stripe_connect_id: string | null;
// }


interface Business {
  id: string;
  user_id: string;
  name: string;
  phone_number: string | null;
  owner_name: string | null;
  years_in_business: number | null;
  bio: string | null;
  address: string | null;
  country: string | null;
  socials: string | null;
  is_registered: boolean;
  proof_url: string | null;
  status: string;
  created_at: string;
  is_hiring: boolean;
  category_id: string;
  image_url: string | null;
  stripe_connect_id: string | null;
  business_categories?: { name: string }[];  // Add this line
}

const BusinessesPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationRange>({
    from: 0,
    to: 10,
  });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<string | null>(null);




  const fetchCategoryName = async () => {
    if (!selectedBusiness?.category_id) return; // Ensure category_id exists

    try {
      const category = await getCategoryNameById(supabase, selectedBusiness.category_id);
      setCategoryName(category); // Set the fetched category name
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  useEffect(() => {
    if (selectedBusiness?.category_id) {
      fetchCategoryName();
    }
  }, [selectedBusiness]);










  const fetchData = async () => {
    setLoading(true);
    try {
      const { count, data } = await fetchBusinesses(
        supabase,
        search,
        pagination
      );
      setBusinesses(data);
      setTotal(count);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSelectedBusinesses = async () => {
    try {
      const idsToDelete = Array.from(selectedRows);
      const { error } = await supabase
        .from("businesses")
        .delete()
        .in("id", idsToDelete);

      if (error) throw error;

      toast.success("Selected businesses deleted successfully!");
      setSelectedRows(new Set());
      fetchData(); // Refresh the table
    } catch (error) {
      console.error("Error deleting businesses:", error);
      toast.error("Failed to delete businesses. Check console for details.");
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
      setSelectedRows(new Set(businesses.map((business) => business.id))); // Select all current businesses
    }
    setSelectAll(!selectAll);
  };

  const showBusinessDetails = (business: Business) => {
    setSelectedBusiness(business);
    setIsDetailOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, [search, pagination]);

  useEffect(() => {
    setSelectAll(
      selectedRows.size === businesses.length && businesses.length > 0
    );
  }, [selectedRows, businesses]);

  // const columns: ColumnDef<Business>[] = [
  //   {
  //     id: "select",
  //     header: () => (
  //       <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
  //     ),
  //     cell: ({ row }) => (
  //       <input
  //         type="checkbox"
  //         checked={selectedRows.has(row.original.id)}
  //         onChange={() => toggleRowSelection(row.original.id)}
  //       />
  //     ),
  //   },
  //   { accessorKey: "name", header: "Name" },
  //   { accessorKey: "category", header: "Category" },
  //   { accessorKey: "country", header: "Country" },
  //   { accessorKey: "address", header: "Address" },
  //   { accessorKey: "rating", header: "Rating" },
  //   { accessorKey: "status", header: "Status" },
  //   {
  //     accessorKey: "created_at",
  //     header: "Created At",
  //     cell: ({ getValue }) =>
  //       new Date(getValue() as string).toLocaleDateString(),
  //   },
  //   {
  //     id: "actions",
  //     header: "Actions",
  //     cell: ({ row }) => (
  //       <DropdownMenu.Root>
  //         <DropdownMenu.Trigger asChild>
  //           <button className="p-2 rounded-full hover:bg-gray-100">•••</button>
  //         </DropdownMenu.Trigger>
  //         <DropdownMenu.Content
  //           className="bg-white border rounded shadow-md p-1 z-50"
  //           style={{
  //             backgroundColor: "rgba(255, 255, 255, 1)",
  //             borderColor: "rgba(0, 0, 0, 0.1)", 
  //             boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
  //           }}
  //         >
  //           {/* View Action */}
  //           <DropdownMenu.Item
  //             onClick={() => showBusinessDetails(row.original)}
  //             className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
  //           >
  //             View
  //           </DropdownMenu.Item>
  //           {/* Copy Action */}
  //           <DropdownMenu.Item
  //             onClick={() => navigator.clipboard.writeText(row.original.id)}
  //             className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
  //           >
  //             <ClipboardIcon size={16} />
  //             Copy ID
  //           </DropdownMenu.Item>
  //           {/* Delete Action */}
  //           <DropdownMenu.Item
  //             onClick={() => deleteSelectedBusinesses()}
  //             className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 cursor-pointer text-red-500"
  //           >
  //             <TrashIcon size={16} />
  //             Delete
  //           </DropdownMenu.Item>
  //         </DropdownMenu.Content>
  //       </DropdownMenu.Root>
  //     ),
  //   },
  // ];

const columns: ColumnDef<Business>[] = [
  {
    id: "select",
    header: () => (
      <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={selectedRows.has(row.original.id)}
        onChange={() => toggleRowSelection(row.original.id)}
      />
    ),
  },
  { accessorKey: "name", header: "Name" },
  {
    accessorFn: (row) => row.business_categories?.[0]?.name, // Accessing the category name
    header: "Category",
  },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "rating", header: "Rating" },
  { accessorKey: "status", header: "Status" },
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
        <DropdownMenu.Content
          className="bg-white border rounded shadow-md p-1 z-50"
          style={{
            backgroundColor: "rgba(255, 255, 255, 1)",
            borderColor: "rgba(0, 0, 0, 0.1)",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <DropdownMenu.Item
            onClick={() => showBusinessDetails(row.original)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            View
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => navigator.clipboard.writeText(row.original.id)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            <ClipboardIcon size={16} />
            Copy ID
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => deleteSelectedBusinesses()}
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
    data: businesses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Businesses</h1>
      <input
        type="text"
        placeholder="Search businesses..."
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
                <tr key={row.id} className="hover:bg-gray-50 cursor-pointer">
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
                disabled={businesses.length < 10}
                className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
     <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
  <SheetContent className="max-w-md mx-auto p-6 rounded-lg bg-white shadow-lg">
    {/* Accessible Dialog Title */}
    <DialogTitle>
      <VisuallyHidden>Business Details</VisuallyHidden>
    </DialogTitle>

    {/* Header Section */}
    <div className="items-start mb-6">
      <div className="flex justify-normal  items-center mb-6">
      <img
        src={selectedBusiness?.image_url || "/sample-logo.png"} 
        alt="Business Logo"
        className="w-16 h-16 rounded-full mr-4"
      />
       <h2 className="text-xl font-bold text-gray-800">
          {selectedBusiness?.name || "Business Name"}
        </h2>
        </div>
      <div>
       
        <p className="text-sm text-gray-600 mt-1">
          {selectedBusiness?.bio ||
            "Business description goes here, providing details about services and values."}
        </p>
      </div>
    </div>

    {/* Business Details */}
    <div className="space-y-4 text-sm text-gray-700">
      {/* Status Dropdown */}
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-800">Status:</span>
        <select
          value={selectedBusiness?.status || "pending"}
          onChange={async (e) => {
            const newStatus = e.target.value;
            toast.promise(
              (async () => {
                if (!selectedBusiness) throw new Error("No business selected");
                const { error } = await supabase
                  .from("businesses")
                  .update({ status: newStatus })
                  .eq("id", selectedBusiness.id);

                if (error) throw new Error("Failed to update status");

                await fetchData();
                setSelectedBusiness(
                  (prev) => prev && { ...prev, status: newStatus }
                );
              })(),
              {
                loading: "Updating status...",
                success: "Status updated successfully!",
                error: "Error updating status",
              }
            );
          }}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
        <div>
          <span className="font-medium text-gray-800">Category:</span>
          <p className="text-gray-600">
  {categoryName || selectedBusiness?.category_id || "N/A"}
</p>

        </div>
        <div>
          <span className="font-medium text-gray-800">Phone:</span>
          <p className="text-gray-600">
            {selectedBusiness?.phone_number || "N/A"}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-800">Hiring:</span>
          <p className="text-gray-600">
            {selectedBusiness?.is_hiring ? "True" : "False"}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-800">Registered:</span>
          <p className="text-gray-600">
            {selectedBusiness?.is_registered ? "True" : "False"}
          </p>
        </div>
        <div className="col-span-2">
          <span className="font-medium text-gray-800">Address:</span>
          <p className="text-gray-600">
            {selectedBusiness?.address || "N/A"}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-800">Country:</span>
          <p className="text-gray-600">{selectedBusiness?.country || "N/A"}</p>
        </div>
        <div>
          <span className="font-medium text-gray-800">Rating:</span>
          <div className="flex items-center">
            <span className="text-yellow-500">⭐</span>
            <span className="ml-1">{selectedBusiness?.rating || "N/A"}</span>
          </div>
        </div>
        <div>
          <span className="font-medium text-gray-800">Created At:</span>
          <p className="text-gray-600">
            {selectedBusiness?.created_at
              ? new Date(selectedBusiness.created_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>

    {/* Close Button */}
    <div className="mt-6">
      <button
        className="w-full py-3 bg-gray-800 text-white rounded-md text-center"
        onClick={() => setIsDetailOpen(false)}
      >
        Close
      </button>
    </div>
  </SheetContent>
</Sheet>

    </div>
  );
};

export default BusinessesPage;
