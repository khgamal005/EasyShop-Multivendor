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

minAmount: {
  type: Number,
},
maxAmount: {
  type: Number,
},
shopId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Shop',
  required: false,
  default: null,
},
  selectedProduct: {
    type: String, // or Array if multiple
  },

  expire: {
    type: Date,
    required: [true, "Coupon expiry date is required"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});
couponSchema.index({ name: 1, shopId: 1 }, { unique: true });

module.exports = mongoose.model('Coupons', couponSchema);
