// import React from "react";
// import { FaUsers, FaDollarSign, FaBusinessTime, FaChartBar, FaComments } from "react-icons/fa";

// const StatsCards = () => {
//   const stats = [
//     { icon: <FaUsers />, title: "Users", value: "22k" },
//     { icon: <FaBusinessTime />, title: "Businesses", value: "13k" },
//     { icon: <FaDollarSign />, title: "Earnings", value: "$35k" },
//     { icon: <FaChartBar />, title: "Subscriptions", value: "2500" },
//     { icon: <FaComments />, title: "Feedbacks", value: "5.5k" },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
//       {stats.map((stat, index) => (
//         <div
//           key={index}
//           className="flex items-center gap-4 p-4 bg-white shadow-md rounded-lg"
//         >
//           <div className="p-3 bg-violet-100 text-violet-500 rounded-full text-lg">
//             {stat.icon}
//           </div>
//           <div>
//             <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
//             <p className="text-xl font-bold text-gray-800">{stat.value}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default StatsCards;


'use client';

import React, { useEffect, useState } from "react";
import { FaUsers, FaDollarSign, FaBusinessTime, FaChartBar, FaComments } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const StatsCards = () => {
  const [stats, setStats] = useState({
    feedbacks: 0,
    profiles: 0,
    subscribers: 0,
    businesses: 0,
    earnings: "$35k", // Static value for earnings
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch feedbacks count
        const { count: feedbacksCount, error: feedbacksError } = await supabase
          .from("feedbacks")
          .select("*", { count: "exact" });
        if (feedbacksError) throw feedbacksError;

        // Fetch profiles count
        const { count: profilesCount, error: profilesError } = await supabase
          .from("profiles")
          .select("*", { count: "exact" });
        if (profilesError) throw profilesError;

        // Fetch subscribers count
        const { count: subscribersCount, error: subscribersError } = await supabase
          .from("subscribers")
          .select("*", { count: "exact" });
        if (subscribersError) throw subscribersError;

        // Fetch businesses count
        const { count: businessesCount, error: businessesError } = await supabase
          .from("businesses")
          .select("*", { count: "exact" });
        if (businessesError) throw businessesError;

        // Set the fetched data
        setStats({
          feedbacks: feedbacksCount || 0,
          profiles: profilesCount || 0,
          subscribers: subscribersCount || 0,
          businesses: businessesCount || 0,
          earnings: "$35k", // Static value
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    { icon: <FaUsers />, title: "Profiles", value: loading ? "Loading..." : stats.profiles },
    { icon: <FaBusinessTime />, title: "Businesses", value: loading ? "Loading..." : stats.businesses },
    { icon: <FaDollarSign />, title: "Earnings", value: stats.earnings },
    { icon: <FaChartBar />, title: "Subscribers", value: loading ? "Loading..." : stats.subscribers },
    { icon: <FaComments />, title: "Feedbacks", value: loading ? "Loading..." : stats.feedbacks },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 bg-white shadow-md rounded-lg"
        >
          <div className="p-3 bg-violet-100 text-violet-500 rounded-full text-lg">
            {stat.icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
