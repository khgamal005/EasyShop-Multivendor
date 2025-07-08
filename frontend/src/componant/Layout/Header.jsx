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
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const [openCart, setOpenCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openWishlist, setOpenWishlist] = useState(false);
  const cart = useSelector((state) => state.cart);
  const { categories } = useSelector((state) => state.category);

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // local state to hold input
    navigate(`/products?keyword=${encodeURIComponent(value)}`);
  };

  return (
    <header
      className={`w-full bg-w ${
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
        <div className=" hidden md:flex items-center gap-6">
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
        <div className="flex-grow mx-4 hidden md:block">
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

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button onClick={() => setOpenWishlist(true)} className="relative">
            <AiOutlineHeart size={24} />
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full bg-green-500 text-white">
              ❤
            </span>
          </button>
          {/* wishlist popup */}
          {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}

          <button onClick={() => setOpenCart(true)} className="relative">
            <AiOutlineShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          {/* cart popup */}
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

          {!isSeller ? (
            <Link to="/profile" className="bg">
              {user?.avatar ? (
                <img
                  src={getUserImageUrl(user.avatar.url)}
                  alt={user.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-500" />
              )}
            </Link>
          ) : null}

          <div className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
            <Link
              to={isSeller ? "/dashboard" : "/shop-create"}
              className="flex items-center"
            >
              {isSeller ? "Dashboard" : "Become Seller"}
              <IoIosArrowForward className="ml-1" />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <RxHamburgerMenu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}>
          <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
            <div className="w-full justify-between flex pr-3">
              <div>
                <div
                  className="relative mr-[15px]"
                  onClick={() =>
                    setOpenWishlist(true) || setShowMobileMenu(false)
                  }
                >
                  <AiOutlineHeart size={30} className="mt-5 ml-3" />
                  <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                    {/* {wishlist && wishlist.length} */}
                  </span>
                </div>
              </div>
              <RxCross1
                size={30}
                className="ml-4 mt-5"
                onClick={() => setShowMobileMenu(false)}
              />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full h-10 px-4 border-2 border-blue-600 rounded-md"
              />
            </div>

            <Navbar active={activeHeading} />
            <div className={`$ ml-4 !rounded-[4px]`}>
              {isSeller ? (
                <Link to="/dashboard" />
              ) : (
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              )}
            </div>
            <br />
            <br />
            <br />

            <div className="flex w-full justify-center ">
              {isAuthenticated ? (
                <div className="relative group inline-block">
                  <Link to="/profile">
                    <img
                      src={getUserImageUrl(user.avatar?.url)}
                      alt=""
                      className="w-[60px] h-[60px]  rounded-full border-[3px] border-[#0eae88]   "
                    />
                  </Link>
                  {/* Hover Text */}
                  <div
                    className="absolute bottom-[-30px] left-1/2 -translate-x-1/2
                   bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap"
                  >
                    Visit profile Page
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[18px] pr-[10px] text-[#000000b7]"
                  >
                    Login /
                  </Link>
                  <Link to="/sign-up" className="text-[18px] text-[#000000b7]">
                    Sign up
                  </Link>
                </>
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
