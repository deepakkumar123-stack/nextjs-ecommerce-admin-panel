"use client";

import { Container } from "@/components/ui/Container";
import DataTable from "@/components/shared/dataTable/dataTable";
import Input from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import RightSidebar from "@/components/ui/RightSidebar";
import { CiFilter } from "react-icons/ci";
import SelectBox from "@/components/ui/SelectField";

// Order Type
type OrderType = {
  _id: string;
  customerName: string;
  product: string;
  quantity: number;
  totalPrice: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  orderDate: string; // YYYY-MM-DD
};

// Static mock e-commerce data
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
  {
    _id: "5",
    customerName: "Mohit Patel",
    product: "Laptop Stand",
    quantity: 1,
    totalPrice: 699,
    status: "Shipped",
    orderDate: "2025-09-24",
  },
  {
    _id: "6",
    customerName: "Kiran Raj",
    product: "LED Monitor",
    quantity: 1,
    totalPrice: 8999,
    status: "Delivered",
    orderDate: "2025-09-23",
  },
];

// Status badge UI
const StatusBadge = ({ status }: { status: OrderType["status"] }) => {
  const statusVariant =
    status === "Pending"
      ? "warning"
      : status === "Shipped"
      ? "info"
      : status === "Delivered"
      ? "success"
      : "danger";

  return <Badge variant={statusVariant}>{status}</Badge>;
};

// Table Columns
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
    header: "Qty",
    cell: ({ row }) => <span>{row.getValue("quantity")}</span>,
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => <span>₹{row.getValue("totalPrice")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtering function (real-life)
  const filterOrders = () => {
    setLoading(true);

    setTimeout(() => {
      let filtered = [...mockOrders];

      // Search
      if (search.trim()) {
        filtered = filtered.filter((o) =>
          o.customerName.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Status
      if (status.length > 0) {
        filtered = filtered.filter((o) => status.includes(o.status));
      }

      // Date From
      if (dateFrom) {
        filtered = filtered.filter((o) => o.orderDate >= dateFrom);
      }

      // Date To
      if (dateTo) {
        filtered = filtered.filter((o) => o.orderDate <= dateTo);
      }

      setOrders(filtered);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    filterOrders();
  }, [search]);

  const applyFilters = (close: () => void) => {
    filterOrders();
    close();
  };

  return (
    <Container>
      <div className="p-6 w-full">
        <h1 className="mb-4 text-xl font-semibold">Orders</h1>

        {/* Search + Filters */}
        <div className="flex gap-3 mb-6 w-full">
          <Input
            type="search"
            placeholder="Search order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />

          <RightSidebar
            trigger={
              <Button variant="outline" className="flex items-center gap-2">
                <CiFilter className="w-5 h-5" /> Filter
              </Button>
            }
            title="Filter Orders"
          >
            {(close) => (
              <>
                <div className="space-y-5">
                  {/* Customer Name */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Customer Name
                    </label>
                    <Input
                      placeholder="Search customer..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <SelectBox
                      label="Status"
                      options={["Pending", "Shipped", "Delivered", "Cancelled"]}
                      value={status}
                      onChange={(val) => setStatus(val)}
                      getLabel={(x) => x}
                      getValue={(x) => x}
                    />
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        From Date
                      </label>
                      <Input
                        type="date"
                        className="w-full border p-2 rounded-md bg-gray-50 dark:bg-slate-800"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        To Date
                      </label>
                      <Input
                        type="date"
                        className="w-full border p-2 rounded-md bg-gray-50 dark:bg-slate-800"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => applyFilters(close)}
                  className="mt-6 w-full"
                >
                  Apply Filters
                </Button>
              </>
            )}
          </RightSidebar>
        </div>

        <DataTable loading={loading} columns={columns} data={orders} />
      </div>
    </Container>
  );
};

export default OrderList;
