import AppSidebar from "@/components/layouts/app_sidebar";
import Header from "@/components/layouts/header";
import ProfileProvider from "@/components/providers/profile_provider";
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import "./globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Equilink Admin",
  description: "Admin panel for Equilink",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" className={GeistSans.className} suppressHydrationWarning>
        <body className="bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader color="#6F61EF" showSpinner={false} />
            <Toaster position="top-right" richColors />
            <ReactQueryDevtools initialIsOpen={false} />

            <ProfileProvider>{children}</ProfileProvider>
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
