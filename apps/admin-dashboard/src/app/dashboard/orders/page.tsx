  "use client";

  import { useState, useEffect } from "react";
  import { Eye, MoreHorizontal, CheckCircle2, Truck, Clock, XCircle } from "lucide-react";
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
  import { OrderItemsTable } from "@/components/dashboard/order-items-table";
  import { toast } from "sonner";
  import { getOrders, updateOrderStatus, getOrderById, type Order } from "@/lib/queries/orders";

  const statusConfig = {
    Pending: { icon: Clock, color: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" },
    Processing: { icon: Clock, color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
    Shipped: { icon: Truck, color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" },
    Delivered: { icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" },
    Cancelled: { icon: XCircle, color: "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20" },
  };

  export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      fetchOrders();
    }, []);

    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        console.log("ORDERS DEBUG:", data);
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
      try {
        await updateOrderStatus(orderId, newStatus);
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        toast.success(`Order ${orderId} updated to ${newStatus}`);
      } catch (error) {
        console.error('Failed to update order status:', error);
        toast.error('Failed to update order status');
      }
    };

    const columns: ColumnDef<Order>[] = [
      {
        accessorKey: "user_id",
        header: "",
        enableSorting: false,
        enableHiding: true,
        cell: () => null,
      },
      {
        accessorKey: "id",
        header: "Order ID",
        cell: ({ row }) => <span className="font-mono font-medium">{row.original.id}</span>,
      },
      {
        accessorKey: "profiles.email",
        header: "Customer",
        cell: ({ row }) => {
          const email = row.original.profile?.email || row.original.profiles?.[0]?.email;
          const userId = row.original.user_id;

          if (email) {
            const nameFromEmail = email.split('@')[0];
            return (
              <div className="flex flex-col">
                <span className="font-medium">{nameFromEmail}</span>
                <span className="text-xs text-muted-foreground">{email}</span>
                <span className="text-xs text-muted-foreground">Registered User</span>
              </div>
            );
          }

          return (
            <div className="flex flex-col">
              <span className="font-medium">{userId.slice(0, 8)}...</span>
              <span className="text-xs text-muted-foreground">Unregistered User</span>
            </div>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
      },
      {
        accessorKey: "total_price",
        header: "Total",
        cell: ({ row }) => <span className="font-medium">${row.original.total_price.toFixed(2)}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status as keyof typeof statusConfig;
          const config = statusConfig[status] || statusConfig.Pending;
          return (
            <Badge className={config.color} variant="outline">
              <config.icon className="mr-1 h-3 w-3" />
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={async () => {
                  try {
                    const fullOrder = await getOrderById(order.id);
                    setSelectedOrder(fullOrder);
                    setIsDetailsOpen(true);
                  } catch (error) {
                    console.error('Failed to fetch order details:', error);
                    toast.error('Failed to load order details');
                  }
                }}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Update Status</DropdownMenuLabel>
                {Object.keys(statusConfig).map((s) => (
                  <DropdownMenuItem key={s} onClick={() => handleUpdateStatus(order.id, s)}>
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
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Monitor and manage customer orders.</p>
        </div>

        <DataTable columns={columns} data={orders} searchKey="user_id" />

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
              <DialogDescription>
                Comprehensive view of the selected order.
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase">Customer Info</h3>
                    <p className="mt-1 font-medium">
                      {selectedOrder.profile?.email || selectedOrder.profiles?.[0]?.email ?
                        (selectedOrder.profile?.email || selectedOrder.profiles?.[0]?.email)!.split('@')[0] :
                        `Customer ${selectedOrder.user_id.slice(0, 8)}...`
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.profile?.email || selectedOrder.profiles?.[0]?.email || 'Unregistered User'}
                    </p>
                    {(selectedOrder.profile?.email || selectedOrder.profiles?.[0]?.email) && (
                      <p className="text-xs text-muted-foreground">Registered User</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase">Order Info</h3>
                    <p className="mt-1 font-medium">Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">Total: ${selectedOrder.total_price.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase">Delivery Address</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>District:</strong> {selectedOrder.delivery_address.district}</p>
                    <p><strong>Village:</strong> {selectedOrder.delivery_address.village}</p>
                    <p><strong>Cell:</strong> {selectedOrder.delivery_address.cell}</p>
                    <p><strong>Phone:</strong> {selectedOrder.delivery_address.phone}</p>
                    {selectedOrder.delivery_address.notes && (
                      <p><strong>Notes:</strong> {selectedOrder.delivery_address.notes}</p>
                    )}
                  </div>
                </div>

                <OrderItemsTable items={selectedOrder.order_items || []} />

                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-semibold">Update Status</h3>
                  <div className="flex gap-4">
                    <Select defaultValue={selectedOrder.status} onValueChange={(val) => handleUpdateStatus(selectedOrder.id, val)}>
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
