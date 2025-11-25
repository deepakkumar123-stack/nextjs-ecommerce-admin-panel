"use client";

import React from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ImageUploadField from "@/components/ui/ImageUploadField";

import { DollarSign, Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import PageHeader from "@/components/ui/pageHeader";
import MultiSelectBox from "@/components/ui/SelectField";

import { useFormik } from "formik";
import * as Yup from "yup";

/* ---------------------------------------------------
   Types
--------------------------------------------------- */
type ProductType = {
  name: string;
  categories: string[];
  price: number;
  stock: number;
  image: File | File[] | null;
};

const categoriesList = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Footwear",
  "Home Goods",
  "Sporting",
];

/* ---------------------------------------------------
   Yup Validation Schema
--------------------------------------------------- */
const ProductSchema = Yup.object().shape({
  name: Yup.string().min(2).max(50).required("Product Name is required"),
  categories: Yup.array()
    .min(1, "Select at least one category")
    .required("Categories are required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .min(0.01, "Price must be greater than 0")
    .required("Price is required"),
  stock: Yup.number()
    .typeError("Stock must be a number")
    .integer("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .required("Stock count is required"),
  image: Yup.mixed().required("Product image is required"),
});

/* ---------------------------------------------------
   Page Component
--------------------------------------------------- */
const ProductsTemplate = () => {
  const formik = useFormik<ProductType>({
    initialValues: {
      name: "",
      categories: [],
      price: 0,
      stock: 0,
      image: null,
    },
    validationSchema: ProductSchema,
    onSubmit: (values, { resetForm }) => {
      console.log("Submitted Product:", values);
      resetForm();
    },
  });

  return (
    <Container>
      <div className="p-6 w-full">
        <PageHeader title="Add New Product" />

        <form onSubmit={formik.handleSubmit} className="space-y-10 mt-6">
          {/* -----------------------------------------
              Product Details
          ------------------------------------------ */}
          <div className="bg-white p-6 rounded-2xl shadow-sm  border border-neutral-400">
            <h2 className="text-lg font-semibold mb-6 text-gray-800">
              Product Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Product Name"
                placeholder="e.g., Wireless Mechanical Keyboard"
                {...formik.getFieldProps("name")}
                errorMessage={
                  formik.touched.name ? formik.errors.name : undefined
                }
              />

              <MultiSelectBox
                label="Categories"
                options={categoriesList}
                value={formik.values.categories}
                placeholder="Select categories"
                getLabel={(x) => x}
                getValue={(x) => x}
                onChange={(val) => formik.setFieldValue("categories", val)}
                onBlur={() => formik.setFieldTouched("categories", true)}
                errorMessage={
                  formik.touched.categories
                    ? (formik.errors.categories as string)
                    : undefined
                }
              />

              <Input
                label="Price"
                type="number"
                placeholder="0.00"
                min={0}
                icon={<DollarSign className="w-4 h-4 text-gray-400" />}
                {...formik.getFieldProps("price")}
                errorMessage={
                  formik.touched.price ? formik.errors.price : undefined
                }
              />

              <Input
                label="Stock Count"
                type="number"
                placeholder="Enter available quantity"
                min={0}
                icon={<Package className="w-4 h-4 text-gray-400" />}
                {...formik.getFieldProps("stock")}
                errorMessage={
                  formik.touched.stock ? formik.errors.stock : undefined
                }
              />
            </div>
          </div>

          {/* -----------------------------------------
              Product Image Upload
          ------------------------------------------ */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-400">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Product Images
            </h2>

            <ImageUploadField
              label="Upload Product Images"
              name="image"
              multiple
              value={formik.values.image}
              onChange={(files) => formik.setFieldValue("image", files)}
              onBlur={() => formik.setFieldTouched("image", true)}
              maxFileSizeMB={5}
              errorMessage={
                formik.touched.image
                  ? (formik.errors.image as string)
                  : undefined
              }
            />
          </div>

          {/* -----------------------------------------
              Submit Button
          ------------------------------------------ */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {formik.isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default ProductsTemplate;
