"use client";

import { useState, useEffect } from "react";
import { Eye, Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Inquiry, getInquiries } from "@/lib/actions";
import { toast } from "sonner";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await getInquiries();
        setInquiries(data);
      } catch (error) {
        toast.error('Failed to load inquiries');
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const columns: ColumnDef<Inquiry>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => <span className="truncate max-w-xs">{row.original.message}</span>,
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSelectedInquiry(row.original)}><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="text-destructive"><Trash className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Inquiries</h1>
        <p className="text-muted-foreground">Manage messages from your customers.</p>
      </div>
      <DataTable columns={columns} data={inquiries} searchKey="name" />

      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>From: {selectedInquiry?.name} ({selectedInquiry?.email})</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">Date: {selectedInquiry ? new Date(selectedInquiry.created_at).toLocaleString() : ''}</p>
            <div className="mt-4 rounded-md bg-muted p-4">
              {selectedInquiry?.message}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedInquiry(null)}>Close</Button>
            <Button onClick={() => {
              toast.success("Reply sent (mock)");
              setSelectedInquiry(null);
            }}>Reply</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
