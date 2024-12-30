// import React from "react";

// const RecentPosts = () => {
//   const data = [
//     { title: "How to Prepare Your Horse for a...", status: "Pending", date: "24 Oct 2024" },
//     { title: "How to Prepare Your Horse for a...", status: "Verified", date: "23 Oct 2024" },
//     { title: "How to Prepare Your Horse for a...", status: "Verified", date: "22 Oct 2024" },
//   ];

//   return (
//     <div className="p-6 bg-white shadow-md rounded-lg">
//       <h3 className="text-sm font-medium text-gray-500 mb-4">Recent Posts</h3>
//       <table className="w-full text-left text-sm">
//         <thead>
//           <tr>
//             <th className="pb-2 text-gray-500">Title</th>
//             <th className="pb-2 text-gray-500">Status</th>
//             <th className="pb-2 text-gray-500">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td className="py-2">{item.title}</td>
//               <td className={`py-2 text-${item.status === "Pending" ? "red" : "green"}-500`}>
//                 {item.status}
//               </td>
//               <td className="py-2 text-gray-500">{item.date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default RecentPosts;
"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const RecentPosts = () => {
  // State for recent posts
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch recent posts from Supabase
  const fetchRecentPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("title, is_verified, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      const formattedData = (data || []).map((post) => ({
        title: post.title || "Untitled Post",
        status: post.is_verified ? "Verified" : "Pending",
        date: new Date(post.created_at).toLocaleDateString(),
      }));

      setRecentPosts(formattedData);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRecentPosts();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Recent Posts</h3>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="pb-2 text-gray-500">Title</th>
              <th className="pb-2 text-gray-500">Status</th>
              <th className="pb-2 text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts.length > 0 ? (
              recentPosts.map((item, index) => (
                <tr key={index}>
                  <td className="py-2">{item.title}</td>
                  <td
                    className={`py-2 text-${
                      item.status === "Pending" ? "red" : "green"
                    }-500`}
                  >
                    {item.status}
                  </td>
                  <td className="py-2 text-gray-500">{item.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-2 text-gray-500">
                  No recent posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentPosts;
