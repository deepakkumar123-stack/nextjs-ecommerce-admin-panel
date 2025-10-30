"use client";

import React, { useState, ChangeEvent } from "react";
import Input from "@/components/ui/input"; // Your advanced Input component
import Button from "@/components/ui/button";

type ProductType = {
  _id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: File | null;
};

const categories = ["Electronics", "Clothing", "Accessories", "Footwear"];

const ProductsTemplate = () => {
  const [product, setProduct] = useState<ProductType>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

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
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <Input
            name="name"
            label="Product Name"
            placeholder="Enter product name"
            value={product.name}
            onChange={handleChange}
            required
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <Input
            name="price"
            label="Price (₹)"
            type="number"
            placeholder="Enter price"
            value={product.price}
            onChange={handleChange}
            required
          />

          {/* Stock */}
          <Input
            name="stock"
            label="Stock"
            type="number"
            placeholder="Enter stock count"
            value={product.stock}
            onChange={handleChange}
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
              onChange={handleChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            Save Product
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProductsTemplate;
