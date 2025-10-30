"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import DataTable from "@/components/ui/dataTable";
import Input from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

type ProductType = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

// Mock product data
const mockProducts: ProductType[] = [
  {
    _id: "1",
    name: "Wireless Mouse",
    category: "Electronics",
    price: 499,
    stock: 25,
  },
  {
    _id: "2",
    name: "Bluetooth Headphones",
    category: "Electronics",
    price: 1299,
    stock: 12,
  },
  {
    _id: "3",
    name: "Gaming Keyboard",
    category: "Electronics",
    price: 1999,
    stock: 8,
  },
  {
    _id: "4",
    name: "Office Chair",
    category: "Furniture",
    price: 4999,
    stock: 5,
  },
];

const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-medium text-gray-700">{row.getValue("_id")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-gray-500">{row.getValue("category")}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="text-gray-600 font-semibold">
        ₹{row.getValue("price")}
      </span>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      return (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            stock > 10
              ? "bg-green-100 text-green-700"
              : stock > 0
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {stock}
        </span>
      );
    },
  },
];

const ProductList = () => {
  const [search, setSearch] = useState("");

  // filter products by search
  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 w-full">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Product List</h1>

      {/* Actions: Search + Add Product */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
        {/* Search input takes remaining space */}
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />

        {/* Button sizes to content */}
        <Link href="/dashboard/products/new" className="inline-block">
          <Button className="whitespace-nowrap">+ Add Product</Button>
        </Link>
      </div>

      {/* DataTable */}
      <DataTable columns={columns} data={filteredProducts} />
    </div>
  );
};

export default ProductList;
