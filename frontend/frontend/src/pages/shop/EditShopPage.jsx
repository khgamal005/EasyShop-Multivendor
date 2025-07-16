// pages/EditShopPage.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSeller, updateShopInfo } from "../../redux/slices/sellerslice"; // Ensure you have updateSeller thunk
import { toast } from "react-toastify";
import { getSellerImageUrl } from '../../utils/imageHelpers';


const EditShopPage = () => {
  const dispatch = useDispatch();
  const { seller, isLoading, error } = useSelector((state) => state.seller);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    zipCode: "",
    avatar:""
  });


const [previewImage, setPreviewImage] = useState(null);
      const [existingImages, setExistingImages] = useState([]);
  

useEffect(() => {
  if (!seller) {
    dispatch(loadSeller());
  }
}, [dispatch, seller]);
useEffect(() => {
  if (seller) {
    setFormData((prev) => ({
      ...prev,
      name: seller.name,
      email: seller.email,
      address: seller.address,
      phoneNumber: seller.phoneNumber,
      zipCode: seller.zipCode || "",
    }));

    if (seller.avatar?.url) {
      setExistingImages(seller.avatar.url); // Single string, not array
    }
  }
}, [seller]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setPreviewImage(file); // Set for immediate preview
    setFormData((prev) => ({ ...prev, avatar: file })); // Add to form data if needed
  }
};





  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("address", formData.address);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("zipCode", formData.zipCode);
      if (previewImage) {
  data.append("avatar", previewImage);
}
      


      await dispatch(updateShopInfo(data )); // updateSeller should accept FormData
      toast.success("Shop info updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update shop");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h2 className="text-2xl font-semibold">Edit Shop Information</h2>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          {["name", "email", "address", "phoneNumber", "zipCode"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                {field === "zipCode" ? "Zip Code" : field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required={field !== "zipCode"}
              />
            </div>
          ))}

          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
              Shop Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              id="avatar"
              name="avatar"
              onChange={handleAvatarChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />

{(previewImage || existingImages) && (
  <div className="relative mt-2 w-24 h-24">
    <img
      src={getSellerImageUrl(previewImage || existingImages)}
      alt="avatar preview"
      className="w-full h-full object-cover rounded-md border"
    />
  </div>
)}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Update Shop Info
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditShopPage;
