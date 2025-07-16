const Withdraw = require("../model/withdraw");
const Shop = require("../model/shop");
const sendMail = require("../utils/sendMail");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create withdraw request --- only for seller
exports.createWithdrawRequest = catchAsyncErrors(async (req, res, next) => {
  const { amount } = req.body;

  const data = {
    seller: req.seller,
    amount,
  };

  try {
    await sendMail({
      email: req.seller.email,
      subject: "Withdraw Request",
      message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3 to 7 days to complete.`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }

  const withdraw = await Withdraw.create(data);

  const shop = await Shop.findById(req.seller._id);
  shop.availableBalance -= amount;
  await shop.save();

  res.status(201).json({
    success: true,
    withdraw,
  });
});

// Get all withdraws --- admin
exports.getAllWithdrawRequests = catchAsyncErrors(async (req, res, next) => {
  const withdraws = await Withdraw.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    withdraws,
  });
});

// Update withdraw request --- admin
exports.updateWithdrawRequest = catchAsyncErrors(async (req, res, next) => {
  const { sellerId } = req.body;

  const withdraw = await Withdraw.findByIdAndUpdate(
    req.params.id,
    {
      status: "succeed",
      updatedAt: Date.now(),
    },
    { new: true }
  );

  const seller = await Shop.findById(sellerId);

  const transaction = {
    _id: withdraw._id,
    amount: withdraw.amount,
    updatedAt: withdraw.updatedAt,
    status: withdraw.status,
  };

  seller.transections = [...seller.transections, transaction];
  await seller.save();

  try {
    await sendMail({
      email: seller.email,
      subject: "Payment Confirmation",
      message: `Hello ${seller.name}, Your withdraw of ${withdraw.amount}$ is on the way. It usually takes 3 to 7 days to process.`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }

  res.status(200).json({
    success: true,
    withdraw,
  });
});
