import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/slices/sellerslice";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);

  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller?.name || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [zipCode, setZipcode] = useState(seller?.zipCode || "");

  const dispatch = useDispatch();

// Image Upload
const handleImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (reader.readyState === 2) {
      const base64 = reader.result;
      setAvatar(base64);
      dispatch(updateShopAvatar(base64))
        .then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            dispatch(loadSeller());
            toast.success("Avatar updated successfully!");
          } else {
            toast.error(res.payload);
          }
        });
    }
  };
  reader.readAsDataURL(file);
};

// Shop Info Update
const updateHandler = (e) => {
  e.preventDefault();
  dispatch(updateSellerInfo({ name, address, zipCode, phoneNumber, description }))
    .then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(loadSeller());
        toast.success("Shop info updated successfully!");
      } else {
        toast.error(res.payload);
      }
    });
};

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5">
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={avatar || seller?.avatar?.url}
              alt="Shop Avatar"
              className="w-[200px] h-[200px] rounded-full object-cover cursor-pointer"
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
              <input
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>

        {/* Shop Info Form */}
        <form
          className="flex flex-col items-center"
          onSubmit={updateHandler}
        >
          {[
            { label: "Shop Name", value: name, setValue: setName, type: "text", required: true },
            {
              label: "Shop Description",
              value: description,
              setValue: setDescription,
              type: "text",
              placeholder: "Enter your shop description",
            },
            { label: "Shop Address", value: address, setValue: setAddress, type: "text", required: true },
            { label: "Phone Number", value: phoneNumber, setValue: setPhoneNumber, type: "tel", required: true },
            { label: "Zip Code", value: zipCode, setValue: setZipcode, type: "text", required: true },
          ].map(({ label, value, setValue, type, placeholder, required }, index) => (
            <div
              key={index}
              className="w-full flex flex-col items-center 800px:w-[50%] mt-5"
            >
              <div className="w-full pl-[3%]">
                <label className="block pb-2">{label}</label>
              </div>
              <input
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder || label}
                className={`${styles.input} !w-[95%]`}
                required={required}
              />
            </div>
          ))}

          <div className="w-full flex flex-col items-center 800px:w-[50%] mt-5">
            <input
              type="submit"
              value="Update Shop"
              className={`${styles.button} w-[95%]`}
              readOnly
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
