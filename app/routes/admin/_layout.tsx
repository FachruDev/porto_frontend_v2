import { FileText, LayoutDashboard, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import type { ClientLoaderFunction } from "react-router";
import { Outlet, redirect, useLocation, useNavigate } from "react-router";

import { AppSidebar } from "~/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { ModeToggle } from "~/components/mode-toggle";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { clearToken, isAuthenticated } from "~/lib/auth";
import { ThemeProvider } from "~/components/theme-provider";

export const clientLoader: ClientLoaderFunction = async () => {
  if (!isAuthenticated()) {
    throw redirect("/admin/login");
  }
  return null;
};

const adminNav = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Heroes",
    url: "/admin/heroes",
    icon: Sparkles,
  },
  {
    title: "About",
    url: "/admin/about",
    icon: FileText,
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const brand = {
    name: "Portfolio CMS",
    subtitle: "Admin",
    href: "/admin",
  };

  const onLogout = () => {
    clearToken();
    navigate("/admin/login", { replace: true });
  };

  const currentPage = adminNav.find((item) => location.pathname.startsWith(item.url));

  return (
    <ThemeProvider storageKey="admin-ui-theme" defaultTheme="light">
      <SidebarProvider>
        <AppSidebar navMain={adminNav} brand={brand} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <div className="flex flex-1 items-center justify-between">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentPage?.title ?? "Admin"}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex items-center gap-3">
                <ModeToggle />
                <ShieldCheck className="text-primary size-4" />
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="mr-2 size-4" />
                  Logout
                </Button>
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
