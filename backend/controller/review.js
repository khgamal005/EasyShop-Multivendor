const ApiFeatures = require("../utils/apiFeatures");
const Review = require("../model/review");
const asyncHandler = require("express-async-handler");

// Nested route
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
  }
  // Build query
  const documentsCounts = await Review.countDocuments();
  const apiFeatures = new ApiFeatures(Review.find(filter), req.query)
    .paginate(documentsCounts)
    .filter()
    .search(Review)
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
});

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // 1) Build query
  const document = await Review.findById(id);

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});


// Nested route (Create)
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
// @desc    Create review
// @route   POST  /api/v1/reviews
// @access  Private/Protect/User
exports.createReview = asyncHandler(async (req, res) => {
  const newDoc = await Review.create(req.body);
  res.status(201).json({ message: "Review created", data: newDoc });
});

// @desc    Update specific review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Protect/User

exports.updateReview = asyncHandler(async (req, res, next) => {
  // Find the existing document
  const existinreview = await Review.findById(req.params.id);
  if (!existinreview) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  // Update the brand document
  const document = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

// @desc    Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/User-Admin-Manager
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find and delete the subCategory
  const document = await Review.findByIdAndDelete(id);
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({
    message: "Reviewdeleted",
  }); // No Content
});
