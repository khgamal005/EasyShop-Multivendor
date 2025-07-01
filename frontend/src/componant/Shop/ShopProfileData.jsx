import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import ShopProducts from "./ShopProducts";
import ShopEvents from "./ShopEvents";
import ShopReviews from "./ShopReviews";

const ShopProfileData = ({ isOwner }) => {
  const [active, setActive] = useState(1);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex w-full items-center justify-between bg-amber-400 p-2 rounded-md">
        <div className="flex bg-blue-400 rounded-md px-4 py-2 space-x-6">
          {["Shop Products"].map((label, i) => (
            <h5
              key={i}
              onClick={() => setActive(i + 1)}
              className={`font-semibold text-[18px] cursor-pointer ${
                active === i + 1 ? "text-red-500" : "text-gray-800"
              }`}
            >
              {label}
            </h5>
          ))}
        </div>
        {isOwner && (
          <Link to="/dashboard">
            <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
              <span className="text-white">Go Dashboard</span>
            </div>
          </Link>
        )}
      </div>

      <br />

      {/* Render based on active tab */}
      {active === 1 && <ShopProducts />}
    
    </div>
  );
};

export default ShopProfileData;
