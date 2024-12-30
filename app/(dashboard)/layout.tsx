import AppSidebar from "@/components/layouts/app_sidebar";
import Header from "@/components/layouts/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { cookies } from "next/headers";


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
    
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-col p-5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}