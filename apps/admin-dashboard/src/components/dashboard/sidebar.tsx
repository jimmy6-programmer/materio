"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Home,
  Calendar,
  Tags,
  ShoppingCart,
  Megaphone,
  FileText,
  MessageSquare,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
  Store
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: Home, label: "Home Services", href: "/dashboard/home-services" },
  { icon: Tags, label: "Categories", href: "/dashboard/categories" },
  { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders" },
  { icon: Calendar, label: "Reservations", href: "/dashboard/reservations" },
  { icon: Users, label: "Users", href: "/dashboard/users" },
  { icon: Megaphone, label: "Announcements", href: "/dashboard/announcements" },
  { icon: FileText, label: "Articles", href: "/dashboard/articles" },
  { icon: MessageSquare, label: "Inquiries", href: "/dashboard/inquiries" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
];

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (v: boolean) => void }) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen transition-all duration-300 border-r bg-card",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl overflow-hidden whitespace-nowrap">
          <Store className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && <span className="animate-in fade-in slide-in-from-left-2">StoreAdmin</span>}
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="animate-in fade-in slide-in-from-left-2">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
