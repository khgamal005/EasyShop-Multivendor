import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, updateUserInfo } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { getUserImageUrl } from "../../utils/imageHelpers";

const ProfileContent = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    avatar: "",
  });


  const [previewImage, setPreviewImage] = useState(null);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        address: user.address,
        phoneNumber: user.phoneNumber,
      }));

      if (user.avatar?.url) {
        setExistingImages(user.avatar.url);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleAvatarChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    // Check if file size exceeds 10MB (10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB");
      return;
    }

    setPreviewImage(file); // For preview (URL.createObjectURL can also be used)
    setFormData((prev) => ({
      ...prev,
      avatar: file,
    }));
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
      if (previewImage) {
        data.append("avatar", previewImage);
      }

      await dispatch(updateUserInfo(data));
      toast.success("Shop info updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update shop");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h2 className="text-2xl font-semibold">Edit User Information</h2>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          {["name", "email", "address", "phoneNumber"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}

          {/* Avatar Upload */}
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
              User Avatar
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
                  src={getUserImageUrl(previewImage || existingImages)}
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
            Update Info
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileContent;
