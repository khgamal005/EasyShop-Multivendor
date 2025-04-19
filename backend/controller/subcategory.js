const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const subCategory = require("../model/subCategory");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const ApiFeatures = require("../utils/apiFeatures");

// Upload single image
exports.setCategoryIdToBody = (req, res, next) => {
    // Nested route
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
  };
  // @desc    Create subCategory
  // @route   POST  /api/v1/subcategories
  // @access  Private
  
  
  // Nested route
  // GET /api/v1/categories/:categoryId/subcategories
  exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    console.log(filterObject)
    next();
  };
  
// @desc    Create subCategory
// @route   POST  /api/v1/create-subCategory
// @access  Private

exports.createSubCategory = asyncHandler(async (req, res) => {
  const newDoc = await subCategory.create(req.body);
  res.status(201).json({ message: "subCategorycreated", data: newDoc });
});

// exports.updatesubCategory = asyncHandler(async (req, res, next) => {
//   // Find the existing document
//   const existingsubCategory = await subCategory.findById(req.params.id);
//   if (!existingsubCategory) {
//     return next(new ApiError(`No document for this id ${req.params.id}`, 404));
//   }

//   // If new image is provided, remove the old image file
//   if (req.body.image && existingsubCategory.image) {
//     // Extract old filename from URL if it's a full path
//     const oldFilename = existingsubCategory.image.split("/categories/")[1];
//     const oldImagePath = path.join(
//       __dirname,
//       "../uploads/categories",
//       oldFilename
//     );

//     fs.unlink(oldImagePath, (err) => {
//       if (err) {
//         console.error("Error deleting old image:", err.message);
//       } else {
//         console.log("Old image deleted:", oldFilename);
//       }
//     });
//   }

//   // Update the subCategorydocument
//   const document = await subCategory.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!document) {
//     return next(new ApiError(`No document for this id ${req.params.id}`, 404));
//   }

//   res.status(200).json({ data: document });
// });

// exports.deletesubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const existingsubCategory = await subCategory.findById(req.params.id);
//   if (!existingsubCategory) {
//     return next(new ApiError(`No document for this id ${req.params.id}`, 404));
//   }

//   // Delete image from disk if it exists
//   if (existingsubCategory.image) {
//     // Extract filename in case image is a full URL
//     const filename = existingsubCategory.image.split("/categories/")[1];
//     const imagePath = path.join(__dirname, "../uploads/categories", filename);

//     fs.unlink(imagePath, (err) => {
//       if (err) {
//         console.error("Error deleting image file:", err.message);
//       } else {
//         console.log("Image file deleted:", filename);
//       }
//     });
//   }
//   // Find and delete the subCategory 
//      const document = await  subCategory.findByIdAndDelete(id);
//   if (!document) {
//     return next(new ApiError(`No document for this id ${req.params.id}`, 404));
//   }

//   res.status(200).json({
//     message: "subCategorydeleted",
//   }); // No Content
// });

// exports.getsubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   // 1) Build query
//   const document = await subCategory.findById(id);

//   if (!document) {
//     return next(new ApiError(`No document for this id ${id}`, 404));
//   }
//   res.status(200).json({ data: document });
// });

// exports.getSubCategories = asyncHandler(async (req, res) => {
//   let filter = {};
//   if (req.filterObj) {
//     filter = req.filterObj;
//   }
//   // Build query
//   const documentsCounts = await subCategory.countDocuments();
//   const apiFeatures = new ApiFeatures(subCategory.find(filter), req.query)
//     .paginate(documentsCounts)
//     .filter()
//     .search(subCategory)
//     .limitFields()
//     .sort();

//   // Execute query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const documents = await mongooseQuery;

//   res
//     .status(200)
//     .json({ results: documents.length, paginationResult, data: documents });
// });
