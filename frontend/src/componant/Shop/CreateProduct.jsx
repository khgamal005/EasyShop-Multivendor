import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { getSubCategories } from "../../redux/slices/subcategorySlice";
import { createPro } from "../../redux/slices/productslice";
import { MdDelete } from "react-icons/md";
import DisplayImage from "../../utils/DisplayImage";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { categories } = useSelector((state) => state.category);
  const { subCategories } = useSelector((state) => state.subCategory);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [subCategoryIds, setSubCategoryIds] = useState([]);
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();
  const [sold_out, setSoldOut] = useState();
  const [color, setColor] = useState("#aabbcc");
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setCategoryId(selectedId);
    setSubCategoryIds([]); // clear subcategory selection
    if (selectedId) {
      dispatch(getSubCategories(selectedId));
    }
  };

  const handleDrop = (acceptedFiles) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
    multiple: true,
    maxFiles: 7, // optional
  });

  const handleDeleteProductImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !description ||
      !categoryId ||
      !subCategoryIds ||
      !originalPrice ||
      !discountPrice ||
      !stock ||
      images.length === 0
    ) {
      return toast.error(
        "Please fill in all required fields including at least one image."
      );
    }

    const newForm = new FormData();
    images.forEach((file) => newForm.append("images", file)); // Each file added under 'images'

    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", categoryId);
    subCategoryIds.forEach((id) => newForm.append("subcategories[]", id));
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("shop", seller._id);
    newForm.append("sold_out", sold_out);
    newForm.append("color", color);

    const action = await dispatch(createPro(newForm));
    if (createPro.fulfilled.match(action)) {
      toast.success("create product successfully");
      setName("");
      setDescription("");
      setCategoryId("");
      setSubCategoryIds([]);
      setTags("");
      setOriginalPrice("");
      setDiscountPrice("");
      setStock("");
      setSoldOut(false);
      setImages([]);
    } else {
      toast.error(action.payload || "Failed to create product");
    }
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      {/* create product form */}
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
          ></textarea>
        </div>
        <br />
        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryId}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
        <br />
        {/* Subcategory Select */}
        {categoryId && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Subcategories
            </label>
            <select
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              multiple
              value={subCategoryIds}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ).filter((val) => val !== ""); // prevent empty selections;
                setSubCategoryIds(selectedOptions);
              }}
            >
              <option value="" disabled>
                Select Subcategories
              </option>
              {subCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setOriginalPrice(Number(e.target.value))}
            placeholder="Enter your product price..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDiscountPrice(Number(e.target.value))}
            placeholder="Enter your product price with discount..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(Number(e.target.value))}
            placeholder="Enter your product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            sold out <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={sold_out}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setSoldOut(Number(e.target.value))}
            placeholder="Enter your product stock..."
          />
        </div>
        <br />
        <div className="mt-6">
          <label
            htmlFor="colorInput"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Product Color
          </label>

          <input
            type="text"
            id="colorInput"
            name="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g., blue, red, sky blue"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {color && (
            <div className="mt-2 text-sm text-gray-700 flex items-center gap-2">
              <span>Preview:</span>
              <span
                className="w-5 h-5 rounded-full border"
                style={{ backgroundColor: color }}
              ></span>
              <span className="capitalize">{color}</span>
            </div>
          )}
        </div>

        <br />

        <div className="mb-4">
          <label className="block font-medium mb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>

          <div
            {...getRootProps()}
            className="w-full min-h-[120px] border-2 border-dashed
     border-gray-400 rounded-md p-4 cursor-pointer flex flex-col items-center justify-center text-gray-600"
          >
            <input {...getInputProps()} />
            <AiOutlinePlusCircle size={30} />
            <p className="text-sm mt-2">
              Click or drag and drop images here (max 7)
            </p>
          </div>

          {/* Show uploaded images */}
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((image, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`upload-${index}`}
                  className="w-full h-full object-cover rounded-md"
                  onClick={() => {
                    setOpenFullScreenImage(true);
                    setFullScreenImage(image);
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteProductImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                >
                  <MdDelete size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <input
            type="submit"
            value="Create"
            className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </form>

      {/***display image full screen */}
      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={URL.createObjectURL(fullScreenImage)} // ✅ FIXED
        />
      )}
    </div>
  );
};

export default CreateProduct;
