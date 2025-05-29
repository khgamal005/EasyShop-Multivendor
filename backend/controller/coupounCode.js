const ErrorHandler = require("../utils/ErrorHandler");
const CoupounCode = require("../model/couponModel");
const asyncHandler = require("../middleware/catchAsyncErrors");

// create coupoun code
exports.createCoupon = asyncHandler(async (req, res) => {
  const isCoupounCodeExists = await CoupounCode.find({
    name: req.body.name,
  });

  if (isCoupounCodeExists.length !== 0) {
    return next(new ErrorHandler("Coupoun code already exists!", 400));
  }

  const coupounCode = await CoupounCode.create(req.body);

  res.status(201).json({ message: " coupon created", data: coupounCode });
});

// get  coupon
exports.getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const CoupounCode = await CoupounCode.findById(id);
  if (!document) {
    return next(new ErrorHandler(`No document for this id ${id}`, 404));
  }

  res.status(201).json({ message: " coupon ", data: CoupounCode });
});

// get all coupons

exports.getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await CoupounCode.find(); // or filter by shop/seller if needed
  res.status(200).json({ success: true, data: coupons });
});

exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find and delete the subCategory
  const document = await CoupounCode.findByIdAndDelete(id);
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({
    message: "CoupounCodedeleted",
  }); // No Content
});

exports.applyCoupon = async (req, res) => {
  try {
    const { name } = req.body;
    const coupon = await CoupounCode.findOne({ name });

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
