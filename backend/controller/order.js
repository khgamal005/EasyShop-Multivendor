const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");

// create new order

exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  try {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

    if (!cart || cart.length === 0) throw new Error("Cart is empty");
    if (!shippingAddress) throw new Error("Shipping address missing");
    if (!user) throw new Error("User not found");

    // Group items by shop
    const shopItemsMap = new Map();
    for (const item of cart) {
      const shopId = item.shop?._id;
      if (!shopId) throw new Error("Missing shopId in cart item");

      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      shopItemsMap.get(shopId).push(item);
    }

    const orders = [];

    // Step 1: Calculate total subtotal (before applying flat discount)
    const totalRawSubtotal = cart.reduce((sum, item) => {
      return sum + item.discountPrice * item.qty;
    }, 0);

    // Step 2: Calculate subtotal per shop
    const shopSubtotals = new Map();
    for (const item of cart) {
      const shopId = item.shop._id;
      const itemTotal = item.discountPrice * item.qty;

      if (!shopSubtotals.has(shopId)) {
        shopSubtotals.set(shopId, 0);
      }
      shopSubtotals.set(shopId, shopSubtotals.get(shopId) + itemTotal);
    }

    // Step 3: Create orders and assign proportional total price
    for (const [shopId, items] of shopItemsMap.entries()) {
      const shopSubtotal = shopSubtotals.get(shopId);
      const proportionalTotal = (shopSubtotal / totalRawSubtotal) * totalPrice;

      const order = await Order.create({
        shopId,
        cart: items,
        totalPrice: parseFloat(proportionalTotal.toFixed(2)),
        shippingAddress,
        user,
        paymentInfo,
      });

      orders.push(order);
    }

    // ✅ Now send the response AFTER all orders are created
    res.status(201).json({ success: true, orders });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
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
    "cart.shop._id": req.params.shopId,
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
    for (const o of order.cart) {
      await updateOrder(o._id, o.qty);
    }
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
    seller.availableBalance += amount; // <- use += instead of =
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

async function updateOrder(id, qty) {
  const product = await Product.findById(id);
  if (!product) return;

  product.stock += qty; // Refund means returning stock
  product.sold_out -= qty;

  await product.save({ validateBeforeSave: false });
}
// accept the refund ---- seller

exports.orderRefundSuccess = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 400));
  }

  order.status = req.body.status;

  if (req.body.status === "Refund Success") {
    for (const o of order.cart) {
      await updateOrder(o._id, o.qty);
    }
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order refund successful!",
  });
});

// all orders --- for admin

exports.allOrdersForAdmin = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().sort({
    deliveredAt: -1,
    createdAt: -1,
  });
  res.status(200).json({
    success: true,
    orders,
  });
});
