"use client";

import { Container } from "@/components/ui/Container";
import DataTable from "@/components/ui/dataTable";
import Input from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useState } from "react";

type UserType = {
  _id: string;
  name: string;
  email: string;
  registeredAt: string;
};

// Mock registered users data
const mockData: UserType[] = [
  {
    _id: "1",
    name: "Deepak Kumar",
    email: "deepak@mail.com",
    registeredAt: "2025-09-28",
  },
  {
    _id: "2",
    name: "Rahul Sharma",
    email: "rahul@mail.com",
    registeredAt: "2025-09-27",
  },
  {
    _id: "3",
    name: "Anita Singh",
    email: "anita@mail.com",
    registeredAt: "2025-09-26",
  },
  {
    _id: "4",
    name: "Priya Verma",
    email: "priya@mail.com",
    registeredAt: "2025-09-25",
  },
];

const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("_id")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-gray-500">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "registeredAt",
    header: "Registered At",
    cell: ({ row }) => (
      <span className="text-gray-500">{row.getValue("registeredAt")}</span>
    ),
  },
];

const UsersList = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay
  }, []);

  // filter products by search
  const filteredProducts = mockData.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Container>
      <div className="p-6 w-full">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">User List</h1>

        {/* Actions: Search + Add Product */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
          {/* Search input takes remaining space */}
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />

          {/* Button sizes to content */}
          {/* <Link href="/dashboard/products/new" className="inline-block">
          <Button className="whitespace-nowrap">+ Add Category</Button>
        </Link> */}
        </div>

        {/* DataTable */}
        <DataTable
          loading={loading}
          size="lg"
          columns={columns}
          data={filteredProducts}
        />
      </div>
    </Container>
  );
};

export default UsersList;
