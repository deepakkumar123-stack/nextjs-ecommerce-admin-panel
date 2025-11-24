"use client";

import React, { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import MultiSelect from "@/components/ui/SelectField";

type ProductType = {
  _id?: string;
  name: string;
  categories: string[];
  price: number;
  stock: number;
  image?: File | null;
};

const categoriesList = ["Electronics", "Clothing", "Accessories", "Footwear"];

const ProductsTemplate = () => {
  const [product, setProduct] = useState<ProductType>({
    name: "",
    categories: [],
    price: 0,
    stock: 0,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setProduct((prev) => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
      return;
    }
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✅ Product Submitted:", product);
    alert("Product submitted! Check console.");
    setProduct({
      name: "",
      categories: [],
      price: 0,
      stock: 0,
      image: null,
    });
    setImagePreview("");
  };

  return (
    <div className="flex flex-col  bg-white rounded-3xl shadow-sm p-8  mx-auto ">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 ">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <Input
          name="name"
          label="Product Name"
          placeholder="Enter product name"
          value={product.name}
          onChange={handleInputChange}
          required
        />
        {/* Categories */}
        <MultiSelect
          label="Categories"
          required
          options={categoriesList}
          value={product.categories}
          onChange={(val) => setProduct({ ...product, categories: val })}
          placeholder="Select categories"
        />

        {/* Price */}
        <Input
          name="price"
          label="Price (₹)"
          type="number"
          placeholder="Enter price"
          value={product.price}
          onChange={handleInputChange}
          required
        />

        {/* Stock */}
        <Input
          name="stock"
          label="Stock"
          type="number"
          placeholder="Enter stock count"
          value={product.stock}
          onChange={handleInputChange}
          required
        />

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
              cursor-pointer"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-lg border"
            />
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all"
        >
          Save Product
        </Button>
      </form>
    </div>
  );
};

export default ProductsTemplate;
