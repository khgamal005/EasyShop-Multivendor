import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiMenuAltLeft } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import { useSelector } from "react-redux";
import DropDown from "../Layout/DropDown";
import Navbar from "./Navbar";
import EasyShopLogo from "./EasyShopLogo";
import Wishlist from "../Wishlist/Wishlist";
import Cart from "../cart/Cart";
import { getUserImageUrl } from "../../utils/imageHelpers";

const Header = ({ active, activeHeading }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openWishlist, setOpenWishlist] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const cart = useSelector((state) => state.cart);
  const { categories } = useSelector((state) => state.category);

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    navigate(`/products?keyword=${encodeURIComponent(value)}`);
  };

  return (
    <header
      className={`w-full bg-white ${
        active ? "fixed top-0 left-0 z-20 shadow-md" : ""
      }`}
    >
      {/* Top Header */}
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <EasyShopLogo />
        </Link>

        {/* Desktop: Dropdown + Login/Signup */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center px-4 py-2 border rounded-md shadow-sm hover:bg-gray-50"
            >
              <BiMenuAltLeft size={22} className="mr-2" />
              All Categories
              <IoIosArrowDown size={16} className="ml-2" />
            </button>
            {showDropdown && (
              <DropDown
                categoriesData={categories}
                setDropDown={setShowDropdown}
              />
            )}
          </div>

          {!isAuthenticated && !isSeller && (
            <div className="flex gap-4 text-sm">
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
              <span className="text-gray-400">/</span>
              <Link to="/sign-up" className="hover:text-blue-600">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="p-2 mx-2 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full h-10 px-4 border-2 border-blue-600 rounded-md"
            />
          </div>
        </div>

        <div className="m-1">
          <button onClick={() => setOpenCart(true)} className="relative">
            <AiOutlineShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          {openCart && <Cart setOpenCart={setOpenCart} />}
        </div>

        {/* Actions - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => setOpenWishlist(true)} className="relative">
            <AiOutlineHeart size={24} />
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full bg-green-500 text-white">
              ❤
            </span>
          </button>
          {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}

          {!isSeller && (
            <Link to="/profile">
              {user?.avatar ? (
                <img
                  src={getUserImageUrl(user.avatar?.url)}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-500" />
              )}
            </Link>
          )}

          <div className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
            <Link to={isSeller ? "/dashboard" : "/shop-create"} className="flex items-center">
              {isSeller ? "Dashboard" : "Become Seller"}
              <IoIosArrowForward className="ml-1" />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          {isAuthenticated && !isSeller && (
            <Link to="/profile">
              {user?.avatar ? (
                <img
                  src={getUserImageUrl(user.avatar?.url)}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-8 h-8 text-gray-500" />
              )}
            </Link>
          )}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-1"
          >
            {showMobileMenu ? <RxCross1 size={24} /> : <RxHamburgerMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileMenu(false)}
          ></div>

          <div className="fixed w-[70%] bg-white h-screen top-0 left-0 z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <button onClick={() => setShowMobileMenu(false)} className="p-2">
                <RxCross1 size={24} />
              </button>
            </div>

            {!isSeller && (
              <div className="flex items-center gap-3 p-4 border-b">
                <Link
                  to="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3"
                >
                  {user?.avatar ? (
                    <img
                      src={getUserImageUrl(user.avatar?.url)}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-500" />
                  )}
                  <span className="font-medium">
                    {isAuthenticated ? user?.name : "My Account"}
                  </span>
                </Link>
              </div>
            )}

            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full h-10 px-4 border-2 border-blue-600 rounded-md"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              <Navbar active={activeHeading} />

              <div className="p-4 border-t">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center w-full px-4 py-2 border rounded-md shadow-sm hover:bg-gray-50"
                >
                  <BiMenuAltLeft size={20} className="mr-2" />
                  All Categories
                  <IoIosArrowDown size={16} className="ml-2" />
                </button>
                {showDropdown && (
                  <DropDown
                    categoriesData={categories}
                    setDropDown={setShowDropdown}
                  />
                )}
              </div>

              <div className="">
                <Link
                  to={isSeller ? "/dashboard" : "/shop-create"}
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm"
                >
                  {isSeller ? "Go to Dashboard" : "Become Seller"}
                  <IoIosArrowForward className="ml-1" />
                </Link>
              </div>
                    <div className="pt-0.5">
              <Link
                to={"/Coupons" }
              
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm"
              >
                {"Coupons"}
                <IoIosArrowForward className="ml-1" />
              </Link>
            </div>

              {!isAuthenticated && (
                <div className="p-4 border-t flex justify-center gap-4">
                  <Link
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="text-blue-600 font-medium"
                  >
                    Login as user
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={() => setShowMobileMenu(false)}
                    className="text-blue-600 font-medium"
                  >
                    Sign up as user
                  </Link>
                </div>
              )}
            </div>

      
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="border-t border-gray-100">
        <Navbar active={activeHeading} />
      </div>
    </header>
  );
};

export default Header;
