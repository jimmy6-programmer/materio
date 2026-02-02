"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

interface OrderItem {
  id: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface OrderItemsTableProps {
  items: OrderItem[];
}

export function OrderItemsTable({ items }: OrderItemsTableProps) {

  const columns: ColumnDef<OrderItem>[] = [
    {
      accessorKey: "product_name",
      header: "Product Name",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => <span className="font-medium">{row.original.quantity}</span>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span className="font-medium">${row.original.price.toFixed(2)}</span>,
    },
    {
      id: "subtotal",
      header: "Subtotal",
      cell: ({ row }) => {
        const subtotal = row.original.quantity * row.original.price;
        return <span className="font-medium">${subtotal.toFixed(2)}</span>;
      },
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Order Items</h3>
      <DataTable columns={columns} data={items} />
    </div>
  );
}