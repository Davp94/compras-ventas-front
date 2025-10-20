"use client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useRef, useState } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { logout, loading, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef<Menu>(null);
  const navigationItems = [
    { name: "Home", href: "/", icon: "pi pi-home" },
    { name: "Usuarios", href: "/usuarios", icon: "pi pi-user" },
    { name: "Roles", href: "/roles", icon: "pi pi-user" },
    { name: "Inventario", href: "/inventario", icon: "pi pi-key" },
    { name: "Notas", href: "/notas", icon: "pi pi-box" },
  ];
  // const [sidebarVisible, setSidebarVisible] = useState(false);
  const items: MenuItem[] = [
    {
      label: "Perfil",
      icon: "pi pi-user",
      command: () => {
        alert("VIEW PROFILE");
      },
    },
    {
      label: "logout",
      icon: "pi pi-logout",
      command: () => {
        logout();
        router.push("/login");
      },
    },
  ];
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white shadow-lg border-r border-gray-200">
            <div className="flex items-center h-16 px-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">Compras Ventas</h1>
            </div>

            <nav className="flex-1 mt-6 px-3">
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <i className={`${item.icon} mr-3`}></i>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>

          <div className="flex-1 lg:ml-64">
            {/* Top Bar */}
            <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">

              {/* Page Title */}
              <div className="flex-1 lg:flex-none">
                <h1 className="text-lg font-semibold text-gray-900 ml-4 lg:ml-0">
                  {navigationItems.find((item) => item.href === pathname)
                    ?.name || "Dashboard"}
                </h1>
              </div>

              {/* Top Bar Actions */}
              <div className="flex items-center space-x-3">
                <Button
                  icon="pi pi-bell"
                  className="p-button-text p-button-plain relative"
                  aria-label="Notifications"
                >
                </Button>

                {/* User Menu */}
                <div className="relative">
                  <Button
                    className="p-button-text p-button-plain flex items-center space-x-2"
                    onClick={(e) => userMenuRef.current?.toggle(e)}
                    aria-label="User menu"
                  >
                    <Avatar
                      icon="pi pi-user"
                      style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                      shape="circle"
                    />
                    <i className="pi pi-chevron-down text-xs text-gray-500"></i>
                  </Button>
                  <Menu
                    model={items}
                    popup
                    ref={userMenuRef}
                    className="mt-2"
                  />
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
