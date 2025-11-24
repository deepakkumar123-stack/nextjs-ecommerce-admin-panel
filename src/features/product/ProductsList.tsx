"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import DataTable from "@/components/ui/dataTable";
import Input from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { GoEye } from "react-icons/go";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin3Line } from "react-icons/ri";
import Tooltip from "@/components/ui/tooltip";
import { MotionAlertDialog } from "@/components/ui/dailog";
import { Container } from "@/components/ui/Container";
import Badge from "@/components/ui/badge";

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

const ProductList = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay
  }, []);

  const handleDelete = () => {
    console.log("Deleted Successfully!");
  };

  // filter products by search
  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );
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
          <>
            <Badge
              variant={
                stock > 10 ? "success" : stock > 0 ? "warning" : "danger"
              }
            >
              {stock}
            </Badge>
          </>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {/* Edit Button - Primary Action Style */}
            <Tooltip content="Edit Product" position="top">
              <button className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors">
                <MdEdit size={18} />
              </button>
            </Tooltip>

            {/* View Button - Neutral Style */}
            <Tooltip content="View Details" position="top">
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                <GoEye size={18} />
              </button>
            </Tooltip>

            {/* Delete Button - Danger Style */}
            <Tooltip content="Delete Product" position="top">
              <button
                onClick={() => setOpen(true)}
                className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
              >
                <RiDeleteBin3Line size={18} />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Container>
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
        <DataTable
          loading={loading}
          size="lg"
          columns={columns}
          data={filteredProducts}
        />

        {/*cinform dailog*/}
        <MotionAlertDialog
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Delete Product"
          description="Are you sure you want to delete this item? This action cannot be undone."
          variant="danger"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
        />
      </div>
    </Container>
  );
};

export default ProductList;
