const ErrorHandler = require("../utils/ErrorHandler");
const Coupone = require("../model/couponModel");
const asyncHandler = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");

exports.createCoupon = asyncHandler(async (req, res, next) => {
  let shopId = null;

  // If seller is creating the coupon, validate their shop
  if (req.seller?.id) {
    const sellerShop = await Shop.findById(req.seller.id);
    if (!sellerShop) {
      return next(new ErrorHandler("Shop ID is invalid!", 400));
    }
    shopId = req.seller.id;
  }

  const { name, value, minAmount, maxAmount, expire } = req.body;

  // 🔒 Check for existing coupon with same name for this shop or globally
  const existing = await Coupone.findOne({ name, shopId });
  if (existing) {
    return next(
      new ErrorHandler(
        shopId
          ? "A coupon with this name already exists for your shop."
          : "A global coupon with this name already exists.",
        400
      )
    );
  }

  const coupon = await Coupone.create({
    name,
    value,
    minAmount,
    maxAmount,
    expire: new Date(expire),
    shopId,
  });

  res.status(201).json({
    message: "Coupon created successfully",
    data: coupon,
  });
});




// get  coupon
exports.getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Coupone = await Coupone.findById(id);
  if (!document) {
    return next(new ErrorHandler(`No document for this id ${id}`, 404));
  }

  res.status(201).json({ message: " coupon ", data: Coupone });
});

// get all coupons


exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  // Find and delete the subCategory
  const document = await Coupone.findByIdAndDelete(id);
  if (!document) {
    return next(new ErrorHandler(`No coupon found for id ${id}`, 404));
  }
  
  res.status(200).json({
    message: "Couponedeleted",
  }); // No Content
});

exports.applyCoupon = async (req, res) => {
  try {
    const { name } = req.body;
    const coupon = await Coupone.findOne({ name });
    
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    if (coupon.expire < Date.now()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }
    
    res.status(200).json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupone.find(); // or filter by shop/seller if needed
  res.status(200).json({ success: true, data: coupons });
});


exports.getallcouponesofshop = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupons = await Coupone.find({ shopId: id });
  res.status(200).json({ success: true, data: coupons });
});
