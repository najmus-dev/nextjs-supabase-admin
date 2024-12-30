import { useProfile } from "@/components/providers/profile_provider";
import { createClient } from "@/utils/supabase/server";
import StatsCards from "./components/StatsCards"; 
import TotalEarnings from "./components/TotalEarnings";
import WeeklyRevenue from "./components/WeeklyRevenue";
import RecentBusinesses from "./components/RecentBusinesses";
import RecentPosts from "./components/RecentPosts";

export default async function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <StatsCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TotalEarnings />
        <WeeklyRevenue />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentBusinesses />
        <RecentPosts />
      </div>
    </div>
  );
}
