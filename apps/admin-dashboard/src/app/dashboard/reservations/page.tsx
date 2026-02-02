"use client";

import { useState, useEffect } from "react";
import { Eye, MoreHorizontal } from "lucide-react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getReservations, updateReservationStatus, type Reservation } from "@/lib/queries/reservations";

const statusConfig = {
  pending: { color: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" },
  confirmed: { color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
  completed: { color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" },
  cancelled: { color: "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20" },
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      toast.error('Failed to load reservations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (reservationId: string, newStatus: string) => {
    try {
      await updateReservationStatus(reservationId, newStatus);
      setReservations(reservations.map(r => r.id === reservationId ? { ...r, status: newStatus } : r));
      toast.success(`Reservation ${reservationId} updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update reservation status:', error);
      toast.error('Failed to update reservation status');
    }
  };

  const columns: ColumnDef<Reservation>[] = [
    {
      accessorKey: "service_name",
      header: "Service",
    },
    {
      accessorKey: "full_name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.full_name}</span>
          <span className="text-xs text-muted-foreground">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "preferred_date",
      header: "Preferred Date",
      cell: ({ row }) => new Date(row.original.preferred_date).toLocaleDateString(),
    },
    {
      accessorKey: "preferred_time",
      header: "Preferred Time",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status as keyof typeof statusConfig;
        const config = statusConfig[status] || statusConfig.pending;
        return (
          <Badge className={config.color} variant="outline">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const reservation = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                setSelectedReservation(reservation);
                setIsDetailsOpen(true);
              }}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Update Status</DropdownMenuLabel>
              {Object.keys(statusConfig).map((s) => (
                <DropdownMenuItem key={s} onClick={() => handleUpdateStatus(reservation.id, s)}>
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
        <p className="text-muted-foreground">List of all booked home services.</p>
      </div>

      <DataTable columns={columns} data={reservations} searchKey="full_name" />

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reservation Details - {selectedReservation?.id}</DialogTitle>
            <DialogDescription>
              Comprehensive view of the selected reservation.
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase">Customer Info</h3>
                  <p className="mt-1 font-medium">{selectedReservation.full_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedReservation.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedReservation.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase">Service Info</h3>
                  <p className="mt-1 font-medium">{selectedReservation.service_name}</p>
                  <p className="text-sm text-muted-foreground">Preferred: {new Date(selectedReservation.preferred_date).toLocaleDateString()} at {selectedReservation.preferred_time}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-3 font-semibold">Update Status</h3>
                <div className="flex gap-4">
                  <Select defaultValue={selectedReservation.status} onValueChange={(val) => handleUpdateStatus(selectedReservation.id, val)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(statusConfig).map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
