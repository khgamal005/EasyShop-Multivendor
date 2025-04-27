const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your product price!"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter your product stock!"],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Product must be belong to category'],
  },
  subcategories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'SubCategory',
    },
  ],
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: 'Brand',
  },
  // images: [
  //   {
  //     public_id: {
  //       type: String,
  //       required: true,
  //     },
  //     url: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
  images: [String],
  ratingsAverage: {
    type: Number,
    min: [1, 'Rating must be above or equal 1.0'],
    max: [5, 'Rating must be below or equal 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  shopId: {
    type: String,
    required: true,
  },
  // shop: {
  //   type: Object,
  //   required: true,
  // },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});


// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name -_id',
  });
  next();
});

module.exports = mongoose.model("Product", productSchema);
