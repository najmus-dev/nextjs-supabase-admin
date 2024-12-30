
"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Analytics01Icon,
  Briefcase05Icon,
  Calendar02Icon,
  DashboardSquare02Icon,
  FlashIcon,
  LicenseIcon,
  MessageUser02Icon,
  SavingsIcon,
  UserGroupIcon,
} from "hugeicons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const company = {
  name: "Equilink",
};

export default function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: <Analytics01Icon />,
      isActive: pathname === "/",
    },
    {
      title: "Categories",
      url: "/categories",
      icon: <DashboardSquare02Icon />,
      isActive: pathname.startsWith("/categories"),
    },
    {
      title: "Businesses",
      url: "/businesses", // Updated to point to the categories folder
      icon: <SavingsIcon />,
      isActive: pathname === "/businesses",
    },
    {
      title: "Posts",
      url: "/posts", // Updated to point to the categories folder
      icon: <LicenseIcon />,
      isActive: pathname === "/posts",
    },
    {
      title: "Services",
      url: "/services",
      icon: <Briefcase05Icon />,
      isActive: pathname === "/services",
    },
    {
      title: "Events",
      url: "/events",
      icon: <Calendar02Icon />,
      isActive: pathname === "/events",
    },
    {
      title: "Opportunities",
      url: "/opportunities",
      icon: <FlashIcon />,
      isActive: pathname === "/opportunities",
    },
    {
      title: "Customers",
      url: "/customers",
      icon: <UserGroupIcon />,
      isActive: pathname === "/customers",
    },
    {
      title: "Payments",
      url: "/payments",
      icon: <UserGroupIcon />,
      isActive: pathname === "/payments",
    },
    {
      title: "Feedbacks",
      url: "/feedbacks",
      icon: <MessageUser02Icon />,
      isActive: pathname === "/feedbacks",
    },
  ];

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-center gap-2 text-sidebar-accent-foreground">
          <Image src="/brand/logo.svg" width={60} height={60} alt="Logo" />
          <span className="truncate font-semibold text-xl">{company.name}</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={item.isActive}
                  size={"lg"}
                  className="data-[active=true]:bg-primary/30 hover:bg-sidebar-accent data-[active=true]:font-semibold data-[active=false]:text-muted-foreground"
                >
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}












// "use client";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
//   SidebarRail,
// } from "@/components/ui/sidebar";
// import {
//   Analytics01Icon,
//   ArrowRight01Icon,
//   Briefcase05Icon,
//   Calendar02Icon,
//   DashboardSquare02Icon,
//   FlashIcon,
//   LicenseIcon,
//   MessageUser02Icon,
//   SavingsIcon,
//   UserGroupIcon,
// } from "hugeicons-react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export const company = {
//   name: "Equilink",
// };

// export default function AppSidebar() {
//   const pathname = usePathname();

