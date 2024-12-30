// import React from "react";

// const RecentBusinesses = () => {
//   const data = [
//     { name: "Saddle Circle", status: "Pending", date: "24 Oct 2024" },
//     { name: "Saddle Circle", status: "In Review", date: "23 Oct 2024" },
//     { name: "Saddle Circle", status: "Verified", date: "22 Oct 2024" },
//   ];

//   return (
//     <div className="p-6 bg-white shadow-md rounded-lg">
//       <h3 className="text-sm font-medium text-gray-500 mb-4">Recent Businesses</h3>
//       <table className="w-full text-left text-sm">
//         <thead>
//           <tr>
//             <th className="pb-2 text-gray-500">Name</th>
//             <th className="pb-2 text-gray-500">Status</th>
//             <th className="pb-2 text-gray-500">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td className="py-2">{item.name}</td>
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

// export default RecentBusinesses;


'use client';

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const RecentBusinesses = () => {
  const [data, setData] = useState([]); // No type annotations
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBusinesses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("businesses")
          .select("name, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) {
          console.error("Error fetching recent businesses:", error);
          return;
        }

        // Format data and set state
        setData(
          (data || []).map((business) => ({
            ...business,
            created_at: new Date(business.created_at).toLocaleDateString(),
          }))
        );
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBusinesses();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Recent Businesses</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="pb-2 text-gray-500">Name</th>
              <th className="pb-2 text-gray-500">Status</th>
              <th className="pb-2 text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="py-2">{item.name}</td>
                <td
                  className={`py-2 text-${
                    item.status === "Pending"
                      ? "red"
                      : item.status === "In Review"
                      ? "yellow"
                      : item.status === "Verified"
                      ? "green"
                      : "gray"
                  }-500`}
                >
                  {item.status}
                </td>
                <td className="py-2 text-gray-500">{item.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentBusinesses;
