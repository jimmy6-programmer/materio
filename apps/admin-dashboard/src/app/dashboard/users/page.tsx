"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { users as initialUsers } from "@/lib/mock-data";
import { toast } from "sonner";

type User = typeof initialUsers[0];

const statusConfig = {
  active: { color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" },
  disabled: { color: "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20" },
};

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);

  const toggleStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === "active" ? "disabled" : "active";
        toast.success(`User ${u.fullName} status updated to ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "User ID",
      cell: ({ row }) => <span className="font-mono font-medium">{row.original.id}</span>,
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status as keyof typeof statusConfig;
        const config = statusConfig[status];
        return (
          <Badge className={config.color} variant="outline">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Link href={`/dashboard/users/${user.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </Link>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage registered client accounts.</p>
      </div>

      <DataTable columns={columns} data={users} searchKey="fullName" />
    </div>
  );
}