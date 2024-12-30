// "use client";

// import Loading from "@/components/loading";
// import { Button } from "@/components/ui/button";
// import { getPagination } from "@/lib/utils";
// import { getPostsCategories } from "@/services/categories_services";
// import { createClient } from "@/utils/supabase/client";
// import { useQuery } from "@tanstack/react-query";
// import { PaginationState } from "@tanstack/react-table";
// import { useState } from "react";
// import { AddCategorySheet } from "./components/add_category_sheet";
// import { columns } from "./components/columns";
// import { DataTable } from "./components/data-table";

// export default function PostsCategories() {
//   const client = createClient();

//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 8,
//   });

//   const {
//     data: categoriesData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["posts_categories", pagination],
//     queryFn: () =>
//       getPostsCategories(
//         client,
//         null,
//         getPagination(pagination.pageIndex, pagination.pageSize)
//       ),
//   });

//   // Handle loading and error states
//   if (isLoading) return <Loading />;
//   if (error) return <p>Error fetching categories</p>;

//   const categories = categoriesData!.data;

//   return (
//     <>
//       <div className="h-full flex-1 flex-col space-y-8 md:flex">
//         <div className="flex items-center justify-between space-y-2">
//           <div>
//             <h2 className="text-xl font-medium tracking-normal">
//               Posts Categories
//             </h2>
//             <p className="text-muted-foreground">
//               Manage your posts categories
//             </p>
//           </div>

//           <AddCategorySheet button={<Button>Add Category</Button>} />
//         </div>
//         <DataTable
//           count={categoriesData?.count || 0}
//           data={categories}
//           columns={columns}
//           pagination={pagination}
//           setPagination={setPagination}
//         />
//       </div>
//     </>
//   );
// }



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
import { ClipboardIcon, TrashIcon } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface Post {
  id: string;
  business_id: string;
  category_id: string;
  image_url: string | null;
  video_url: string | null;
  title: string;
  description: string | null;
  is_verified: boolean;
  created_at: string;
}

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ from: 0, to: 10 });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, count, error } = await supabase
        .from("posts")
        .select(
          "id, business_id, category_id, image_url, video_url, title, description, is_verified, created_at",
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(pagination.from, pagination.to);

      if (error) throw error;

      setPosts(data || []);
      setTotal(count || 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePosts = async () => {
    try {
      const idsToDelete = Array.from(selectedRows);
      const { error } = await supabase.from("posts").delete().in("id", idsToDelete);
      if (error) throw error;
  
      toast.success("Posts deleted successfully!");
      setSelectedRows(new Set());
      fetchPosts(); // Refresh the table
    } catch (error) {
      console.error("Error deleting posts:", error);
      toast.error("Failed to delete posts. Check console for details.");
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
      setSelectedRows(new Set(posts.map((post) => post.id))); // Select all current posts
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    fetchPosts();
  }, [pagination, search]);

  useEffect(() => {
    setSelectAll(selectedRows.size === posts.length && posts.length > 0);
  }, [selectedRows, posts]);

  const columns: ColumnDef<Post>[] = [
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
    { accessorKey: "category_id", header: "Category" },
    {
      accessorKey: "is_verified",
      header: "Verified",
      cell: ({ getValue }) =>
        getValue() ? (
          <span className="text-blue-500">✔️</span>
        ) : (
          <span className="text-gray-500">❌</span>
        ),
    },
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
              onClick={() => deletePosts()}
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
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      <input
        type="text"
        placeholder="Filter posts..."
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
                disabled={posts.length < 10}
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
            onClick={deletePosts}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete Selected
          </button>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
