const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");

// create new order

exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

  //   group cart items by shopId
  const shopItemsMap = new Map();

  for (const item of cart) {
    const shopId = item.shopId;
    if (!shopItemsMap.has(shopId)) {
      shopItemsMap.set(shopId, []);
    }
    shopItemsMap.get(shopId).push(item);
  }

  // create an order for each shop
  const orders = [];

  for (const [shopId, items] of shopItemsMap) {
    // Calculate total price for this shop's items
    const totalPrice = items.reduce((sum, item) => {
      return sum + item.price * item.qty;
    }, 0);
    const order = await Order.create({
      shopId,
      cart: items,
      totalPrice,
      shippingAddress,
      user,
      totalPrice,
      paymentInfo,
    });
    orders.push(order);
  }

  res.status(201).json({
    success: true,
    orders,
  });
});

exports.getAllOrdersOfUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await Order.find({ "user._id": req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get all orders of seller

exports.getAllordersOfSeller = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({
    "cart.shopId": req.params.shopId,
  }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

// update order status for seller

exports.updateOrderStatusOfSeller = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 400));
  }
  if (req.body.status === "Transferred to delivery partner") {
    order.cart.forEach(async (o) => {
      await updateOrder(o._id, o.qty);
    });
  }

  order.status = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
    order.paymentInfo.status = "Succeeded";
    const serviceCharge = order.totalPrice * 0.1;
    await updateSellerInfo(order.totalPrice - serviceCharge);
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });

  async function updateOrder(id, qty) {
    const product = await Product.findById(id);

    product.stock -= qty;
    product.sold_out += qty;

    await product.save({ validateBeforeSave: false });
  }

  async function updateSellerInfo(amount) {
    const seller = await Shop.findById(req.seller.id);

    seller.availableBalance = amount;

    await seller.save();
  }
});

// give a refund ----- user

exports.orderRefund = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 400));
  }

  order.status = req.body.status;

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
    message: "Order Refund Request successfully!",
  });
});

// accept the refund ---- seller

exports.orderRefundSuccess = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 400));
  }

  order.status = req.body.status;

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order Refund successfull!",
  });

  if (req.body.status === "Refund Success") {
    order.cart.forEach(async (o) => {
      await updateOrder(o._id, o.qty);
    });
  }

  async function updateOrder(id, qty) {
    const product = await Product.findById(id);

    product.stock += qty;
    product.sold_out -= qty;

    await product.save({ validateBeforeSave: false });
  }
});

// all orders --- for admin

exports.allOrdersForAdmin = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().sort({
    deliveredAt: -1,
    createdAt: -1,
  });
  res.status(201).json({
    success: true,
    orders,
  });
});
