// DropDown.jsx
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "../../styles/styles";
import { getSubCategories } from "../../redux/slices/subcategorySlice";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subCategories } = useSelector((state) => state.subCategory); // make sure your slice has this
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const handleCategoryHover = (categoryId) => {
    setActiveCategoryId(categoryId);
    dispatch(getSubCategories(categoryId));
  };

  const handleSubCategoryClick = (subId) => {
  navigate(`/products?subcategory=${subId}`);
    setDropDown(false);
  };

  return (
    <div className="pb-4 w-[270px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm">
      {categoriesData &&
        categoriesData.map((cat) => (
          <div
            key={cat._id}
            className={`${styles.noramlFlex} group relative`}
            onMouseEnter={() => handleCategoryHover(cat._id)}
          >
            <h3 className="m-3 cursor-pointer select-none">{cat.name}</h3>

            {activeCategoryId === cat._id && subCategories.length > 0 && (
              <div className="absolute left-full top-0 bg-white shadow-md p-2 z-40 rounded">
                {subCategories.map((sub) => (
                  <div
                    key={sub._id}
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() => handleSubCategoryClick(sub._id)}
                  >
                    {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default DropDown;
