"use client";

import React, { useState, useRef, useEffect } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const toggleCategory = (category: string) => {
    setProduct((prev) => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
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
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories <span className="text-red-500">*</span>
          </label>
          <div
            className="w-full px-4 py-2 border rounded-lg cursor-pointer bg-white focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {product.categories.length > 0
              ? product.categories.join(", ")
              : "Select categories"}
            <svg
              className={`w-4 h-4 ml-2 transform transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {categoriesList.map((cat) => (
                <div
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-blue-50 ${
                    product.categories.includes(cat) ? "bg-blue-50" : ""
                  }`}
                >
                  <span className="text-gray-700">{cat}</span>
                  {product.categories.includes(cat) && (
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Selected Tags */}
          {product.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full flex items-center gap-1"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="text-blue-700 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

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
