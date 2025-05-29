import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { getSubCategories } from "../../redux/slices/subcategorySlice";
import { updateProduct, getProduct } from "../../redux/slices/productslice";
import { HexColorPicker } from "react-colorful";
import { MdDelete } from "react-icons/md";
import DisplayImage from "../../utils/DisplayImage";
import { getProductImageUrl } from "../../utils/imageHelpers";

const EditProduct = ({ onClose, product }) => {
  const { seller } = useSelector((state) => state.seller);
  const { categories } = useSelector((state) => state.category);
  const { subCategories } = useSelector((state) => state.subCategory);

  const dispatch = useDispatch();
  const API_BASE_URL = "http://localhost:8000"; // Your backend base URL
  const PRODUCT_IMAGE_PATH = "/products/"; // The path where product images are served
  const [subCategoryIds, setSubCategoryIds] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [sold_out, setSoldOut] = useState(0);
  const [color, setColor] = useState("#aabbcc");
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategoryId(product.category?._id || "");
      setSubCategoryIds(product.subcategories?.map((sub) => sub._id) || []);
      setTags(product.tags || "");
      setOriginalPrice(product.originalPrice);
      setDiscountPrice(product.discountPrice);
      setStock(product.stock);
      setSoldOut(product.sold_out || 0);
      setColor(product.color || "#aabbcc");
      // Filter out any null values from the existing images array
      const validExistingImages = product.images.filter((img) => img !== null);
      setExistingImages(validExistingImages);

      // Load subcategories if category is set
      if (product.category?._id) {
        dispatch(getSubCategories(product.category._id));
      }
    }
  }, [product, dispatch]);

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setCategoryId(selectedId);
    setSubCategoryIds([]); // clear subcategory selection
    if (selectedId) {
      dispatch(getSubCategories(selectedId));
    }
  };

  const handleDrop = (acceptedFiles) => {
    setNewFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
    multiple: true,
    maxFiles: 7,
  });

  // const handleDeleteImage = (index, isExisting) => {
  //   if (isExisting) {
  //     setRemovedImages((prev) => [...prev, existingImages[index]]);
  //     setExistingImages((prev) => prev.filter((_, i) => i !== index));
  //   } else {
  //     setImages((prev) => prev.filter((_, i) => i !== index));
  //   }
  // };
  const handleDeleteImage = (index, isExisting) => {
    if (isExisting) {
      // For existing images, we need to track which ones were removed
      const imageToRemove = existingImages[index];
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setRemovedImages((prev) => [...prev, imageToRemove]);
    } else {
      // For new files, just remove from the array
      setNewFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !description ||
      !categoryId ||
      subCategoryIds.length === 0 ||
      !originalPrice ||
      !discountPrice ||
      !stock
      // images.length === 0
    ) {
      return toast.error(
        "Please fill in all required fields including at least one image."
      );
    }
    // Ensure product._id is defined
    if (!product._id) {
      console.error("Product ID is missing!");
      return;
    }
    // Ensure at least one image remains
    if (existingImages.length + newFiles.length === 0) {
      alert("Product must have at least one image");
      return;
    }
    const newForm = new FormData();

    // Handle images:
    // If only one image remains, send it as string
    // If multiple, send as array
    existingImages.forEach((img) => {
      newForm.append("images", img); // Use same key for all
    });

    // Append newly uploaded image files
    newFiles.forEach((file) => {
      newForm.append("images", file); // Same key
    });

    // Add basic product fields
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", categoryId);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice.toString());
    newForm.append("discountPrice", discountPrice.toString());
    newForm.append("stock", stock.toString());
    newForm.append("sold_out", sold_out.toString());
    newForm.append("color", color);

    // Append subcategories (if multiple)
    subCategoryIds.forEach((id) => {
      newForm.append("subcategories", id); // consistent key name
    });

    try {
      const action = await dispatch(
        updateProduct({
          id: product._id, // Explicitly name the ID field
          formData: newForm, // Explicitly name the form data
        })
      );
      if (updateProduct.fulfilled.match(action)) {
        toast.success("Product updated successfully");
        onClose();
        // Refresh the product data
        dispatch(getProduct(product._id));
      } else {
        throw action.payload || "Failed to update product";
      }
    } catch (error) {
      toast.error(error.message || error);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up object URLs to avoid memory leaks
      newFiles.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [newFiles]);

  const getImageUrl = (img) => {
    // Check if the image is valid
    if (!img) return "/images/image-placeholder.jpg"; // Fallback image for invalid values

    // If the image is a string, it could be a URL; return it directly
    if (typeof img === "string") {
      return `${API_BASE_URL}${PRODUCT_IMAGE_PATH}${img}`;
    }

    // If it's a File or Blob, create an Object URL
    if (img instanceof Blob || img instanceof File) {
      return URL.createObjectURL(img);
    }

    // Return a default fallback or null in case of an invalid type
    return "/images/image-placeholder.jpg"; // Fallback image
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Product Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Product name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full border border-gray-300 rounded-md px-4 py-2 min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              value={categoryId}
              onChange={handleCategoryChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategories */}
          <div>
            <label className="block mb-1 font-medium">Subcategories</label>
            <select
              multiple
              value={subCategoryIds}
              onChange={(e) =>
                setSubCategoryIds(
                  Array.from(e.target.selectedOptions).map((o) => o.value)
                )
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {subCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block mb-1 font-medium">Tags</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              type="text"
              placeholder="e.g. gaming, casual"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Original Price</label>
              <input
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                type="number"
                placeholder="100"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Discount Price</label>
              <input
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                type="number"
                placeholder="80"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Stock and Sold Out */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Stock</label>
              <input
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                type="number"
                placeholder="10"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Sold Out</label>
              <input
                value={sold_out}
                onChange={(e) => setSoldOut(e.target.value)}
                type="number"
                placeholder="0"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block mb-1 font-medium">Color</label>
            <HexColorPicker color={color} onChange={setColor} />
            <div
              className="mt-2 w-10 h-10 border rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium">Product Images</label>
            <div
              {...getRootProps()}
              className="w-full min-h-[120px] border-2 border-dashed border-gray-400 rounded-md p-4 cursor-pointer flex flex-col items-center justify-center text-gray-600"
            >
              <input {...getInputProps()} />
              <AiOutlinePlusCircle size={30} />
              <p className="text-sm mt-2">
                Click or drag and drop images here (max remaining)
              </p>
            </div>

            {/* Existing Images */}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Existing Images</h4>
              <div className="flex flex-wrap gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={getProductImageUrl(img)}
                      alt={`Product preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(getProductImageUrl(img));
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/image-placeholder.jpg"; // Fallback image
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index, true)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {/* New Images */}
              {newFiles.map((file, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={getProductImageUrl(file)}
                    alt="preview"
                    className="w-full h-full object-cover rounded-md"
                    onClick={() => {
                      setOpenFullScreenImage(true);
                      setFullScreenImage(getProductImageUrl(file));
                    }}
                  />
                  {/* ... delete button ... */}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index, false)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
      {/***display image full screen */}
      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage} // ✅ FIXED
        />
      )}
    </div>
  );
};

export default EditProduct;
