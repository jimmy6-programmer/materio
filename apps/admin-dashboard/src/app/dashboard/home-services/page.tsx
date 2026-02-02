"use client";

import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash, ExternalLink } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getHomeServices, createHomeService, updateHomeService, deleteHomeService } from "@/lib/actions";
import { HomeServiceForm } from "./home-service-form";
import { toast } from "sonner";
import Image from "next/image";

export default function HomeServicesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [current, setCurrent] = useState<any | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getHomeServices();
        setItems(data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load home services');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCreate = async (payload: any) => {
    try {
      await createHomeService(payload);
      const data = await getHomeServices();
      setItems(data || []);
      toast.success('Home service created');
      setIsAddOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create');
    }
  };

  const handleUpdate = async (id: string, payload: any) => {
    try {
      await updateHomeService(id, payload);
      const data = await getHomeServices();
      setItems(data || []);
      toast.success('Home service updated');
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHomeService(id);
      setItems(items.filter(i => i.id !== id));
      toast.success('Deleted');
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Service",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md border">
            {row.original.image_url ? (
              <img src={row.original.image_url} alt={row.original.title} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full bg-gray-100" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.title}</span>
            <span className="text-xs text-muted-foreground">{row.original.id}</span>
          </div>
        </div>
      ),
    },
    { accessorKey: "category", header: "Category", cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge> },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "price_from", header: "Price From", cell: ({ row }) => <span>${Number(row.original.price_from).toFixed(2)}</span> },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.original.status || 'N/A'}</Badge> },
    { accessorKey: "created_at", header: "Created At" },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => { setCurrent(item); setIsEditOpen(true); }}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" /> View on Site
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Home Services</h1>
          <p className="text-muted-foreground">Manage home services offered on the storefront.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Home Service</DialogTitle>
            </DialogHeader>
            <HomeServiceForm onSubmit={async (data) => { await handleCreate(data); }} onSuccess={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">Loading...</div>
      ) : (
        <DataTable columns={columns} data={items} searchKey="title" />
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Home Service</DialogTitle>
          </DialogHeader>
          {current && (
            <HomeServiceForm initialData={current} onSubmit={async (data) => { await handleUpdate(current.id, data); }} onSuccess={() => setIsEditOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
