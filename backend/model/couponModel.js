const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your coupon code name!"],
    unique: true,
  },
  value: {
    type: Number,
    required: true,
  },
  isFlat: {
    type: Boolean,
    default: false, // sellers default to percentage
  },
  minAmount: {
    type: Number,
  },
  maxAmount: {
    type: Number,
  },
  shopId: {
    type: String,
    required: false,
    default: null,
  },
  selectedProduct: {
    type: String,
  },
  createdBy: {
    type: String,
    enum: ["admin", "seller"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Coupon', couponSchema);
