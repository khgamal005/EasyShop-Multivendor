import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrand, clearErrors, clearSuccess } from "../../redux/slices/brandSlice";
import { toast } from "react-toastify";

const CreateBrand = () => {
  const dispatch = useDispatch();
  const { isLoading, success, error, message } = useSelector((state) => state.brand);

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) {
      toast.error("Please provide both brand name and image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    dispatch(createBrand(formData));
  };

  useEffect(() => {
    if (success && message) {
      toast.success(message);
      setName("");
      setImage(null);
      dispatch(clearSuccess());
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [success, error, message, dispatch]);

  return (
    <div>
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create Brand</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Brand Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter brand name"
            />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Brand Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
          {isLoading ? "Creating..." : "Create Brand"}
        </button>
      </form>
    </div>
          </div>
  );
};

export default CreateBrand;
