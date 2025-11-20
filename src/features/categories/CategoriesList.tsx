"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import DataTable from "@/components/ui/dataTable";
import Input from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import Dialog from "@/components/ui/dailogCard";
import Tooltip from "@/components/ui/tooltip";
import { MdEdit } from "react-icons/md";
import { GoEye } from "react-icons/go";
import { RiDeleteBin3Line } from "react-icons/ri";
import { MotionAlertDialog } from "@/components/ui/dailog";
import { Container } from "@/components/ui/Container";

type CategoryType = {
  _id: string;
  name: string;
  description: string;
  productCount: number;
};

// Mock categories data
const mockCategories: CategoryType[] = [
  {
    _id: "1",
    name: "Electronics",
    description: "Devices, gadgets, and accessories",
    productCount: 12,
  },
  {
    _id: "2",
    name: "Furniture",
    description: "Home and office furniture",
    productCount: 5,
  },
  {
    _id: "3",
    name: "Clothing",
    description: "Apparel for men, women, and kids",
    productCount: 20,
  },
  {
    _id: "4",
    name: "Books",
    description: "Fiction, non-fiction, and academic books",
    productCount: 8,
  },
];

const CategoriesList = () => {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  // Filter categories by search
  const filteredCategories = mockCategories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Category:", newCategory);
    // Here you can integrate API call to save category
    setIsDialogOpen(false);
    setNewCategory({ name: "", description: "" });
  };

  const handleDelete = () => {
    console.log("Deleted Successfully!");
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay
  }, []);
  const columns: ColumnDef<CategoryType>[] = [
    {
      accessorKey: "_id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("_id")}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => <span>{row.getValue("name")}</span>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-gray-500">{row.getValue("description")}</span>
      ),
    },
    {
      accessorKey: "productCount",
      header: "Products",
      cell: ({ row }) => <span>{row.getValue("productCount")}</span>,
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
      {" "}
      <div className="p-6 w-full">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Categories List
        </h1>

        {/* Actions: Search + Add Category */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />

          <Button
            className="whitespace-nowrap"
            onClick={() => setIsDialogOpen(true)}
          >
            + Add Category
          </Button>
        </div>

        {/* DataTable */}
        <DataTable
          loading={loading}
          size="lg"
          columns={columns}
          data={filteredCategories}
        />

        {/* Add Category Dialog */}
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Add New Category"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="categoryForm">
                Save
              </Button>
            </>
          }
        >
          <form
            id="categoryForm"
            onSubmit={handleCategorySubmit}
            className="space-y-4"
          >
            <Input
              name="name"
              label="Category Name"
              placeholder="Enter category name"
              value={newCategory.name}
              onChange={handleCategoryChange}
              required
            />
            <Input
              name="description"
              label="Description"
              placeholder="Enter description"
              value={newCategory.description}
              onChange={handleCategoryChange}
              as="textarea"
              rows={3}
            />
          </form>
        </Dialog>
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

export default CategoriesList;
