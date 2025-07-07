import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../componant/Categories/CategoryCard";

const Categories = () => {
  const { categories } = useSelector((state) => state.category);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="flex flex-wrap gap-4">
        {categories && categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => handleCategoryClick(cat._id)}
              className="cursor-pointer"
            >
              <CategoryCard category={cat} />
            </div>
          ))
        ) : (
          <p>No categories available.</p>
        )}
      </div>
    </div>
  );
};

export default Categories;
