import React from "react";

const CategoryCard = ({ category }) => {



  return (
    <div className="w-[150px] md:w-[180px] bg-white shadow rounded-lg p-3 hover:shadow-md transition duration-200">
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-[100px] object-cover rounded-md"
      />
      <h4 className="text-center mt-2 font-medium text-gray-800">
        {category.name}
      </h4>
    </div>
  );
};

export default CategoryCard;
