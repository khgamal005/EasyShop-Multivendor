// src/components/Products/ProductSidebar.jsx
import { useState } from "react";

const ProductSidebar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    colors: [],
  });

  const availableColors = [
    "red",
    "blue",
    "green",
    "black",
    "white",
    "yellow",
    "orange",
    "purple",
    "pink",
    "gray",
    "brown",
    "teal",
    "indigo",
    "beige",
    "maroon",
    "navy",
    "olive",
    "gold",
    "silver",
    "salmon",
    "tomato",
  ];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleColor = (color) => {
    setFilters((prev) => {
      const selected = prev.colors || [];

      const updatedColors = selected.includes(color)
        ? selected.filter((c) => c !== color)
        : [...selected, color];

      return { ...prev, colors: updatedColors };
    });
  };

  const applyFilters = () => {
    const query = {};

    if (filters.priceMin) query["discountPrice[gte]"] = filters.priceMin;
    if (filters.priceMax) query["discountPrice[lte]"] = filters.priceMax;
    if (filters.colors.length > 0) query["color"] = filters.colors;

    onFilterChange(query);
  };

  return (
    <div className="p-4 border rounded shadow w-full md:w-64">
      <h3 className="font-semibold mb-3">Filters</h3>

      {/* Price Filter */}
      <div className="mb-4">
        <label className="block mb-1">Price Range</label>
        <div className="flex gap-2">
          <input
            name="priceMin"
            value={filters.priceMin}
            onChange={handleInputChange}
            type="number"
            placeholder="Min"
            className="border p-1 w-full"
          />
          <input
            name="priceMax"
            value={filters.priceMax}
            onChange={handleInputChange}
            type="number"
            placeholder="Max"
            className="border p-1 w-full"
          />
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-4">
        <label className="block mb-2">Colors</label>
        <div className="flex gap-2 flex-wrap">
          {availableColors.map((color) => (
            <label key={color} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.colors?.includes(color) || false}
                onChange={() => toggleColor(color)}
              />
              <span className="capitalize">{color}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default ProductSidebar;