//   const navItems = [
//     {
//       title: "Dashboard",
//       url: "/",
//       icon: <Analytics01Icon />,
//       isActive: false,
//       shortcut: ["d", "d"],
//       items: [], // Empty array as there are no child items for Dashboard
//     },
//     {
//       title: "Categories",
//       url: "/categories",
//       icon: <DashboardSquare02Icon />,
//       isActive: false,
//       items: [
//         {
//           title: "Businesses",
//           url: "/categories/businesses",
//         },
//         {
//           title: "Posts",
//           url: "/categories/posts",
//         },
//         {
//           title: "Events",
//           url: "/categories/events",
//         },
//         {
//           title: "Opportunities",
//           url: "/categories/opportunities",
//         },
//         {
//           title: "Specialities",
//           url: "/categories/specialities",
//         },
//         {
//           title: "Discplines",
//           url: "/categories/discplines",
//         },
//       ],
//     },
//     {
//       title: "Businesses",
//       url: "/businesses",
//       icon: <SavingsIcon />,
//       shortcut: ["b", "b"],
//       isActive: false,
//       items: [], // No child items
//     },
//     {
//       title: "Services",
//       url: "/services",
//       icon: <Briefcase05Icon />,
//       shortcut: ["s", "s"],
//       isActive: false,
//     },
//     {
//       title: "Posts",
//       url: "/posts",
//       icon: <LicenseIcon />,
//       shortcut: ["p", "p"],
//       isActive: false,
//       items: [], // No child items
//     },
//     {
//       title: "Events",
//       url: "/events",
//       icon: <Calendar02Icon />,
//       shortcut: ["e", "e"],
//       isActive: false,
//       items: [], // No child items
//     },
//     {
//       title: "Opportunities",
//       url: "/opportunities",
//       icon: <FlashIcon />,
//       shortcut: ["o", "o"],
//       isActive: false,
//       items: [], // No child items
//     },
//     {
//       title: "Customers",
//       url: "/customers",
//       icon: <UserGroupIcon />,
//       shortcut: ["c", "c"],
//       isActive: false,
//       items: [], // No child items
//     },
//     {
//       title: "Feedbacks",
//       url: "/feedbacks",
//       icon: <MessageUser02Icon />,

//       shortcut: ["f", "f"],
//       isActive: false,
//       items: [], // No child items
//     },
//   ];

//   return (
//     <Sidebar collapsible="offcanvas">
//       <SidebarHeader>
//         <div className="flex items-center gap-2 text-sidebar-accent-foreground ">
//           <Image src="/brand/logo.svg" width={60} height={60} alt="Logo" />
//           <span className="truncate font-semibold text-xl">{company.name}</span>
//         </div>
//       </SidebarHeader>
//       <SidebarContent className="overflow-x-hidden">
//         <SidebarGroup>
//           <SidebarMenu>
//             {navItems.map((item) => {
//               return item?.items && item?.items?.length > 0 ? (
//                 <Collapsible
//                   key={item.title}
//                   asChild
//                   defaultOpen={pathname.includes('categories')}
//                   className="group/collapsible"
//                 >
//                   <SidebarMenuItem>
//                     <CollapsibleTrigger asChild>
//                       <SidebarMenuButton
//                         tooltip={item.title}
//                         isActive={pathname === item.url}
//                         size={"lg"}
//                         className="data-[active=true]:bg-primary/30 hover:bg-sidebar-accent data-[active=true]:font-semibold data-[active=false]:text-muted-foreground"
//                       >
//                         {item.icon}
//                         <span>{item.title}</span>
//                         <ArrowRight01Icon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                       </SidebarMenuButton>
//                     </CollapsibleTrigger>
//                     <CollapsibleContent>
//                       <SidebarMenuSub>
//                         {item.items?.map((subItem) => (
//                           <SidebarMenuSubItem key={subItem.title}>
//                             <SidebarMenuSubButton
//                               asChild
//                               isActive={pathname === subItem.url}
//                               className="py-5 hover:bg-sidebar-accent data-[active=true]:text-primary data-[active=true]:font-semibold data-[active=false]:text-muted-foreground"
//                             >
//                               <Link href={subItem.url}>
//                                 <span>{subItem.title}</span>
//                               </Link>
//                             </SidebarMenuSubButton>
//                           </SidebarMenuSubItem>
//                         ))}
//                       </SidebarMenuSub>
//                     </CollapsibleContent>
//                   </SidebarMenuItem>
//                 </Collapsible>
//               ) : (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton
//                     asChild
//                     tooltip={item.title}
//                     isActive={pathname === item.url}
//                     size={"lg"}
//                     className="data-[active=true]:bg-primary/30 hover:bg-sidebar-accent data-[active=true]:font-semibold data-[active=false]:text-muted-foreground"
//                   >
//                     <Link href={item.url}>
//                       {item.icon}
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               );
//             })}
//           </SidebarMenu>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarRail />
//     </Sidebar>
//   );
// }

