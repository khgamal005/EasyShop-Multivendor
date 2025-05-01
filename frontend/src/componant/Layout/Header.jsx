import  { useState } from "react";
import { Link } from "react-router-dom";
import { BiMenuAltLeft } from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import { useSelector } from "react-redux";
import DropDown from "../Layout/DropDown";
import Navbar from "./Navbar";
import EasyShopLogo from "./EasyShopLogo";
import { categoriesData } from "../../static/data";
// import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";

const Header = ({
  searchTerm,
  handleSearchChange,
  searchData,
  active,
  activeHeading,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);

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
                categoriesData={categoriesData}
                setDropDown={setShowDropdown}
              />
            )}
          </div>

          {!isAuthenticated && !isSeller &&(
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
            {searchData?.length > 0 && (
              <div className="absolute left-0 top-full mt-2 bg-white shadow-md rounded-md z-30 w-full max-h-60 overflow-y-auto">
                {searchData.map((item, index) => (
                  <Link key={index} to={`/product/${item._id}`}>
                    <div className="flex items-center px-3 py-2 hover:bg-gray-100">
                      <img
                        src={item.images[0]?.url}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                      <span className="text-sm text-gray-800">{item.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
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
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full bg-green-500 text-white">
              🛒
            </span>
          </button>
          {/* cart popup */}
          {/* {openCart ? <Cart setOpenCart={setOpenCart} /> : null} */}

          {isAuthenticated ? (
            <Link to="/profile">
              <img
                src={user?.avatar?.url}
                alt="profile"
                className="w-[35px] h-[35px] rounded-full border"
              />
            </Link>
          ) : (
            <Link to="/login">
              <CgProfile size={28} />
            </Link>
          )}

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
          <div
            className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}
          >
            <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div
                    className="relative mr-[15px]"
                    onClick={() => setOpenWishlist(true) || setShowMobileMenu(false)}
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

              <div className="my-8 w-[92%] m-auto h-[40px relative]">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData && (
                  <div className="absolute bg-[#fff] z-10 shadow w-full left-0 p-3">
                    {searchData.map((i) => {
                      const d = i.name;

                      const Product_name = d.replace(/\s+/g, "-");
                      return (
                        // eslint-disable-next-line react/jsx-key
                        <Link to={`/product/${Product_name}`}>
                          <div className="flex items-center">
                            <img
                              src={i.image_Url[0]?.url}
                              alt=""
                              className="w-[50px] mr-2"
                            />
                            <h5>{i.name}</h5>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <Navbar active={activeHeading} />
              <div className={`$ ml-4 !rounded-[4px]`}>
                   {isSeller? <Link to="/dashboard"/>:  <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>}
               
              </div>
              <br />
              <br />
              <br />

              <div className="flex w-full justify-center">
                {isAuthenticated ? (
                  <div>
                    <Link to="/profile">
                      <img
                        src={`${user.avatar?.url}`}
                        alt=""
                        className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88]"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-[#000000b7]"
                    >
                      Login /
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-[18px] text-[#000000b7]"
                    >
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
