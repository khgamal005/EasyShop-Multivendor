import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSubCategory,clearSuccess ,clearErrors} from "../../redux/slices/subcategorySlice";
import { toast } from "react-toastify";

const CreateSubCategory = () => {
  const dispatch = useDispatch();

  const {  categories } = useSelector((state) => state.category);
  const { isLoading, error  , success, message } = useSelector((state) => state.subCategory);


  const [name, setName] = useState("");
  const [category, setCategoryId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category) {
      toast.error("Please enter all fields");
      return;
    }

    const formData = { name,  category };

    const action = await dispatch(createSubCategory(formData));
    if (createSubCategory.fulfilled.match(action)) {
      toast.success("SubCategory created successfully");
      setName("");
      setCategoryId("");
    } else {
      toast.error(action.payload || "Failed to create subcategory");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Create SubCategory</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="SubCategory name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {Array.isArray(categories) &&
              categories.map((cat) => (
                  <option key={cat._id} value={cat.category._id}>
                  {cat.category.name}
          
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md"
        >
          {isLoading ? "Creating..." : "Create SubCategory"}
        </button>
      </form>
    </div>
  );
};

export default CreateSubCategory;
