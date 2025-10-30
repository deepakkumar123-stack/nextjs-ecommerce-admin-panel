"use client";

import DataTable from "@/components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";

type OrderType = {
  _id: string;
  customerName: string;
  product: string;
  quantity: number;
  totalPrice: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  orderDate: string;
};

// Mock order data
const mockOrders: OrderType[] = [
  {
    _id: "1",
    customerName: "Deepak Kumar",
    product: "Wireless Mouse",
    quantity: 2,
    totalPrice: 998,
    status: "Shipped",
    orderDate: "2025-09-28",
  },
  {
    _id: "2",
    customerName: "Rahul Sharma",
    product: "Bluetooth Headphones",
    quantity: 1,
    totalPrice: 1299,
    status: "Pending",
    orderDate: "2025-09-27",
  },
  {
    _id: "3",
    customerName: "Anita Singh",
    product: "Office Chair",
    quantity: 1,
    totalPrice: 4999,
    status: "Delivered",
    orderDate: "2025-09-26",
  },
  {
    _id: "4",
    customerName: "Priya Verma",
    product: "Gaming Keyboard",
    quantity: 1,
    totalPrice: 1999,
    status: "Cancelled",
    orderDate: "2025-09-25",
  },
];

const columns: ColumnDef<OrderType>[] = [
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("_id")}</span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => <span>{row.getValue("customerName")}</span>,
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => <span>{row.getValue("product")}</span>,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <span>{row.getValue("quantity")}</span>,
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => <span>₹{row.getValue("totalPrice")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderType["status"];
      let color = "text-gray-500";
      if (status === "Pending") color = "text-yellow-500";
      if (status === "Shipped") color = "text-blue-500";
      if (status === "Delivered") color = "text-green-500";
      if (status === "Cancelled") color = "text-red-500";
      return <span className={color}>{status}</span>;
    },
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => (
      <span className="text-gray-500">{row.getValue("orderDate")}</span>
    ),
  },
];

const OrderList = () => {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Orders</h1>
      <DataTable columns={columns} data={mockOrders} />
    </div>
  );
};

export default OrderList;
