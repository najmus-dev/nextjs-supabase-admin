"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { fetchFeedbacks } from "@/services/fetchFeedback";
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

interface Feedback {
  id: string;
  profile_id: string;
  rating: number;
  review: string;
  created_at: string;
  profile?: {
    id: string;
    name: string;
    image_url: string;
  };
}

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationRange>({
    from: 0,
    to: 10,
  });
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const { count, data } = await fetchFeedbacks(supabase, search, pagination);
      setFeedbacks(data);
      setTotal(count);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };
  const deleteFeedback = async (id: string) => {
    try {
      const { error } = await supabase.from("feedbacks").delete().eq("id", id);
  
      if (error) throw error;
  
      toast.success("Feedback deleted successfully!");
      fetchData(); // Refresh the table
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback. Check console for details.");
    }
  };
  
  const handleCheckboxChange = (id: string) => {
    setSelectedFeedbacks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetchData();
  }, [search, pagination]);

  const columns: ColumnDef<Feedback>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          onChange={(e) => {
            const isChecked = e.target.checked;
            setSelectedFeedbacks(isChecked ? new Set(feedbacks.map((f) => f.id)) : new Set());
          }}
          checked={selectedFeedbacks.size === feedbacks.length && feedbacks.length > 0}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedFeedbacks.has(row.original.id)}
          onChange={() => handleCheckboxChange(row.original.id)}
        />
      ),
    },
    { accessorKey: "review", header: "Title" },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ getValue }) => {
        const rating = getValue<number>();
        const emojiMap: { 1: string; 2: string; 3: string; 4: string; 5: string } = {
          1: "😡", // Angry
          2: "😞", // Sad
          3: "😐", // Neutral
          4: "😊", // Happy
          5: "😍", // Love
        };

        return emojiMap[rating as 1 | 2 | 3 | 4 | 5] || "🤔";
      },
    },
    {
      accessorKey: "profile",
      header: "Customer",
      cell: ({ getValue }) => {
        const profile = getValue<Feedback["profile"]>();
        return (
          <div className="flex items-center gap-2">
            {profile?.image_url && (
              <img
                src={profile.image_url}
                alt={profile?.name}
                className="w-6 h-6 rounded-full"
              />
            )}
            {profile?.name || "Unknown"}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
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
              onClick={() => deleteFeedback(row.original.id)}
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
    data: feedbacks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Feedbacks</h1>
      <p className="text-gray-600 mb-4">Here's a list of app feedback!</p>
      <input
        type="text"
        placeholder="Filter feedbacks..."
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
                disabled={feedbacks.length < 10}
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

export default FeedbackPage;
