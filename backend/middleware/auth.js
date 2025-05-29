const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const Shop = require("../model/shop");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token, seller_token } = req.cookies;
  
    // Check if the user is logged in as an Admin (user)
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id);
      if (req.user) {
        req.role = req.user.role;
         return next(); // Set user role on req object
      }
    }
  
    // Check if the user is logged in as a Seller
    if (seller_token) {
      const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
      req.seller = await Shop.findById(decoded.id);
      if (req.seller) {
        req.role = req.seller.role;
         return next(); // Set seller role on req object
      }
    }
  
    // If neither is found, return error
    if (!req.user && !req.seller) {
      return next(new ErrorHandler("Please login to continue", 401));
    }
  
    next(); // Continue to the next middleware/handler
  });
  

exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies;
  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

  req.seller = await Shop.findById(decoded.id);

  next();
});

exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access this resources!`)
      );
    }
    next();
  };
};
exports.isAdminOrSeller = (req, res, next) => {
    // Log for debugging purposes
    console.log(req.role);
  
    // Check if the role is either 'admin' or 'seller'
    if (req.role === "admin" || req.role === "Seller") {
      return next();  // Proceed to the next middleware or route handler
    }
  
    // If role is not authorized, return an error
    return next(
      new ErrorHandler("You are not authorized to perform this action", 403)
    );
  };
  
