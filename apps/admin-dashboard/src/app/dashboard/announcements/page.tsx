"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Megaphone, Pencil, Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { announcements as initialAnnouncements } from "@/lib/mock-data";
import { AnnouncementForm } from "./announcement-form";
import { toast } from "sonner";

type Announcement = typeof initialAnnouncements[0];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const columns: ColumnDef<Announcement>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Switch 
            checked={row.original.active} 
            onCheckedChange={() => {
              setAnnouncements(announcements.map(a => a.id === row.original.id ? { ...a, active: !a.active } : a));
              toast.success("Status updated");
            }}
          />
          <span className="text-xs text-muted-foreground">{row.original.active ? "Active" : "Inactive"}</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild><Link href={`/dashboard/announcements/edit/${row.original.id}`}><Pencil className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" className="text-destructive"><Trash className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Manage site-wide alerts and promotions.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Announcement</DialogTitle>
              <DialogDescription>
                Enter the details for your new announcement.
              </DialogDescription>
            </DialogHeader>
            <AnnouncementForm onSuccess={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={announcements} searchKey="title" />
    </div>
  );
}
